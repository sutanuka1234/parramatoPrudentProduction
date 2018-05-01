module.exports={
	main:main
}

var api = require('../api.js')
var schemes = require('../schemes.js')
var words = require('../words.js')
var stringSimilarity = require('string-similarity');
var sortBy = require('sort-by')
var matchAll = require('match-all')

let obj = {
	panMobile : panMobile,
	mobile	: mobile,
	pan		: pan,
	otp		: otp,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps,
	amount 	: amount,
	holding : holding,
	folio 	: folio
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


var phone 		= /[789]\d{9}/
var pan 		= /[a-z]{3}p[a-z]\d{4}[a-z]/
var number		= /\d+/
var otpInput	= /\d{6}/
var regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/
var divOption 	= /re(-|\s)?invest|pay(\s)?out/
var regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
var schemeType 	= /dividend|growth/

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
		model.data = model.data.toLowerCase()
		console.log(model.data)
		if(model.data.match(phone) && model.tags.pan){
			model.tags.mobile = model.data.match(phone)[0]
		}
		if(model.data.match(pan) && model.tags.mobile){
			model.tags.pan = model.data.match(pan)[0]
		}
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
		else{
			if(model.tags.userSays.includes(',')){
				while(model.tags.userSays.includes(','))
		    		model.tags.userSays = model.tags.userSays.replace(',', '')
			}
			if(model.tags.userSays.match(/\d+(\s*)?(k)/)){
		       	model.tags.userSays = model.tags.userSays.replace('k', '000')
		    }
		    if(model.tags.userSays.match(/\d+(\s*)?(lakhs|lakh|lacs|l)/)){
		    	model.tags.userSays = model.tags.userSays.replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
		    }
			if(model.data.match(pan)){
				console.log('PAN')
				model.tags.pan = model.data.match(pan)[0]
				model.data = model.data.replace(model.tags.pan, '')
				model.stage = 'mobile'
			}
			if(model.data.match(phone)){
				console.log('PHONE')
				let text = matchAll(model.data, /(\d+)/gi).toArray()
				console.log(text)
				for(let i in text){
					if(text[i].length == 10){
						model.tags.mobile = text[i]
						model.data = model.data.replace(model.tags.mobile, '')
						model.stage = 'pan'
						break;
					}
				}
			}
			if(model.data.match(regexAmount)){
				console.log('Amount')
				let text = matchAll(model.data, /(\d+)/gi).toArray()
				console.log(text)
				for(let i in text){
					if(text[i].length < 8){
						model.tags.amount = text[i]
						model.data = model.data.replace(model.tags.amount, '')
						break;
					}
				}
			}
			if(model.data.match(divOption)){
				console.log('Dividend Option')
				model.tags.divOps = model.data.match(divOption)[0]
				model.data = model.data.replace(model.tags.divOps, '')
			}
			if(model.data.match(regexFolio)){
				console.log('Folio')
				model.tags.folio = model.data.match(regexFolio)[0].match(/\d+|new folio/)[0]
				model.data = model.data.replace(model.tags.folio, '')
			}
			let wordsInUserSays=model.tags.userSays.split(" ");
			let count=0;
			let startIndex;
			let endIndex;
			for(let wordIndex in wordsInUserSays){
				if(words.includes(wordsInUserSays[wordIndex])){
					count++;
					if(count==1){
						startIndex=wordIndex;
						endIndex=wordIndex;
					}
					else{
						endIndex=wordIndex;
					}
				}
			}
			if(count>0){
				let searchTerm=""
				for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
					searchTerm+=wordsInUserSays[i]+" "
				}
				searchTerm=searchTerm.trim();
				model.tags.schemes = []
				let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
				if(matches.bestMatch.rating>0.9){
					model.tags.schemes.push(bestMatch)
				}
				else{
					matches.ratings=matches.ratings.sort(sortBy('-rating'));
					model.tags.schemes = matches.ratings.splice(0,9);
				}
			}
			var matchType=model.tags.userSays.match(schemeType)
			if(matchType){
				model.tags.schemeType = matchType[0]
				model.tags.userSays=model.tags.userSays.replace(model.tags.schemeType, '')
			}
			console.log(model.tags)
			if(model.tags.pan && model.tags.mobile){
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
			else{	
				return resolve(model)	
			}
		}
	})	
}

function mobile(model){
	return new Promise(function(resolve, reject){
		// if(model.data.match(number)[0].length == 10 && model.data.match(phone)){
		// 	model.tags.mobile = model.data.match(phone)[0]
		// 	api.panMobile(model.tags.mobile, model.tags.pan)
		// 	.then(data=>{
		// 		console.log(data.body)
		// 		let response = JSON.parse(data.body)
		// 		if(response.Response[0].result=="FAIL"){
		// 			return reject(model)
		// 		}
		// 		model.tags.session = response.Response[0].SessionId
		// 		model.stage = 'otp' 
		// 		return resolve(model)
		// 	})
		// 	.catch(error=>{
		// 		console.log(error);
		// 		return reject(model)
		// 	})
		// }
		// else{
		// 	return reject(model)
		// }
		if(model.tags.userSays.includes(',')){
			while(model.tags.userSays.includes(','))
	    		model.tags.userSays = model.tags.userSays.replace(',', '')
		}
		if(model.tags.userSays.match(/\d+(\s*)?(k)/)){
	       	model.tags.userSays = model.tags.userSays.replace('k', '000')
	    }
	    if(model.tags.userSays.match(/\d+(\s*)?(lakhs|lakh|lacs|l)/)){
	    	model.tags.userSays = model.tags.userSays.replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
	    }
		if(model.data.match(phone)){
			console.log('PHONE')
			let text = matchAll(model.data, /(\d+)/gi).toArray()
			console.log(text)
			for(let i in text){
				if(text[i].length == 10){
					model.tags.mobile = text[i]
					model.data = model.data.replace(model.tags.mobile, '')
					model.stage = 'pan'
					break;
				}
			}
		}
		if(model.data.match(regexAmount)){
			console.log('Amount')
			let text = matchAll(model.data, /(\d+)/gi).toArray()
			console.log(text)
			for(let i in text){
				if(text[i].length < 8){
					model.tags.amount = text[i]
					model.data = model.data.replace(model.tags.amount, '')
					break;
				}
			}
		}
		if(model.data.match(divOption)){
			console.log('Dividend Option')
			model.tags.divOps = model.data.match(divOption)[0]
			model.data = model.data.replace(model.tags.divOps, '')
		}
		if(model.data.match(regexFolio)){
			console.log('Folio')
			model.tags.folio = model.data.match(regexFolio)[0].match(/\d+|new folio/)[0]
			model.data = model.data.replace(model.tags.folio, '')
		}
		console.log(model.tags)
		if(model.tags.pan && model.tags.mobile){
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
		else{	
			return resolve(model)	
		}
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		// if(model.data.toLowerCase().match(pan)){
		// 	model.tags.pan = model.data.toLowerCase().match(pan)[0]
		// 	api.panMobile(model.tags.mobile, model.tags.pan)
		// 	.then(data=>{
		// 		console.log(data.body)
		// 		let response = JSON.parse(data.body)
		// 		if(response.Response[0].result=="FAIL"){
		// 			return reject(model)
		// 		}
		// 		model.tags.session = response.Response[0].SessionId
		// 		delete model.stage 
		// 		return resolve(model)
		// 	})
		// 	.catch(error=>{
		// 		console.log(error);
		// 		return reject(model)
		// 	})
		// }
		// else{
		// 	return reject(model)
		// }
		if(model.tags.userSays.includes(',')){
				while(model.tags.userSays.includes(','))
		    		model.tags.userSays = model.tags.userSays.replace(',', '')
			}
			if(model.tags.userSays.match(/\d+(\s*)?(k)/)){
		       	model.tags.userSays = model.tags.userSays.replace('k', '000')
		    }
		    if(model.tags.userSays.match(/\d+(\s*)?(lakhs|lakh|lacs|l)/)){
		    	model.tags.userSays = model.tags.userSays.replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
		    }
			if(model.data.match(pan)){
				console.log('PAN')
				model.tags.pan = model.data.match(pan)[0]
				model.data = model.data.replace(model.tags.pan, '')
				model.stage = 'mobile'
			}
			if(model.data.match(regexAmount)){
				console.log('Amount')
				let text = matchAll(model.data, /(\d+)/gi).toArray()
				console.log(text)
				for(let i in text){
					if(text[i].length < 8){
						model.tags.amount = text[i]
						model.data = model.data.replace(model.tags.amount, '')
						break;
					}
				}
			}
			if(model.data.match(divOption)){
				console.log('Dividend Option')
				model.tags.divOps = model.data.match(divOption)[0]
				model.data = model.data.replace(model.tags.divOps, '')
			}
			if(model.data.match(regexFolio)){
				console.log('Folio')
				model.tags.folio = model.data.match(regexFolio)[0].match(/\d+|new folio/)[0]
				model.data = model.data.replace(model.tags.folio, '')
			}
			console.log(model.tags)
			if(model.tags.pan && model.tags.mobile){
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
			else{	
				return resolve(model)	
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
					if(model.tags.schemes){
						model.tags.schemeList = []
						for(let element of model.tags.schemes){
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
						}
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
		let matches = stringSimilarity.findBestMatch(model.data, Object.keys(schemes))
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
		delete model.stage
		resolve(model)
	})
}

function showSchemeName(model){
	return new Promise(function(resolve, reject){
		let arr = []
		for(let i in model.tags.schemes){
			arr.push(model.tags.schemes[i].target)
		}
		if(arr.includes(model.data)){
			model.tags.scheme = model.data
			if(schemes[model.data].optionCode == 1 || model.tags.divOption){
				model.tags.joinAccList = []
				for(let i in model.tags.joinAcc){
					model.tags.joinAccList.push({
						data : model.tags.joinAcc[i].JoinAccId,
						text : model.tags.joinAcc[i].JoinHolderName
					})
				}
				if(model.tags.amount && parseInt(model.tags.amount) > 499){
					model.stage = 'holding'
				}
				else{
					model.stage = 'amount'
				}
			}
			else{
				delete model.stage
			}
		}
		else{
			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(schemes))
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
		}
		resolve(model)
	})
}

function divOps(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes('reinvest') || model.data.toLowerCase().includes('payout')){
			model.tags.joinAccList = []
			for(let i in model.tags.joinAcc){
				model.tags.joinAccList.push({
					data : model.tags.joinAcc[i].JoinAccId,
					text : model.tags.joinAcc[i].JoinHolderName
				})
			}
			if(model.tags.amount && parseInt(model.tags.amount) > 499){
				model.stage = 'holding'
			}
			else{
				delete model.stage
			}
			resolve(model)
		}
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		if(model.data.match(/\d+/)){
			model.data.amount = model.data.match(/\d+/)[0]
			delete model.stage
			resolve(model)
		}
		else{
			reject(model)
		}	
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccId.includes(model.data)){
			api.getFolio(model.tags.session, model.data, schemes[model.tags.scheme].schemeCode, schemes[model.tags.scheme].amcCode)
			.then(response=>{
				console.log(response.body)
				response = JSON.parse(response.body)
				let arr = []
				for(let i in response.Response){
					arr.push(response.Response[i].FolioNo.toLowerCase())
				}
				if(model.tags.folio && arr.includes(model.tags.folio)){
					model.stage = 'final'
				}
				else if(response.Response.length > 0){
					model.tags.folioList = []
					for(let i in response.Response){
						model.tags.folioList.push({
							data : response.Response[i].FolioNo,
							text : response.Response[i].FolioNo
						})
					}
					delete model.stage
				}
				else{
					model.tags.folioNo = response.Response[0].FolioNo
					delete model.stage
				}
				resolve(model)
			})
			.catch(e=>{
				console.log(e)
				reject(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function folio(model){
	return new Promise(function(resolve, reject){
		let arr = []
		for(let i in model.tags.folioList){
			arr.push(model.tags.folioList[i].data)
		}
		if(arr.includes(model.data)){
			delete model.stage
			resolve(model)
		}
		else{
			reject(model)
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