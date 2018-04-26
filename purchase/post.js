module.exports={
	main:main
}

var api = require('../api.js')
var stringSimilarity = require('string-similarity');

let obj = {
	panMobile : panMobile,
	phone	: phone,
	pan		: pan,
	otp		: otp,
	holding : holding,
	amc 	: amc,
	subnature : subnature
	// name 	: name,
	// folio 	: folio,
	// amount 	: amount,
	// term 	: term,
	// mandate : mandate
}

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
		var phone = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/
		var pan = /[a-z]{3}p[a-z]\d{4}[a-z]/
		if((model.data.match(/\d+/)[0].length == 10 && model.data.match(phone) && model.data.toLowerCase().match(pan)) || (model.data.match(/\d+/)[0].length == 10 && model.data.match(phone)) || model.data.match(pan)) {
			if(model.data.match(phone) && model.data.toLowerCase().match(pan)){
				model.tags.phone = model.data.match(phone)[0]
				model.tags.pan = model.data.toLowerCase().match(pan)[0]
				api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
					response = JSON.parse(response)
					model.tags.session = response.Response[0].SessionId
					model.stage = 'otp' 
					resolve(model)
				})
			}
			else if(model.data.match(phone)){
				console.log('PHONE')
				model.tags.phone = model.data.match(phone)[0]
				model.stage = 'pan'
				resolve(model)
			}
			else if(model.data.match(pan)){
				console.log('PAN')
				model.tags.pan = model.data.match(pan)[0]
				delete model.stage
				resolve(model)
			}		
		}
		else{
			reject(model)
		}
	})
}

function phone(model){
	return new Promise(function(resolve, reject){
		var phone = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/
		if(model.data.match(/\d+/)[0].length == 10 && model.data.match(phone)){
			model.tags.phone = model.data.match(phone)[0]
			api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.session = response.Response[0].SessionId
				model.stage = 'otp'
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		var pan = /[a-z]{3}p[a-z]\d{4}[a-z]/
		if(model.data.toLowerCase().match(pan)){
			model.tags.pan = model.data.toLowerCase().match(pan)[0]
			api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.session = response.Response[0].SessionId
				delete model.stage
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.data.match(/\d{6}/)){
			model.tags.otp = model.data.match(/\d{6}/)[0]
			api.otp(model.tags.session, model.tags.otp, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.joinAcc = response.Response
				model.tags.joinAccId = []
				response.Response.forEach(function(element){
					model.tags.joinAccId.push(element.JoinAccId.toString())
				})
				delete model.stage
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccId.includes(model.data)){
			api.getAMC(model.tags.session, model.data, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.amcNames = {}
				response.Response[0].forEach(function(element){
					model.tags.amcNames[element.AMCName] = element.ID
				})
				// console.log(model.tags.amcNames)
				model.tags.amcOptions = {}
				response.Response[1].forEach(function(element){
					model.tags.amcOptions[element.AMCCode]=[];
					response.Response[1].forEach(function(ele){
						if(ele.AMCCode == element.AMCCode){
							model.tags.amcOptions[element.AMCCode].push(ele.OPTION)
						}
					})
				})
				// console.log(model.tags.amcOptions)
				model.tags.subNatures = {}
				response.Response[2].forEach(function(element){
					model.tags.subNatures[element.AMCCode]=[]
					response.Response[2].forEach(function(ele){
						if(ele.AMCCode == element.AMCCode){
							model.tags.subNatures[element.AMCCode].push(ele.SubNature)
						}
					})
				})
				// console.log(model.tags.subNatures)
				delete model.stage
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function amc(model){
	return new Promise(function(resolve, reject){
		if(model.data == model.tags.matches){
			model.tags.amc = model.data
			delete model.stage
			resolve(model)
		}
		else if(model.data){
			var matches = stringSimilarity.findBestMatch(model.data, Object.keys(model.tags.amcNames));
			model.tags.matches = matches.bestMatch.target
			resolve(model)
		}
		else{
			reject(model)
		}
	})
}

function subnature(model){
	return new Promise(function(resolve, reject){
		console.log(model.data)
		resolve(model)
	})
} 