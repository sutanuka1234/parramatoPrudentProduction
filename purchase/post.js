module.exports={
	main:main
}

var api = require('../api.js')
// var schemes = require('../schemes.js')
var words = require('../words.js')
var data = require('../data.js')
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
	folio 	: folio,
	buyCart : buyCart,
	mandate : mandate
}


var regexMobile	= /[789]\d{9}/gi
var regexPan 	= /[a-z]{3}p[a-z]\d{4}[a-z]/
var number		= /\d+/
var regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/gi
var divOption 	= /re(-|\s)?invest|pay(\s)?out/
var regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
var schemeType 	= /dividend|growth/
var regexOtp    = /\d{6}/
var schemeNames = Object.keys(data)
var amc = [  
	'kotak',
	'birla',
	'sun life',
	'aditya',
	'sundaram',
	'sbi',
	'uti',
	'dsp',
	'black rock',
	'blackrock',
	'franklin',
	'templeton',
	'tata',
	'reliance',
	'idbi',
	'icici',
	'hdfc',
	'lic',
	'axis',
	'l&t',
	'lnt',
	'l and t',
	'bnp',
	'paribas',
	'baroda',
	'pioneer',
	'idfc',
	'invesco',
	'boi',
	'axa',
	'canara',
	'robeco',
	'dhfl',
	'pramerica',
	'mirae',
	'mahindra',
	'motilal',
	'oswal',
	'principal pnb'
]

function main(req, res){
	return new Promise(function(resolve, reject){
		console.log(req.params.stage)
		obj[req.params.stage](req.body)
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
			model=dataClean(model);
			if(model.data&&!model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){
					return reject(model);
			}
			model = extractPan(model);
			model = extractMobile(model);
			model = extractAmount(model);
			model = extractFolio(model);
			model = extractDivOption(model);
			model=extractSchemeName(model);
			if(model.tags.pan&&model.tags.mobile){
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
			else if(model.tags.pan&&!model.tags.mobile){
				model.stage = 'mobile' 
				return resolve(model)
			}
			else if(!model.tags.pan){
				model.stage = 'pan' 
				return resolve(model)
			}
			else{
				return reject(model);

			}


	})
}

function mobile(model){
	return new Promise(function(resolve, reject){
		    model=dataClean(model);
			model = extractMobile(model);
			model = extractAmount(model);
			model = extractFolio(model);
			model = extractDivOption(model);
			model=extractSchemeName(model);
			if(model.tags.pan&&model.tags.mobile){
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
				return reject(model);

			}
	
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
			model = dataClean(model);
			model = extractPan(model);
			model = extractAmount(model);
			model = extractFolio(model);
			model = extractDivOption(model);
			model=extractSchemeName(model);
			if(model.tags.pan&&model.tags.mobile){
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
				return reject(model);

			}


	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		model=dataClean(model);
		model = extractOTP(model);
		model = extractDivOption(model);
		model = extractSchemeName(model);
		if(model.tags.otp){
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
		let matches = stringSimilarity.findBestMatch(model.data, Object.keys(data))
		model = extractDivOption(model)
		model = extractAmount(model)
		model = extractFolio(model)
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
		model = extractDivOption(model)
		model = extractAmount(model)
		model = extractFolio(model)
		let arr = []
		for(let i in model.tags.schemes){
			arr.push(model.tags.schemes[i].target)
		}
		if(arr.includes(model.data)){
			model.tags.scheme = model.data
			if(data[model.tags.scheme].optionCode == 1 || model.tags.divOption){
				if(model.tags.divOption){
					if(model.tags.divOption.includes('re') && data[model.tags.scheme].optionCode != 1){
						model.tags.divOption = 2
					}
					else if(model.tags.divOption.includes('pay') && data[model.tags.scheme].optionCode != 1){
						model.tags.divOption = 2
					}
					else{
						model.tags.divOption = 0
					}
					if(model.tags.amount && parseInt(model.tags.amount) > 499){
						model.stage = 'holding'
					}
					else{
						model.stage = 'amount'
					}
				}
				model.tags.joinAccList = []
				for(let i in model.tags.joinAcc){
					model.tags.joinAccList.push({
						data : model.tags.joinAcc[i].JoinAccId,
						text : model.tags.joinAcc[i].JoinHolderName
					})
				}
				if(model.tags.amount && parseInt(model.tags.amount) > 499){
					console.log(model.tags.amount)
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
			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(data))
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
		model = extractAmount(model)
		model = extractFolio(model)
		if(model.data.toLowerCase().includes('reinvest') || model.data.toLowerCase().includes('payout')){
			if(model.data.includes('re')){
				model.tags.divOption = 2
			}
			else if(model.data.includes('pay')){
				model.tags.divOption = 2
			}
			else{
				model.tags.divOption = 0
			}
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
		else{
			reject(model)
		}
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		if(parseInt(model.data) > 499){
			model.data.amount = model.data.match(/\d+/)[0]
			delete model.stage
			return resolve(model)
		}
		else{
			return reject(model)
		}	
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccId.includes(model.data)){
			model.tags.joinAccId = model.data
			api.getFolio(model.tags.session, model.data, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode)
			.then(response=>{
				console.log(response.body)
				response = JSON.parse(response.body)
				let arr = []
				for(let i in response.Response){
					arr.push(response.Response[i].FolioNo.toLowerCase())
				}
				if(model.tags.folio && arr.includes(model.tags.folio)){
					api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, model.tags.scheme, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, 'E20391')
					.then((data)=>{
						data = JSON.parse(data)
						console.log(data.body.Response[0].result)
						if(data.body.Response[0].result != 'FAIL'){
							model.tags.bankMandateList = []
							for(let i in data.body.Response[0][1]){
								model.tags.bankMandateList.push({
									title: data.body.Response[1][i].BankAccount,
									text : data.body.Response[1][i].BankAccount.split('-')[2],
									buttons = [
										text : 'Select',
										data : data.body.Response[1][i].MandateID
									]
								})
							}
							model.stage = 'buyCart'
						}
						else{
							reject(model)
						}
					})
					.catch((e)=>{
						console.log(e)
						reject(model)
					})
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
		model.tags.amcName = data[model.tags.scheme].amcName
		if(arr.includes(model.data)){
			if(model.data.includes('new')){
				model.tags.folio = '0'
			}
			else{
				model.tags.folio = model.data
			}
			api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, 'E020391')
			.then((data)=>{
				console.log(data.body)
				data.body = JSON.parse(data.body)
				console.log(data.body.Response[0].result)
				if(data.body.Response[0].result != 'FAIL'){
					model.tags.bankMandateList = []
					for(let i in data.body.Response[1]){
						model.tags.bankMandateList.push({
							title: data.body.Response[1][i].BankAccount,
							text : data.body.Response[1][i].BankAccount.split('-')[2]
							buttons = [
								text : 'Select',
								data : data.body.Response[1][i].MandateID
							]
						})
					}
					delete model.stage
					resolve(model)
				}
				else{
					reject(model)
				}
			})
			.catch((e)=>{
				console.log(e)
				reject(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function buyCart(model){
	return new Promise(function(resolve, reject){
		let arr = []
		for(let i in model.tags.bankMandateList){
			arr.push(model.tags.bankMandateList[i].data)
		}
		if(arr.includes(model.data)){
			model.tags.bankMandate = model.data
			api.bankMandate(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, model.data, model.tags.amount)
			.then((data)=>{
				console.log(data.body)
				data.body = JSON.parse(data.body)
				if(data.body){
					model.tags.paymentSummary = data.body.Response[0]
					delete model.stage
					resolve(model)
				}
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

function mandate(model){
	return new Promise(function(resolve, reject){
		resolve(model)
	})
}

function extractOTP(model){
	if(model.data.match(regexOtp)){
		model.tags.otp = model.data.match(regexOtp)[0]
		model.data = model.data.replace(model.tags.regexOtp, '')
	}
	return model;
}

function extractDivOption(model){
	if(model.data.match(divOption)){
		model.tags.divOption = model.data.match(divOption)[0]
		model.data = model.data.replace(model.tags.divOption, '')
	}
	return model;
			
}

function extractFolio(model){
	if(model.data.match(regexFolio)){

		model.tags.folio = model.data.match(regexFolio)[0].match(/\d+|new folio/)[0]
		model.data = model.data.replace(model.tags.folio, '')
	}
	return model;
}
function extractAmount(model){
			let text = matchAll(model.data, /(\d+)/gi).toArray()
			for(let i in text){
				if(text[i].length < 8){
					model.tags.amount = text[i]
					model.data = model.data.replace(model.tags.amount, '')
					break;
				}
			}
			return model;
}

function extractMobile(model){
	console.log(model.data)
	let text = matchAll(model.data, /(\d+)/gi).toArray()
	console.log(text)
	for(let i in text){
		if(text[i].length == 10){
			model.tags.mobile = text[i]
			model.data = model.data.replace(model.tags.mobile, '')
			break;
		}
	}
	console.log(model.tags)
	return model;
}

function extractPan(model){
	var matchPan=model.data.match(regexPan)
	if(matchPan){
		model.tags.pan = matchPan[0]
		model.data=model.data.replace(model.tags.pan, '')
	}
	return model;
}

function extractSchemeName(model){
		let wordsInUserSays=model.data.split(" ");
		let count=0;
		let startIndex;
		let endIndex;
		let amcIndex;
		let amcFlag;
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
			if(amc.includes(wordsInUserSays[wordIndex])&&!amcFlag){
				amcIndex=wordIndex;
				amcFlag=true;
			}
		}
		if(amcFlag){
			startIndex=amcIndex
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
		return model;
}

function dataClean(model){
	model.data = model.data.toLowerCase()
	if(model.data.includes(',')){
		while(model.data.includes(','))
    		model.data = model.data.replace(',', '')
	}
	if(model.data.match(/\d+\s*k/)){
		let a = model.data
   		a = a.match(/\d+\s*k/)[0].replace(/\s+/, '').replace('k', '000')
   		model.data = model.data.replace(/\d+\s*k/, a)
	}
    if(model.data.match(/\d+(\s*)?(lakhs|lakh|lacs|l)/)){
    	let a = model.data
		a = a.match(/\d+\s*(lakhs|lakh|lacs|l)/)[0].replace(/\s+/, '').replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
    	model.data = model.data.replace(/\d+\s*(lakhs|lakh|lacs|l)/, a)
    }
    return model;
}