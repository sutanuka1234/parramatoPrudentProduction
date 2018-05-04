module.exports={
	main:main
}

var api = require('../api.js')
var external = require('../external.js')
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
	bankMandate : bankMandate
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
		else if(model.data&&model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){
			if(model.tags.pan&&model.tags.mobile){
				api.panMobile(model.tags.mobile, model.tags.pan)
				.then(data=>{
					console.log(data.body)
					let response;
					try{
						response = JSON.parse(data.body)
					}
					catch(e){console.log(e);
						if(!model.tags.mobile){
							model.stage = 'mobile' 
							return resolve(model)
						}
						else if(!model.tags.pan){
							model.stage = 'pan' 
							return resolve(model)
						}		
						return reject(model);
					}
					if(response.Response[0].result=="FAIL"){
						if(response.Response[0]['reject_reason']=="Client does not exists."){
							response.Response[0]['reject_reason']="Your pan and mobile combination does not seem to be valid."
						}
						let reply={
			                text    : response.Response[0]['reject_reason'],
			                type    : "text",
			                sender  : model.sender,
			                language: "en"
			            }
						external(reply)
						.then((data)=>{ 
			                model.tags.pan=undefined;
			                model.tags.mobile=undefined;
							return resolve(model)
			            })
			            .catch((e)=>{
			                console.log(e);
			                if(!model.tags.mobile){
								model.stage = 'mobile' 
								return resolve(model)
							}
							else if(!model.tags.pan){
								model.stage = 'pan' 
								return resolve(model)
							}		
			                return reject(model)
			            })
					}
					else{
						model.tags.session = response.Response[0].SessionId
						model.stage = 'otp' 
						return resolve(model)
					}
				})
				.catch(error=>{
					console.log(error);
					if(!model.tags.mobile){
						model.stage = 'mobile' 
						return resolve(model)
					}
					else if(!model.tags.pan){
						model.stage = 'pan' 
						return resolve(model)
					}		
					return reject(model)
				})		
			}
		}
		else if(model.data&&model.data.includes("proceed")&&(model.tags.mobile||model.tags.pan)){
			if(!model.tags.mobile){
				model.stage = 'mobile' 
				return resolve(model)
			}
			else if(!model.tags.pan){
				model.stage = 'pan' 
				return resolve(model)
			}
		}
		else{ 
			model = extractPan(model);
			model = extractMobile(model);
			model = extractDivOption(model);
			model = extractSchemeName(model);
			model = extractAmount(model);
			model = extractFolio(model);
			if(model.tags.pan&&model.tags.mobile){
				api.panMobile(model.tags.mobile, model.tags.pan)
				.then(data=>{
					console.log(data.body)
					let response;
					try{
						response = JSON.parse(data.body)
					}
					catch(e){console.log(e);
						if(!model.tags.mobile){
							model.stage = 'mobile' 
							return resolve(model)
						}
						else if(!model.tags.pan){
							model.stage = 'pan' 
							return resolve(model)
						}		
						return reject(model);
					}
					if(response.Response[0].result=="FAIL"){
						if(response.Response[0]['reject_reason']=="Client does not exists."){
							response.Response[0]['reject_reason']="Your pan and mobile combination does not seem to be valid."
						}
						let reply={
			                text    : response.Response[0]['reject_reason'],
			                type    : "text",
			                sender  : model.sender,
			                language: "en"
			            }
						external(reply)
						.then((data)=>{ 
			                model.tags.pan=undefined;
			                model.tags.mobile=undefined;
							return resolve(model)
			            })
			            .catch((e)=>{
			                console.log(e);
			                if(!model.tags.mobile){
								model.stage = 'mobile' 
								return resolve(model)
							}
							else if(!model.tags.pan){
								model.stage = 'pan' 
								return resolve(model)
							}		
			                return reject(model)
			            })
					}
					else{
						model.tags.session = response.Response[0].SessionId
						model.stage = 'otp' 
						return resolve(model)
					}
				})
				.catch(error=>{
					console.log(error);
					if(!model.tags.mobile){
						model.stage = 'mobile' 
						return resolve(model)
					}
					else if(!model.tags.pan){
						model.stage = 'pan' 
						return resolve(model)
					}		
					return reject(model)
				})		
			}
			else{
				if(!model.tags.mobile){
					model.stage = 'mobile' 
					return resolve(model)
				}
				else if(!model.tags.pan){
					model.stage = 'pan' 
					return resolve(model)
				}		
				return reject(model);
			}
		}
	})
}
function mobile(model){
	return new Promise(function(resolve, reject){
		    model=dataClean(model);
			model = extractMobile(model);
			model = extractDivOption(model);
			model=extractSchemeName(model);
			model = extractAmount(model);
			model = extractFolio(model);
			if(model.tags.pan&&model.tags.mobile){
					api.panMobile(model.tags.mobile, model.tags.pan)
					.then(data=>{
						console.log(data.body)
						let response;
						try{
							response = JSON.parse(data.body)
						}
						catch(e){console.log(e);
							return reject(model);
						}
						if(response.Response[0].result=="FAIL"){
							if(response.Response[0]['reject_reason']=="Client does not exists."){
								response.Response[0]['reject_reason']="Your pan and mobile combination does not seem to be valid."
							}
							let reply={
				                text    : response.Response[0]['reject_reason'],
				                type    : "text",
				                sender  : model.sender,
				                language: "en"
				            }
							external(reply)
							.then((data)=>{
				                model.stage = 'panMobile' 
				                model.tags.pan=undefined;
				                model.tags.mobile=undefined;
								return resolve(model)
				            })
				            .catch((e)=>{
				                console.log(e);
				                return reject(model)
				            })
						}
						else{
							model.tags.session = response.Response[0].SessionId
							model.stage = 'otp' 
							return resolve(model)
						}
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
			model = extractDivOption(model);
			model=extractSchemeName(model);
			model = extractAmount(model);
			model = extractFolio(model);
			if(model.tags.pan&&model.tags.mobile){
					api.panMobile(model.tags.mobile, model.tags.pan)
					.then(data=>{
						console.log(data.body)
						let response;
						try{
							response = JSON.parse(data.body)
						}
						catch(e){console.log(e);
							return reject(model);
						}
						if(response.Response[0].result=="FAIL"){
							if(response.Response[0]['reject_reason']=="Client does not exists."){
								response.Response[0]['reject_reason']="Your pan and mobile combination does not seem to be valid."
							}
							let reply={
				                text    : response.Response[0]['reject_reason'],
				                type    : "text",
				                sender  : model.sender,
				                language: "en"
				            }
							external(reply)
							.then((data)=>{
				                model.stage = 'panMobile' 
				                model.tags.pan=undefined;
				                model.tags.mobile=undefined;
								return resolve(model)
				            })
				            .catch((e)=>{
				                console.log(e);
				                return reject(model)
				            })
						}
						else{
							model.tags.session = response.Response[0].SessionId
							model.stage = 'otp' 
							return resolve(model)
						}
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
					let response;
					try{
						response = JSON.parse(data.body)
					}
					catch(e){console.log(e);
						return reject(model);
					}
					if(response.Response[0].result=="FAIL"){
						let reply={
			                text    : response.Response[0]['reject_reason'],
			                type    : "text",
			                sender  : model.sender,
			                language: "en"
			            }
						external(reply)
						.then((data)=>{
							return reject(model)
			            })
			            .catch((e)=>{
			                console.log(e);
			                return reject(model)
			            })
					}
					else{
						model.tags.joinAcc = response.Response
						model.tags.joinAccId = []
						response.Response.forEach(function(element){
							model.tags.joinAccId.push(element.JoinAccId.toString())
						})
						if(model.tags.schemes && model.tags.schemes.length > 0){
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
					
				}
				catch(e){
					console.log(e);
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
			model.tags.schemes.push(matches.bestMatch.target)
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
		// model = extractAmount(model)
		model = extractFolio(model)
		let arr = []
		for(let i in model.tags.schemes){
			arr.push(model.tags.schemes[i].target)
		}
		console.log(model.data)
		console.log(JSON.stringify(model.tags.schemes))
		if(arr.includes(model.data) || (model.data.toLowerCase().includes("yes")&&model.tags.schemes.length==1)){
			if(model.tags.schemes.length==1){
				model.tags.scheme=model.tags.schemes[0]
			}
			else{
				model.tags.scheme = model.data
			}
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
					model.stage = 'holding'
					
				}
				model.tags.divOption = 0
				model.tags.joinAccList = []
				for(let i in model.tags.joinAcc){
					model.tags.joinAccList.push({
						title: 'Holding Patterns',
						text : model.tags.joinAcc[i].JoinHolderName,
						buttons : [{
							data : model.tags.joinAcc[i].JoinAccId,
							text : 'Select'
						}]
					})
				}
				model.stage = 'holding'
				
			}
			else{
				delete model.stage
			}
		}
		else{
			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(data))
			if(matches.bestMatch.rating>0.9){
				model.tags.schemes.push(matches.bestMatch.target)
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
			model.stage = 'holding'
			
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
			model.tags.joinAccId = model.data
			api.getScheme(model.tags.session, model.tags.joinAccId, '1', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode)
			.then((data)=>{
				console.log(data.body)
				try{
					data.body = JSON.parse(data.body)
				}
				catch(e){
					console.log(e)
				}
				if(data.body.Response[0][0].FUNDNAME){
					console.log(data)
					api.getFolio(model.tags.session, model.data, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode)
					.then(response=>{
						console.log(response.body)
						try{
							response = JSON.parse(response.body)
						}
						catch(e){console.log(e);
							return reject(model);
						}
						let arr = []
						for(let i in response.Response){
							arr.push(response.Response[i].FolioNo.toLowerCase())
						}
						// if(model.tags.folio && arr.includes(model.tags.folio)){
						// 	model.stage="amount";
						// }
						if(response.Response.length > 0){
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
						return resolve(model)
					})
					.catch(e=>{
						console.log(e)
						return reject(model)
					})
				}
				else{
					let reply={
		                text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account',
		                type    : "text",
		                sender  : model.sender,
		                language: "en"
		            }
					external(reply)
					.then((data)=>{
						model.stage = 'askSchemeName'
						return resolve(model)
		            })
		            .catch((e)=>{
		                console.log(e);
		                return reject(model)
		            })
				}
			})
			.catch(e=>{
				console.log(e)
				return reject(model)
			})
		}
		else{
			return reject(model)
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
			if(model.tags.amount){
				api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, 'E020391')
				.then((data)=>{
					console.log(data.body)
					try{
						data.body = JSON.parse(data.body)
					}
					catch(e){
						delete model.stage
						return resolve(model)
					}
					if(data.body.Response[0][0].SchemeCode && data.body.Response[0][0].SchemeName){
						model.tags.bankMandateList = []
						let maxAmountPossible=0;
						for(let element of data.body.Response[1]){
							let possibleAmount
							try{
								possibleAmount=element.BankAccount.split('-')[2].match(/\d+/)[0]
								if(possibleAmount){
									possibleAmount=parseInt(possibleAmount);
									if(maxAmountPossible<possibleAmount){
										maxAmountPossible=possibleAmount;
									}
								}
							}
							catch(e){
								console.log(e)
							}
							let expectedAmount=parseInt(model.tags.amount);
							if(expectedAmount<=possibleAmount){
								model.tags.bankMandateList.push({
									title: element.BankAccount.split('-')[0],
									text : element.BankAccount.split('-')[2],
									buttons : [{
										text : 'Select',
										data : element.MandateID
									}]
								})
							}
						}
						console.log(model.tags.bankMandateList)
						if(model.tags.bankMandateList.length==0){
							delete model.stage
							return resolve(model)
						}
						else{
							model.stage = 'bankMandate'
							return resolve(model)
						}
					}
					else{
						delete model.stage
						return resolve(model)
					}
				})
				.catch((e)=>{
					delete model.stage
					return resolve(model)
				})
			}
			else{
				delete model.stage
				return resolve(model)
			}
		}
		else{
			return reject(model)
		}
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		model=extractAmount(model)
		if(model.tags.amount){
			console.log(model.tags.joinAccId)
			console.log(data[model.tags.scheme].schemeCode)
			console.log(data[model.tags.scheme].amcName)
			console.log(data[model.tags.scheme].amcCode)
			console.log(model.tags.divOption)
			console.log(model.tags.amount)
			console.log(model.tags.folio)
			api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, 'E020391')
			.then((data)=>{
				console.log(data.body)
				try{
					data.body = JSON.parse(data.body)
				}
				catch(e){console.log(e);
					return reject(model);
				}
				if(data.body.Response[0].result=="FAIL"){
					let reply={
		                text    : data.body.Response[0]['reject_reason'].trim(),
		                type    : "text",
		                sender  : model.sender,
		                language: "en"
		            }
					external(reply)
					.then((data)=>{
		                return reject(model);
		            })
		            .catch((e)=>{
		                console.log(e);
		                return reject(model)
		            })
				}
				else if(data.body.Response[0][0].SchemeCode && data.body.Response[0][0].SchemeName){
					model.tags.bankMandateList = []
					let maxAmountPossible=0;
					for(let element of data.body.Response[1]){
						let possibleAmount
						try{
							possibleAmount=element.BankAccount.split('-')[2].match(/\d+/)[0]
							if(possibleAmount){
								possibleAmount=parseInt(possibleAmount);
								if(maxAmountPossible<possibleAmount){
									maxAmountPossible=possibleAmount;
								}
							}
						}
						catch(e){
							console.log(e)
						}
						let expectedAmount=parseInt(model.tags.amount);
						if(expectedAmount<=possibleAmount){
							model.tags.bankMandateList.push({
								title: element.BankAccount.split('-')[0],
								text : element.BankAccount.split('-')[2],
								buttons : [{
									text : 'Select',
									data : element.MandateID
								}]
							})
						}
					}
					if(model.tags.bankMandateList.length==0){
						let reply={
			                text    : "Please choose an amount lesser than your available Bank Mandate limit of Rs "+maxAmountPossible,
			                type    : "text",
			                sender  : model.sender,
			                language: "en"
			            }
						external(reply)
						.then((data)=>{
			                return reject(model);
			            })
			            .catch((e)=>{
			                console.log(e);
			                return reject(model)
			            })
					}
					else{
						console.log(model.tags.bankMandateList)
						model.stage = 'bankMandate'
						return resolve(model)
					}
				}
				else{
					return reject(model)
				}
			})
			.catch((e)=>{
				console.log(e)
				return reject(model)
			})
		}
		else{
			return reject(model)
		}	
	})
}

function bankMandate(model){
	return new Promise(function(resolve, reject){
		let arr = []
		for(let i in model.tags.bankMandateList){
			arr.push(model.tags.bankMandateList[i].buttons[0].data)
		}
		console.log(arr)
		console.log(model.data)
		if(arr.includes(model.data)){
			model.tags.bankMandate = model.data
			api.bankMandate(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, model.data, model.tags.amount)
			.then((data)=>{
				console.log(data.body)
				try{
					data.body = JSON.parse(data.body)
				}
				catch(e){console.log(e);
					return reject(model);
				}
				if(data.body.Response[0].result=="FAIL"){
					let reply={
		                text    : "API FAILED : "+data.body.Response[0]['reject_reason'],
		                type    : "text",
		                sender  : model.sender,
		                language: "en"
		            }
					external(reply)
					.then((data)=>{
		                return reject(model);
		            })
		            .catch((e)=>{
		                console.log(e);
		                return reject(model)
		            })
				}
				else if(data.body){
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
	if(model.tags.mobile){
		model.tags = {}
	}
	else{
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
	}
	return model;
}

function extractPan(model){
	if(model.tags.pan){
		model.tags = {}
	}
	else{
		var matchPan=model.data.match(regexPan)
		if(matchPan){
			model.tags.pan = matchPan[0]
			model.data=model.data.replace(model.tags.pan, '')
		}
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
			console.log(searchTerm)
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
    return model;
}