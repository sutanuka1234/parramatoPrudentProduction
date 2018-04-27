module.exports={
	main:main
}

var api = require('../api.js')
var schemes = require('../schemes.js')
var stringSimilarity = require('string-similarity');

let obj = {
	panMobile : panMobile,
	mobile	: mobile,
	pan		: pan,
	otp		: otp,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps
	// holding : holding,
	// amc 	: amc,
	// type 	: type,
	// subnature : subnature,
	// category: category
	// name 	: name,
	// folio 	: folio,
	// amount 	: amount,
	// term 	: term,
	// mandate : mandate
}


var phone = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/
var pan = /[a-z]{3}p[a-z]\d{4}[a-z]/
var number=/\d+/
var otpInput=/\d{6}/

function main(req, res){
	return new Promise(function(resolve, reject){
		console.log(req.url.split('/')[3])
		obj[req.url.split('/')[3]](req.body)
		.then((data)=>{
			res.send(data)
		})
		.catch((e)=>{
			console.log(e)
			res.sendStatus(203)
		})
	})
}

function panMobile(model){
	return new Promise(function(resolve, reject){
		if(model.tags.mobile && model.tags.pan){
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				console.log(data.body)
				let response = JSON.parse(data.body)

				if(response.Response[0].result=="FAIL"){
					return reject(model)
				}
				model.tags.session = response.Response[0].SessionId
				model.stage = 'otp' 
				return resolve(model)
			})
			.catch(error=>{
				console.log(error);
				return reject(model)
			})
		}
		else if(model.data.match(number)[0].length == 10 && model.data.match(phone) && model.data.toLowerCase().match(pan)){
			model.tags.mobile = model.data.match(phone)[0]
			model.tags.pan = model.data.toLowerCase().match(pan)[0]
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				let response = JSON.parse(data.body)
				if(response.Response[0].result=="FAIL"){
					return reject(model)
				}
				model.tags.session = response.Response[0].SessionId
				model.stage = 'otp' 
				return resolve(model)
			})
			.catch(error=>{
				console.log(error);
				return reject(model)
			})
		}
		else{
			 if(model.data.match(phone)){
				console.log('PHONE')
				model.tags.mobile = model.data.match(phone)[0]
				model.stage = 'pan'
				return resolve(model)
			}
			if(model.data.match(pan)){
				console.log('PAN')
				model.tags.pan = model.data.match(pan)[0]
				delete model.stage
				return resolve(model)
			}	
			return reject(model)	
		}
	})	
}

function mobile(model){
	return new Promise(function(resolve, reject){
		if(model.data.match(number)[0].length == 10 && model.data.match(phone)){
			model.tags.mobile = model.data.match(phone)[0]
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				let response = JSON.parse(data.body)
				if(response.Response[0].result=="FAIL"){
					return reject(model)
				}
				model.tags.session = response.Response[0].SessionId
				model.stage = 'otp' 
				return resolve(model)
			})
			.catch(error=>{
				console.log(error);
				return reject(model)
			})
		}
		else{
			return reject(model)
		}
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().match(pan)){
			model.tags.pan = model.data.toLowerCase().match(pan)[0]
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				let response = JSON.parse(data.body)
				if(response.Response[0].result=="FAIL"){
					return reject(model)
				}
				model.tags.session = response.Response[0].SessionId
				delete model.stage 
				return resolve(model)
			})
			.catch(error=>{
				console.log(error);
				return reject(model)
			})

		}
		else{
			return reject(model)
		}
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.data.match(otpInput)){
			model.tags.otp = model.data.match(otpInput)[0]
			api.otp(model.tags.session, model.tags.otp)
			.then(data=>{
				try{
					console.log(data.body)
					let response = JSON.parse(data.body)
					if(response.Response[0].result=="FAIL"){
						return reject(model)
					}
					model.tags.joinAcc = response.Response
					model.tags.joinAccId = []
					response.Response.forEach(function(element){
						model.tags.joinAccId.push(element.JoinAccId.toString())
					})
					if(model.tags.schemes&&model.tags.scheme.length>0){
						model.stage = 'showSchemeName'
					}
					else{
						delete model.stage
					}
					return resolve(model)
				}
				catch(e){
					return reject(model);
				}
			})
			.catch(error=>{
				console.log(error);
				return reject(model)
			})
		}
		else{
			return reject(model)
		}
	})
}

function askSchemeName(model){
	return new Promise(function(resolve, reject){
		let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
		if(matches.bestMatch.rating>0.9){
			model.tags.schemes.push(bestMatch)
		}
		else{
			matches.ratings=matches.ratings.sort(sortBy('-rating'));
			model.tags.schemes = matches.ratings.splice(0,9);
		}
		if(model.tags.schemes){
			model.tags.schemeList = []
			model.tags.schemes.forEach(function(element){
				model.tags.schemeList.push({
					title 	: 'Schemes',
					text 	: element.target,
					buttons : [
						{
							text : 'Select',
							data : element.target
						}
					]
				})
			})
		}
		resolve(model)
	})
}

function showSchemeName(model){
	return new Promise(function(resolve, reject){
		if(model.tags.schemeList.includes(model.data) && !model.tags.divOption){
			if(schemes[model.data].optionCode == 1){
				model.stage = 'final'
			}
			else{
				delete model.stage
			}
			resolve(model)
		}
	})
}

function divOps(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes('reinvest') || model.data.toLowerCase().includes('payout')){
			delete model.stage
			resolve(model)
		}
	})
}































// function holding(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.tags.joinAccId.includes(model.data)){
// 			api.getAMC(model.tags.session, model.data, (err, http, response)=>{
// 				response = JSON.parse(response)
// 				model.tags.amcNames = {}
// 				response.Response[0].forEach(function(element){
// 					model.tags.amcNames[element.AMCName] = element.ID
// 				})
// 				// console.log(model.tags.amcNames)
// 				model.tags.amcOptions = {}
// 				response.Response[1].forEach(function(element){
// 					model.tags.amcOptions[element.AMCCode]=[];
// 					response.Response[1].forEach(function(ele){
// 						if(ele.AMCCode == element.AMCCode){
// 							model.tags.amcOptions[element.AMCCode].push(ele.OPTION)
// 						}
// 					})
// 				})
// 				// console.log(model.tags.amcOptions)
// 				model.tags.subNatures = {}
// 				response.Response[2].forEach(function(element){
// 					model.tags.subNatures[element.AMCCode]=[]
// 					response.Response[2].forEach(function(ele){
// 						if(ele.AMCCode == element.AMCCode){
// 							model.tags.subNatures[element.AMCCode].push(ele.SubNature)
// 						}
// 					})
// 				})
// 				// console.log(model.tags.subNatures)
// 				delete model.stage
// 				resolve(model)
// 			})
// 		}
// 		else{
// 			reject(model)
// 		}
// 	})
// }

// function amc(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.data == model.tags.matches){
// 			model.tags.amc = model.data
// 			delete model.stage
// 			resolve(model)
// 		}
// 		else if(model.data){
// 			var matches = stringSimilarity.findBestMatch(model.data, Object.keys(model.tags.amcNames));
// 			model.tags.matches = matches.bestMatch.target
// 			resolve(model)
// 		}
// 		else{
// 			reject(model)
// 		}
// 	})
// }

// function type(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.data.toLowerCase.includes('dividend') || model.data.toLowerCase().includes('growth')){
// 			model.tags.type = model.data
// 			delete model.stage
// 			resolve(model)
// 		}
// 		else{
// 			reject(model)
// 		}
// 	})
// }

// function subnature(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.tags.subNatures[model.tags.amcNames[model.tags.matches]].includes(model.data)){
// 			model.tags.subnature = model.data
// 			delete model.stage
// 			resolve(model)
// 		}
// 		else{
// 			reject(model)
// 		}
// 	})
// } 

// function category(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.data.toLowerCase().includes('suggested funds') || model.data.toLowerCase().includes('all funds') || model.data.toLowerCase().includes('nfo') || model.data.toLowerCase().includes('fmp')){
// 			model.tags.category = model.data
// 			api.getScheme()
// 			delete model.stage
// 			resolve(model)
// 		}
// 		else{
// 			reject(model)
// 		}
// 	})
// }