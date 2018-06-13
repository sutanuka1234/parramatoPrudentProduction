module.exports={
	main:main
}

let api = require('../api.js')
let external = require('../external.js')
let words = require('../words.js')
let data = require('../data.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')

let obj = {
	panMobile : panMobile,
	mobile	: mobile,
	pan		: pan,
	otp		: otp,
	agreement	: agreement,
	investmentType :investmentType,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps,
	amount 	: amount,
	holding : holding,
	additional : additional,
	euin: euin , 
	folio 	: folio,
	sipDay	: sipDay,
	bankMandate : bankMandate
}


let regexMobile	= /[789]\d{9}/gi
let regexPan 	= /[a-z]{3}p[a-z]\d{4}[a-z]/
let number		= /\d+/
let regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/gi
let divOption 	= /re(-|\s)?invest|pay(\s)?out/
let regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
let schemeType 	= /dividend|growth/
let regexOtp    = /\d{6}/
let schemeNames = Object.keys(data)
let amc = [  
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
		console.log(req.params.stage)
		var buttonStageArr=req.body.data.split("|||")
		if(buttonStageArr.length==2&&req.params.stage!=buttonStageArr[0]){
			if(obj[buttonStageArr[0]]){
				req.params.stage=buttonStageArr[0];
				req.body.data=buttonStageArr[1]
			}
		}
		if(obj[req.params.stage]){
			obj[req.params.stage](req.body)
			.then((data)=>{
				console.log("3")
				res.send(data)
			})
			.catch((e)=>{
				console.log(e)
				res.sendStatus(203)
			})
		}
		else{
				console.log("No such function available")
				res.sendStatus(203)
		}
		
}

//============================================================

function panMobile(model){
	return new Promise(function(resolve, reject){
		model=dataClean(model);
		if(model.data.toLowerCase().includes("not")&&model.data.toLowerCase().includes("me")){
			model.stage="panMobile";
			model.tags={}
			return resolve(model);
		}
		model = extractPan(model);
		if(model.tags.newPan){
			let temp = {pan:model.tags.pan}
			if(model.tags.newFolio){
				// console.log("FOLIO")
				temp.folio=model.tags.folio;
			}
			if(model.tags.newScheme){
				// console.log("SCHEME")
				temp.schemes=model.tags.schemes;
			}
			if(model.tags.newAmount){
				// console.log("AMOUNT")
				temp.amount=model.tags.amount;
			}
			if(model.tags.newDivOption){
				// console.log("DIVOPTION")
				temp.divOption=model.tags.divOption;
			}
			if(model.tags.investmentType){
				// console.log("INVTYPE")
				temp.investmentType=model.tags.investmentType
			}
			model.tags=temp;
			model.tags.newPan=undefined;
			model.tags.newFolio=undefined;
			model.tags.newScheme=undefined;
			model.tags.newAmount=undefined;
			model.tags.newDivOption=undefined;
			model.tags.newInvestmentType=undefined;
		}
		else{
				model.tags.newFolio=undefined;
				model.tags.newScheme=undefined;
				model.tags.newAmount=undefined;
				model.tags.newDivOption=undefined;
				model.tags.newInvestmentType=undefined;

		}
		if(model.data&&!model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){	
			// console.log("1")
			return reject(model);
		}
		else if(model.data&&model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){
			// console.log("2")
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				// console.log("then")
				// console.log(data.body)
				let response;
				try{
					response = JSON.parse(data.body)
				}
				catch(e){
					console.log(e);
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
		                model.tags={}
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
				// console.log("catch")
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
		else if(model.data&&model.data.includes("proceed")&&(model.tags.mobile||model.tags.pan)){
			// console.log("3")

			if(!model.tags.mobile&&!model.tags.pan){
				return reject(model);
			}
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
			// console.log("4")
			model = extractMobile(model);
			model = extractDivOption(model);
			model = extractSchemeName(model);
			model = extractInvetmentType(model)
			model = extractAmount(model);
			model = extractFolio(model);
			console.log(model.tags.investmentType)
			if(model.tags.pan&&model.tags.mobile){
				api.panMobile(model.tags.mobile, model.tags.pan)
				.then(data=>{
					// console.log(data.body)
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
		                	model.tags={};
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
				if(!model.tags.mobile&&!model.tags.pan){
					return reject(model);
				}
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
			model=extractInvetmentType(model)
			model = extractAmount(model);
			model = extractFolio(model);
			console.log(model.tags.investmentType)
			if(model.tags.pan&&model.tags.mobile){
					api.panMobile(model.tags.mobile, model.tags.pan)
					.then(data=>{
						// console.log(data.body)
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
		                		model.tags={};
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

			else if(model.tags.mobile){
				model.stage = 'pan' 
				return resolve(model)
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
		model=extractInvetmentType(model)
		model = extractAmount(model);
		model = extractFolio(model);
		console.log(model.tags.investmentType)
			// console.log("TAGG")
			// console.log(JSON.stringify(model.tags,null,3))
		if(model.tags.pan&&model.tags.mobile){
			api.panMobile(model.tags.mobile, model.tags.pan)
			.then(data=>{
				// console.log(data.body)
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
		                model.tags={};
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
		else if(model.tags.pan){
			model.stage = 'mobile' 
			return resolve(model)
		}
		else{
			return reject(model);
		}
	})
}

function otp(model){
	return new Promise(function(resolve, reject){

		// model.tags.mobileEntered=false;
		model = dataClean(model);
		model = extractOTP(model);
		model = extractDivOption(model);
		model = extractSchemeName(model);
		model=extractInvetmentType(model);
		console.log(model.tags.investmentType)
		if(model.data.toLowerCase().includes('re send')||model.data.toLowerCase().includes('resend')){
			api.resendOtp(model.tags.session)
			.then((response)=>{
				// console.log(response.body)
				try{
					response = JSON.parse(response.body)
				}
				catch(e){
					console.log(e)
					reject(model)
				}
				if(response.Response){
					model.tags.resend = true
					resolve(model)
				}
				else{
					reject(model)
				}
			})
			.catch(e=>{
				console.log(e)
				reject(model)
			})
		}
		else if(model.tags.otp){
			api.otp(model.tags.session, model.tags.otp)
			.then(data=>{
				try{
					// console.log(data.body)
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
							return reject(model)//wrongResolve
			            })
			            .catch((e)=>{
			                console.log(e);
			                return reject(model)
			            })
					}
					else{
						model.tags.joinAcc = response.Response
						console.log("sent message")
						sendExternalMessage(model,"Hi "+model.tags.joinAcc[0].JoinHolderName.split("/")[0]+", hope you are doing great today.");
						model.tags.joinAccId = []
						response.Response.forEach(function(element){
							model.tags.joinAccId.push(element.JoinAccId.toString())
						})
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
						if(model.tags.schemes && model.tags.schemes.length > 0){
							model.tags.schemeList = []
							for(let element of model.tags.schemes){
								model.tags.schemeList.push({
									title 	: 'Schemes',
									text 	: element.target,
									buttons : [
										{
											text : 'Select',
											data : "showSchemeName|||"+element.target
										}
									]
								})
							}
						}
						// if(model.tags.investmentType){
						// 	if(model.tags.schemes && model.tags.schemes.length > 0){
						// 		model.stage = 'showSchemeName'
						// 		return resolve(model)
						// 	}
						// 	else{
						// 		model.stage = 'askSchemeName'
						// 		return resolve(model)
						// 	}
						// }
						// else{
							delete model.stage
							return resolve(model)
						// }

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

//============================================================


function agreement(model){
	return new Promise(function(resolve,reject){
		if(model.data.toLowerCase().trim().includes("i accept and agree")){
			console.log(model.tags.investmentType)
			if(model.tags.investmentType){
				if(model.tags.schemes && model.tags.schemes.length > 0){
					model.stage = 'showSchemeName'
					return resolve(model);
				}
				else{
					model.stage = 'askSchemeName'
					return resolve(model);
				}
			}
			else{
				delete model.stage
				return resolve(model);
			}
		}
		else{
			return reject(model);
		}
	})
}


function investmentType(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("lumpsum")||model.data.toLowerCase().includes("one time")){
			model.tags.investmentType="lumpsum"
			if(model.tags.schemes && model.tags.schemes.length > 0){
				model.stage = 'showSchemeName'
				return resolve(model)
			}
			else{
				delete model.stage
				return resolve(model)
			}
		}
		else if(model.data.toLowerCase().includes("sip")||model.data.toLowerCase().includes("systematic")){
			model.tags.investmentType="sip"
			if(model.tags.schemes && model.tags.schemes.length > 0){
				model.stage = 'showSchemeName'
				return resolve(model)
			}
			else{
				delete model.stage
				return resolve(model)
			}
		}
		else{
			return reject(model);
		}
		
	});
}



function askSchemeName(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("cancel")||model.data.toLowerCase().includes("stop")||model.data.toLowerCase().trim()=="exit"){
			return reject(model)
		}
		model = extractDivOption(model)
		// model = extractAmount(model)
		model = extractFolio(model)
		// if(model.tags.selectType.toLowerCase().includes("additional")){
		// 	model.stage = 'holding'
		// 	return resolve(model)
		// }

		let matches = stringSimilarity.findBestMatch(model.data, Object.keys(data))
		if(model.tags.schemes===undefined){
			model.tags.schemes=[]
		}
		if(matches.bestMatch.rating>0.9){
			// console.log("nine")
			model.tags.schemes.push(matches.bestMatch.target)
		}
		else if(matches.bestMatch.rating>0.10){
			// console.log("one")
			matches.ratings=matches.ratings.sort(sortBy('-rating'));
			model.tags.schemes = matches.ratings.splice(0,9);
		}
		else{
			// console.log("undefined")
			return reject(model);
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
							data : "showSchemeName|||"+element.target
						}
					]
				})
			})
		}

		delete model.stage
		return resolve(model)
	})
}

function showSchemeName(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("cancel")||model.data.toLowerCase().includes("stop")||model.data.toLowerCase().trim()=="exit"){
			return reject(model)
		}
		model = extractDivOption(model)
		// model = extractAmount(model)
		model = extractFolio(model)
		// if(model.tags.selectType.toLowerCase().includes("additional")){
		// 	model.stage = 'holding'
		// 	return resolve(model)
		// }
		if(model.tags.schemes===undefined){
			model.tags.schemes=[]
		}
		let arr = []
		for(let i in model.tags.schemes){
			arr.push(model.tags.schemes[i].target)
		}
		// console.log(model.data)
		// console.log(JSON.stringify(model.tags.schemes))
		if(arr.includes(model.data) || (model.data.toLowerCase().includes("yes")&&model.tags.schemes.length==1)){
			if(model.tags.schemes.length==1){
				model.tags.scheme=model.tags.schemes[0]
			}
			else{
				model.tags.scheme = model.data
			}
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
			delete model.stage
			sendExternalMessage(model,"Going ahead with "+model.tags.scheme)
		}
		else{
			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(data))
			if(matches.bestMatch.rating>0.9){
				model.tags.schemes.push(matches.bestMatch.target)
			}
			else if(matches.bestMatch.rating>0.10){
				matches.ratings=matches.ratings.sort(sortBy('-rating'));
				model.tags.schemes = matches.ratings.splice(0,9);
			}
			else{
				return reject(model);
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
								data :"showSchemeName|||"+element.target
							}
						]
					})
				})
			}
		}
		return resolve(model)
	})
}



//============================================================

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccId.includes(model.data)){
			for (let element of model.tags.joinAcc){
				console.log(element.JoinAccId+"::"+model.data)
				if(element.JoinAccId==model.data){
					sendExternalMessage(model,"Going ahead with "+element.JoinHolderName)
					break;
				}
			}
			model.tags.joinAccId = model.data
			// console.log("INVESTMENT TYPE::::::::::")
			// console.log(model.tags.investmentType)
			if(model.tags.investmentType=="sip"){
				api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode,true)
				.then((response)=>{
					// console.log(response.body)
					try{
						response = JSON.parse(response.body)
						console.log(JSON.stringify(response,null,3))
					}
					catch(e){
						return reject(model)
						console.log(e)
					}


					if(response.Response && response.Response[0] && response.Response[0][0] && response.Response[0][0].FUNDNAME){
						model.tags.schemeApiDetails=response.Response[0][0];
						model.tags.euinApiDetails=response.Response[1][0];
						model.tags.euinApiDetailsList=[];
						if(response.Response.length>1){
							for(let i in response.Response[1]){
								model.tags.euinApiDetailsList.push({
									data : response.Response[1][i]["ID"],
									text : response.Response[1][i]["ID"]
								})
							}
						}
						model.tags.euinApiDetailsList.push({
							data : "Direct",
							text : "Direct"
						})

						api.getFolio(model.tags.session, model.data, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode,true)
						.then(response=>{
							// console.log(response.body)
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
								model.tags.folioObjList=response.Response;
								for(let i in response.Response){
									model.tags.folioList.push({
										data : response.Response[i].FolioNo,
										text : response.Response[i].FolioNo
									})
								}
								model.stage='euin'
							}
							else{
								model.tags.folioNo = response.Response[0].FolioNo
								model.stage='euin'
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
							model.tags.schemes=undefined;
							model.tags.scheme=undefined;
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
					let reply={
		                text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account',
		                type    : "text",
		                sender  : model.sender,
		                language: "en"
		            }
					external(reply)
					.then((data)=>{
						model.stage = 'askSchemeName'
						model.tags.schemes=undefined;
						model.tags.scheme=undefined;
						return resolve(model)
		            })
		            .catch((e)=>{
		                console.log(e);
		                return reject(model)
		            })
					return reject(model)
				})
			}
			else{
				api.getExistingSchemes(model.tags.session, model.tags.joinAccId)
				.then((response)=>{
					try{
						response = JSON.parse(response.body)
					}
					catch(e){
						return reject(model)
						console.log(e);
					}
					model.tags.existingSchemeApiDetails=response.Response[0];
					model.tags.existingEuinApiDetails=response.Response[1][0];
					model.tags.euinApiDetailsList=[];
					if(response.Response.length>1){
						for(let i in response.Response[1]){
							model.tags.euinApiDetailsList.push({
								data : response.Response[1][i]["ID"],
								text : response.Response[1][i]["ID"]
							})
						}
					}
					model.tags.euinApiDetailsList.push({
						data : "Direct",
						text : "Direct"
					})
					model.tags.existingSchemeDetailsSet=[]
					// console.log(JSON.stringify(model.tags.existingSchemeApiDetails,null,3))
					for (let existingScheme of model.tags.existingSchemeApiDetails){
						if(existingScheme["SCHEMECODE"]==data[model.tags.scheme].schemeCode){
							model.tags.existingSchemeDetailsSet.push(existingScheme)
						}
					}
					model.tags.additionalPossible=false;
					if(model.tags.existingSchemeDetailsSet.length>0){
						model.tags.additionalPossible=true;
						delete model.stage
						return resolve(model)		
					}
					else{
						// console.log("<1:::")
						api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode)
						.then((response)=>{
							// console.log(response.body)
							try{
								response = JSON.parse(response.body)
								console.log(JSON.stringify(response,null,3))
							}
							catch(e){
								return reject(model)
								console.log(e)
							}


							if(response.Response && response.Response[0] && response.Response[0][0] && response.Response[0][0].FUNDNAME){
								model.tags.schemeApiDetails=response.Response[0][0];
								model.tags.euinApiDetails=response.Response[1][0];
								model.tags.euinApiDetailsList=[];
								if(response.Response.length>1){
									for(let i in response.Response[1]){
										model.tags.euinApiDetailsList.push({
											data : response.Response[1][i]["ID"],
											text : response.Response[1][i]["ID"]
										})
									}
								}

								model.tags.euinApiDetailsList.push({
									data : "Direct",
									text : "Direct"
								})
					            // sendExternalMessage(model,"Hurray, you are eligible to invest in "+model.tags.scheme+", following are few details about the scheme. Its current NAV is "+model.tags.schemeApiDetails["CurrentNAV"]+
					            // 	". One year return is "+model.tags.schemeApiDetails["1YearReturns"]+"%, Three years returns is "+model.tags.schemeApiDetails["1YearReturns"]+
					            // 	"%, and Five years return is "+model.tags.schemeApiDetails["5YearReturns"]+"%.")
								api.getFolio(model.tags.session, model.data, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode)
								.then(response=>{
									// console.log(response.body)
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
										model.tags.folioObjList=response.Response;
										for(let i in response.Response){
											model.tags.folioList.push({
												data : response.Response[i].FolioNo,
												text : response.Response[i].FolioNo
											})
										}
										model.stage='euin'
									}
									else{
										model.tags.folioNo = response.Response[0].FolioNo
										model.stage='euin'
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
									model.tags.schemes=undefined;
									model.tags.scheme=undefined;
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
							let reply={
				                text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account',
				                type    : "text",
				                sender  : model.sender,
				                language: "en"
				            }
							external(reply)
							.then((data)=>{
								model.stage = 'askSchemeName'
								model.tags.schemes=undefined;
								model.tags.scheme=undefined;
								return resolve(model)
				            })
				            .catch((e)=>{
				                console.log(e);
				                return reject(model)
				            })
							return reject(model)
						})
					}

					
				})
				.catch(e=>{
					console.log(e)
					return reject(model)
				})
			}
		}
		else{
			return reject(model)
		}
	})
}

function additional(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("yes")&&model.tags.existingSchemeDetailsSet.length>0){
			model.tags.additional=true;
			if(model.tags.existingSchemeDetailsSet.length===1){
				// console.log("1:::")
				model.tags.tranId=model.tags.existingSchemeDetailsSet[0]["Tranid"]
				model.tags.folio=model.tags.existingSchemeDetailsSet[0]["FolioNo"]
				model.tags.divOption=model.tags.existingSchemeDetailsSet[0]["DivOpt"]
				model.tags.schemeApiDetails=model.tags.existingSchemeDetailsSet[0]
				delete model.stage;	
			}
			else if(model.tags.existingSchemeDetailsSet.length>1){
				// console.log(">1:::")

				model.tags.additionalPossible=true;
				model.tags.folioList = []
				for(let i in model.tags.existingSchemeDetailsSet){
					model.tags.folioList.push({
						data : model.tags.existingSchemeDetailsSet[i].FolioNo,
						text : model.tags.existingSchemeDetailsSet[i].FolioNo
					})
				}

				delete model.stage
			}

			return resolve(model);
		}
		else if(model.data.toLowerCase().includes("no")){
			model.tags.additional=false;
			api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode)
			.then((response)=>{
				// console.log(response.body)
				try{
					response = JSON.parse(response.body)
					console.log(JSON.stringify(response,null,3))
				}
				catch(e){
					return reject(model)
					console.log(e)
				}


				if(response.Response && response.Response[0] && response.Response[0][0] && response.Response[0][0].FUNDNAME){
					model.tags.schemeApiDetails=response.Response[0][0];
					model.tags.euinApiDetails=response.Response[1][0];
					model.tags.euinApiDetailsList=[];
					if(response.Response.length>1){
						for(let i in response.Response[1]){
							model.tags.euinApiDetailsList.push({
								data : response.Response[1][i]["ID"],
								text : response.Response[1][i]["ID"]
							})
						}
					}
					model.tags.euinApiDetailsList.push({
						data : "Direct",
						text : "Direct"
					})
					api.getFolio(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode)
					.then(response=>{
						try{
							response = JSON.parse(response.body)
						}
						catch(e){
							console.log(e)
							return reject(model);
						}
						// console.log(JSON.stringify(response,null,3));
						if(response.Response.length > 0){
							model.tags.folioList = []
							model.tags.folioObjList=response.Response;
							for(let i in response.Response){
								model.tags.folioList.push({
									data : response.Response[i].FolioNo,
									text : response.Response[i].FolioNo
								})
							}
						}
						else{
							model.tags.folioNo = response.Response[0].FolioNo
						}
						model.stage = 'euin'
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
						model.tags.schemes=undefined;
						model.tags.scheme=undefined;
						return resolve(model)
		            })
		            .catch((e)=>{
		                console.log(e);
		                return reject(model)
		            })
				}
			})
			.catch(e=>{
				console.log(e);
				return reject(model);
			})
		}
		else{
			return reject(model);
		}
	});	
}


function euin(model){
	return new Promise(function(resolve, reject){
		let euinFlag=false;
		for(let data of model.tags.euinApiDetailsList){
			if(data["data"]==model.data){
				euinFlag=true;
				if(model.data.toLowerCase().includes("direct")){
					model.tags.euin=""
					model.tags.existingEuinApiDetails=""
				}
				else{
					model.tags.euin=model.data
					model.tags.existingEuinApiDetails=model.data
				}
				break;
			}
		}
					

		if(euinFlag){
			if(model.tags.additional&&(model.tags.divOption==0||model.tags.divOption==1||model.tags.divOption==2&&model.tags.folio)){
				if(model.tags.amount&&model.tags.schemeApiDetails){
					let amount=parseFloat(model.tags.amount)
					let minAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])
					let maxAmount=parseFloat(model.tags.schemeApiDetails["MaximumInvestment"])
					let multiple =parseFloat(model.tags.schemeApiDetails["Multiples"]) 
					if(amount%multiple!=0){
						model.tags.amount=undefined;
					}
					if(amount<minAmount){
						// sendExternalMessage(model,"Investment amount should be greater than Rs "+minAmount+".")
						model.tags.amount=undefined;
					}
					else if(amount>maxAmount){
						// sendExternalMessage(model,"Investment amount should be less than Rs "+maxAmount+".")
						model.tags.amount=undefined;
					}
				}
				let schemeCode=data[model.tags.scheme].schemeCode
				if(model.tags.amount){
					api.insertBuyCart(model.tags.session, model.tags.joinAccId, schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, model.tags.euin,model.tags.additional,model.tags.tranId)
					.then((data)=>{
						// console.log(data.body)
						try{
							data = JSON.parse(data.body)
						}
						catch(e){
						     console.log(e);
						     let reply={
				                text    : "API Not Responding Properly",
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
						if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
							let reply={
				                text    : data.Response[0]['reject_reason'].trim(),
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
						else if(data.Response[0][0].SchemeCode && data.Response[0][0].SchemeName){
							model.tags.bankMandateList = []
							let maxAmountPossible=0;
							// console.log(JSON.stringify(data.Response[1],null,3))
							let typeInv="PURCHASE"
							if(model.tags.additional){
								typeInv="ADDITIONALPURCHASE"
							}
							for(let element of data.Response[2]){
								model.tags.bankMandateList.push({
									title: "Netbanking",
									text : element.BankName,
									buttons : [{
										type : 'url',
										text : 'Pay',
										data : 'https://prudent-apiserver.herokuapp.com/external/pay?session='+model.tags.session+'&joinAccId='+model.tags.joinAccId+'&schemeCode='+schemeCode+'&bankId='+element.BankId+'&typeInv='+typeInv
									}]
								})
							}
							for(let element of data.Response[1]){
								try{
										if(element.DailyLimit){
											if(maxAmountPossible<element.DailyLimit){
												maxAmountPossible=element.DailyLimit;
											}
										}
								}
								catch(e){
									console.log(e)
								}
								let expectedAmount=parseInt(model.tags.amount);
								if(expectedAmount<=element.DailyLimit){
										model.tags.bankMandateList.push({
											title: "Mandate",
											text : element.BankName.split('-')[0]+", Limit of Rs. "+element.DailyLimit.toString(),
											buttons : [{
												text : 'Pay',
												data : element.MandateId
											}]
										})
									
								}
							}
							// console.log(JSON.stringify(model.tags.bankMandateList,null,3))
							if(model.tags.bankMandateList.length==0){
								model.stage = 'amount'
								return resolve(model)
							}
							else{
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
					model.stage = 'amount'
					return resolve(model)
				}
			}
			else{
				delete model.stage
				return resolve(model)
			}
		}
		else{
			return reject(model);
		}
	});

}


function folio(model){
	return new Promise(function(resolve, reject){
		console.log("::::::::::::::::::::::::EUIN::::::::::::::::::::::::")
		console.log(JSON.stringify(model.tags.euinApiDetails,null,3))
		let arr = []
		for(let i in model.tags.folioList){
			arr.push(model.tags.folioList[i].data)
		}
		model.tags.amcName = data[model.tags.scheme].amcName
		let divFlag=true;
		if(arr.includes(model.data)){
			sendExternalMessage(model,"Going ahead with "+model.data)
			if(model.data.includes('new')){
				model.tags.folio = '0'
			}
			else{
				model.tags.folio = model.data
				for(let i in model.tags.folioObjList){
					if(model.tags.folioObjList[i]["DivOpt"]){
						switch(model.tags.folioObjList[i]["DivOpt"]){
							case "Y": model.tags.divOption = 1
									  divFlag=false;
								break;
							case "N": model.tags.divOption = 2
									  divFlag=false;
								break;
							case "B": model.tags.divOption = 0
									  divFlag=false;
								break;
							default: model.tags.divOption = undefined
									break;
						}
						break;
					}
					if(data[model.tags.scheme].optionCode == 1){
							model.tags.divOption = 0
							divFlag=false;
					}
				}
				if(divFlag){
					// console.log("1")
					delete model.stage;
					return resolve(model);
				}
				else{
					if(model.tags.additional&&model.tags.existingSchemeDetailsSet.length>1){
						for(let schemeVal of model.tags.existingSchemeDetailsSet){
							if(schemeVal["FolioNo"]==model.tags.folio){
								model.tags.tranId=schemeVal["Tranid"]
								model.tags.schemeApiDetails=schemeVal;
								break;
							}
						}
					}

					if(model.tags.amount&&model.tags.schemeApiDetails){
						let amount=parseFloat(model.tags.amount)
						let minAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])
						let maxAmount=parseFloat(model.tags.schemeApiDetails["MaximumInvestment"])
						let multiple =parseFloat(model.tags.schemeApiDetails["Multiples"]) 
						if(amount%multiple!=0){
							model.tags.amount=undefined;
						}
						if(amount<minAmount){
							// sendExternalMessage(model,"Investment amount should be greater than Rs "+minAmount+".")
							model.tags.amount=undefined;
						}
						else if(amount>maxAmount){
							// sendExternalMessage(model,"Investment amount should be less than Rs "+maxAmount+".")
							model.tags.amount=undefined;
						}
					}
					let schemeCode=data[model.tags.scheme].schemeCode
					if(model.tags.amount){
						if(model.tags.investmentType=="sip"){
							//TODO
							// console.log("2")
							model.stage = 'sipDay'
							return resolve(model)
						}
						else{

							api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, model.tags.euin,model.tags.additional,model.tags.tranId)
							.then((data)=>{
								// console.log(data.body)
								try{
									data = JSON.parse(data.body)
								}
								catch(e){
									console.log(e);
									let reply={
							                text    : "API Not Responding Properly",
							                type    : "text",
							                sender  : model.sender,
							                language: "en"
							            }
										external(reply)
										.then((data)=>{
											console.log("api error")
							                return reject(model);
							            })
							            .catch((e)=>{
							                console.log(e);
							                return reject(model)
							            })
									// delete model.stage
									// return resolve(model)
								}
								if(data.Response[0][0].SchemeCode && data.Response[0][0].SchemeName){
									model.tags.bankMandateList = []
									let maxAmountPossible=0;
									for(let element of data.Response[2]){
										model.tags.bankMandateList.push({
											title: "Netbanking",
											text : element.BankName,
											buttons : [{
												type : 'url',
												text : 'Pay',
												data : 'https://prudent-apiserver.herokuapp.com/external/pay?session='+model.tags.session+'&joinAccId='+model.tags.joinAccId+'&schemeCode='+schemeCode+'&bankId='+element.BankId
											}]
										})
									}
									for(let element of data.Response[1]){
										try{
											if(element.DailyLimit){
												if(maxAmountPossible<=element.DailyLimit){
													maxAmountPossible=element.DailyLimit;
												}
											}
										}
										catch(e){
											console.log(e)
											model.stage="amount"
											return resolve(model);
										}
										let expectedAmount=parseInt(model.tags.amount);
										if(expectedAmount<=element.DailyLimit){
											model.tags.bankMandateList.push({
												title: "Mandate",
												text : element.BankName.split('-')[0]+", Limit of Rs. "+element.DailyLimit.toString(),
												buttons : [{
													text : 'Pay',
													data : element.MandateId
												}]
											})
										}
									}
									
									// console.log(JSON.stringify(model.tags.bankMandateList,null,3))
									if(model.tags.bankMandateList.length==0){
										// console.log("3")
										model.stage="amount"
										return resolve(model)
									}
									else{
										// console.log("4")
										model.stage = 'bankMandate'
										return resolve(model)
									}
								}
								else{
									// console.log("5")
									model.stage="amount"
									return resolve(model)
								}
							})
							.catch((e)=>{

								console.log(e)
								model.stage="amount"
								return resolve(model)
							})
						}
					}
					else{
						// console.log("6")
						model.stage="amount"
						return resolve(model)
					}
				}
			}
			
		}
		else{
			// console.log("last reject")
			return reject(model)
		}
	})
}




function divOps(model){
	return new Promise(function(resolve, reject){
		model = extractAmount(model)
		model = extractFolio(model)
		if(model.data.toLowerCase().includes('re invest')||model.data.toLowerCase().includes('re-invest')|| model.data.toLowerCase().includes('payout')){
			
			if(model.data.toLowerCase().includes('re invest')||model.data.toLowerCase().includes('re-invest')){
				model.tags.divOption = 1
				model.tags.divOptionText="Resinvestment Option"
			}
			else{
				model.tags.divOption = 2
				model.tags.divOptionText="Payout Option"
			}
			sendExternalMessage(model,"Going ahead with "+model.tags.divOptionText)
			if(model.tags.amount&&model.tags.schemeApiDetails){
				let amount=parseFloat(model.tags.amount)
				let minAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])
				let maxAmount=parseFloat(model.tags.schemeApiDetails["MaximumInvestment"])
				let multiple =parseFloat(model.tags.schemeApiDetails["Multiples"]) 
				if(amount%multiple!=0){
					model.tags.amount=undefined;
				}
				if(amount<minAmount){
					// sendExternalMessage(model,"Investment amount should be greater than Rs "+minAmount+".")
					model.tags.amount=undefined;
				}
				else if(amount>maxAmount){
					// sendExternalMessage(model,"Investment amount should be less than Rs "+maxAmount+".")
					model.tags.amount=undefined;
				}
			}
			let schemeCode=data[model.tags.scheme].schemeCode
			if(model.tags.amount){
				if(model.tags.investmentType=="sip"){
					//TODO
					model.stage = 'sipDay'
					return resolve(model)
				}
				else{

					api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, model.tags.euin,model.tags.additional,model.tags.tranId)
					.then((data)=>{
						// console.log(data.body)
						try{
							data = JSON.parse(data.body)
						}
						catch(e){
							console.log(e);
							let reply={
					                text    : "API Not Responding Properly",
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
							// delete model.stage
							// return resolve(model)
						}
						if(data.Response[0][0].SchemeCode && data.Response[0][0].SchemeName){
							model.tags.bankMandateList = []
							let maxAmountPossible=0;
							for(let element of data.Response[2]){
								model.tags.bankMandateList.push({
									title: "Netbanking",
									text : element.BankName,
									buttons : [{
										type : 'url',
										text : 'Pay',
										data : 'https://prudent-apiserver.herokuapp.com/external/pay?session='+model.tags.session+'&joinAccId='+model.tags.joinAccId+'&schemeCode='+schemeCode+'&bankId='+element.BankId
									}]
								})
							}
							for(let element of data.Response[1]){
								try{
									if(element.DailyLimit){
										if(maxAmountPossible<=element.DailyLimit){
											maxAmountPossible=element.DailyLimit;
										}
									}
								}
								catch(e){
									console.log(e)
								}
								let expectedAmount=parseInt(model.tags.amount);
								if(expectedAmount<=element.DailyLimit){
									model.tags.bankMandateList.push({
										title: "Mandate",
										text : element.BankName.split('-')[0]+", Limit of Rs. "+element.DailyLimit.toString(),
										buttons : [{
											text : 'Pay',
											data : element.MandateId
										}]
									})
								}
							}
							
							// console.log(JSON.stringify(model.tags.bankMandateList,null,3))
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




//============================================================

function amount(model){
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		model=extractAmount(model)
		if(model.tags.amount&&model.tags.schemeApiDetails){
			let amount=parseFloat(model.tags.amount)
			let minAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])
			let maxAmount=parseFloat(model.tags.schemeApiDetails["MaximumInvestment"])
			let multiple =parseFloat(model.tags.schemeApiDetails["Multiples"]) 
			if(amount%multiple!=0){
				model.tags.amount=undefined;
			}
			console.log(minAmount)
			console.log(maxAmount)
			console.log(amount)

			if(amount<minAmount){
				// sendExternalMessage(model,"Investment amount should be greater than Rs "+minAmount+".")
				model.tags.amount=undefined;
			}
			else if(amount>maxAmount){
				// sendExternalMessage(model,"Investment amount should be less than or equal to Rs "+maxAmount+".")
				model.tags.amount=undefined;
			}
		}

		let schemeCode=data[model.tags.scheme].schemeCode
		if(model.tags.additional&&model.tags.existingSchemeDetailsSet.length>1){
			for(let schemeVal of model.tags.existingSchemeDetailsSet){
				if(schemeVal["FolioNo"]==model.tags.folio){
					model.tags.tranId=schemeVal["Tranid"]
					model.tags.schemeApiDetails=schemeVal;
					break;
				}
			}
		}

		
		if(model.tags.amount){
			if(model.tags.investmentType=="sip"){
					//TODO
					delete model.stage
					return resolve(model)
			}
			else{
				api.insertBuyCart(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, model.tags.euin,model.tags.additional,model.tags.tranId)
				.then((data)=>{
					try{
						console.log(data.body+":>>>>>>>>>>")
						data= JSON.parse(data.body)
					}
					catch(e){	
						console.log(e);
						let reply={
			                text    : "API Not Responding Properly",
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
						// return reject(model);
					}

					if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
						let reply={
			                text    : data.Response[0]['reject_reason'].trim(),
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
					else if(data.Response[0][0].SchemeCode && data.Response[0][0].SchemeName){
						model.tags.bankMandateList = []
						let maxAmountPossible=0;
						// console.log(JSON.stringify(data.body.Response[1],null,3))
						let typeInv="PURCHASE"
						if(model.tags.additional){
							typeInv="ADDITIONALPURCHASE"
						}
						for(let element of data.Response[2]){
							model.tags.bankMandateList.push({
								title: "Netbanking",
								text : element.BankName,
								buttons : [{
									type : 'url',
									text : 'Pay',
									data : 'https://prudent-apiserver.herokuapp.com/external/pay?session='+model.tags.session+'&joinAccId='+model.tags.joinAccId+'&schemeCode='+schemeCode+'&bankId='+element.BankId+'&typeInv='+typeInv
								}]
							})
						}
						for(let element of data.Response[1]){
							try{
									if(element.DailyLimit){
										if(maxAmountPossible<=element.DailyLimit){
											maxAmountPossible=element.DailyLimit;
										}
									}
							}
							catch(e){
								console.log(e)
				                return reject(model)
							}
							let expectedAmount=parseInt(model.tags.amount);
							if(expectedAmount<=element.DailyLimit){
									model.tags.bankMandateList.push({
										title: "Mandate",
										text : element.BankName.split('-')[0]+", Limit of Rs. "+element.DailyLimit.toString(),
										buttons : [{
											text : 'Pay',
											data : element.MandateId
										}]
									})
								
							}
						}
						// console.log(JSON.stringify(model.tags.bankMandateList,null,3))
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
							model.stage = 'bankMandate'
							return resolve(model)
						}
					}
					else{
						console.log(JSON.stringify(data.Response,null,3)+"--------------------")
						return reject(model)
					}
				})
				.catch((e)=>{
					console.log(e)
					return reject(model)
				})
			}
		}
		else{
			console.log("no amount")
			return reject(model)
		}	
	})
}

function sipDay(model){
	return new Promise(function(resolve, reject){
		try{
			console.log("SIP:::::::::::::::::::::::::::::::::::::::"+model.tags.schemeApiDetails["SIPDays"]);
			let text=matchAll(model.data, /(\d+)/gi).toArray();
			if(text&&text.length>0){
				text=parseInt(text[0]);
				let validDate=false;
				if(model.tags.schemeApiDetails["SIPDays"].includes(",")){
					let dates=model.tags.schemeApiDetails["SIPDays"].split(",");
					for(let i in dates){
						if(text==parseInt(dates[i].trim())){
							validDate=true;
							break;
						}
					}
				}
				if((model.tags.schemeApiDetails["SIPDays"]==="ALL"&&text<=28)||validDate){
					model.tags.sipDay=text.toString();
					api.getMandate(model.tags.session, model.tags.joinAccId)
					.then((data)=>{
						try{
							console.log(data.body)
							data = JSON.parse(data.body)
						}
						catch(e){	
							console.log(e);
							let reply={
				                text    : "API Not Responding Properly",
				                type    : "text",
				                sender  : model.sender,
				                language: "en"
				            }
							external(reply)
							.then((data)=>{
								console.log("improper json")
				                return reject(model);
				            })
				            .catch((e)=>{
				                console.log(e);
				                return reject(model)
				            })
						}
						try{
							// data.body.Response=[]
							if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
								let reply={
					                text    : data.Response[0]['reject_reason'].trim(),
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
							else if(data.Response&&data.Response.length>0){
								model.tags.bankMandateList = []
								let maxAmountPossible=0;
								let typeInv="SIP"
								for(let element of data.Response){
									try{
											if(element.DailyLimit){
												if(maxAmountPossible<=element.DailyLimit){
													maxAmountPossible=element.DailyLimit;
												}
											}
									}
									catch(e){
										console.log(e)
						                return reject(model)
									}
									let expectedAmount=parseInt(model.tags.amount);
									if(expectedAmount<=element.DailyLimit){
											model.tags.bankMandateList.push({
												title: "Mandate",
												text : element.BankName.split('-')[0]+", Limit of Rs. "+element.DailyLimit.toString(),
												buttons : [{
													text : 'Pay',
													data : element.MandateId
												}]
											})
										
									}
								}
								// console.log(JSON.stringify(model.tags.bankMandateList,null,3))
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
									delete model.stage
									return resolve(model)
								}
							}
							else{
								sendExternalMessage(model,"Sorry, we can not continue the SIP transaction as you have no bank mandate linked");
								model.stage = 'summary'
								return resolve(model)
							}
						}
						catch(e){
							console.log(e);
							return reject(model);
				            
						}
					})
					.catch(e=>{
						console.log(e);
						return reject(model);
					})
				}
				else{
					console.log("not valid date")
					return reject(model);
				}
			}
			else{
				console.log("No number")
				return reject(model);
			}
		}
		catch(e){
			console.log(e)
			return reject(model);
		}
	});
}

function bankMandate(model){
	return new Promise(function(resolve, reject){
		let arr = []
		for(let i in model.tags.bankMandateList){
			arr.push(model.tags.bankMandateList[i].buttons[0].data)
		}
		// console.log(arr)

		if(arr.includes(model.data)){
			if(model.data.includes("-nach")){
				// console.log("nach")
				return reject(model)
				
			}
			else{
				model.tags.bankMandate = model.data

				if(model.tags.investmentType==="sip"){
						api.insertBuyCartSip(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcName, data[model.tags.scheme].amcCode, model.tags.divOption, model.tags.amount, model.tags.folio, model.tags.euin,model.tags.sipDay,model.tags.sipInstallments,model.tags.bankMandate)
						.then((data)=>{
							try{
								data = JSON.parse(data.body)
							}
							catch(e){	
								console.log(e);
								let reply={
					                text    : "API Not Responding Properly",
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
							if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
								let reply={
					                text    : data.Response[0]['reject_reason'].trim(),
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
								model.tags.sipRefId=data.Response[0]["TranReferenceID"];
								api.confirmSip(model.tags.session,model.tags.sipRefId)
								.then((data)=>{
									try{
										data = JSON.parse(data.body)
									}
									catch(e){	
										console.log(e);
										let reply={
							                text    : "API Not Responding Properly",
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
									if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
										let reply={
							                text    : data.Response[0]['reject_reason'].trim(),
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
										model.tags.transactionRefId=data["ConfirmSIPTransaction"]["TranReferenceID"]
										model.tags.sipRefId=model.tags.transactionRefId
										model.tags.status="Successful"
										delete model.stage
										return resolve(model)

									}

								})
								.catch(e=>{
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

					api.bankMandate(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, model.tags.bankMandate, model.tags.amount,model.tags.additional)
					.then((data)=>{
						console.log(data.body)
						try{
							data = JSON.parse(data.body)
						}
						catch(e){console.log(e);
							return reject(model);
						}
						if(data.Response&&data.Response.length>0&&data.Response[0].result=="FAIL"){
							let reply={
				                text    : data.Response[0]['reject_reason'],
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
						else if(data){
							model.tags.paymentSummary = data.Response[0]
							model.tags.transactionRefId=model.tags.paymentSummary.ReferenceID
							model.tags.status=model.tags.paymentSummary.STATUS
							delete model.stage
							return resolve(model)
						}
					})
					.catch(e=>{
						console.log(e) 
						return reject(model)
					})
				}
			}
			
		}
		else{
			return reject(model)
		}	
	})
}

//============================================================

function sendExternalMessage(model,text){
	let reply={
            text    : text,
            type    : "text",
            sender  : model.sender,
            language: "en"
        }
		external(reply)
		.then((data)=>{ })
        .catch((e)=>{
            console.log(e);
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
	let text = matchAll(model.data, /(\d+)/gi).toArray()

	// console.log(text)
	for(let i in text){
		if(text[i].length == 10){
			model.tags.mobile = text[i]
			model.data = model.data.replace(model.tags.mobile, '')
			// console.log(model.tags.mobile+"mobile")
			break;
		}
	}
	return model;
}

function extractPan(model){
	let matchPan=model.data.match(regexPan)
	// console.log(matchPan)
	if(matchPan&&matchPan.length>0&&matchPan[0]){

		if(matchPan[0]!=model.tags.pan){
			model.tags.newPan = true;
		}
		model.tags.pan = matchPan[0]
		model.data=model.data.replace(model.tags.pan, '')
		// console.log(model.tags.pan+"pan")
	}
	return model;
}

function extractInvetmentType(model){
	if(model.data.toLowerCase().includes("lumpsum")||model.data.toLowerCase().includes("one time")){
			model.data=model.data.replace("lumpsum","")
			model.data = model.data.replace("one time","")
			model.tags.investmentType="lumpsum"
	}
	else if(model.data.toLowerCase().includes("sip")||model.data.toLowerCase().includes("systematic")||model.data.toLowerCase().includes("monthly")){
			model.data=model.data.replace("sip","")
			model.data = model.data.replace("systematic","")
			model.data = model.data.replace("monthly","")
			model.tags.investmentType="sip"
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
			// 	startIndex=amcIndex
			// }

			if(count>0){
				let searchTerm=""
				for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
					searchTerm+=wordsInUserSays[i]+" "
				}
				searchTerm=searchTerm.trim();
				// console.log(searchTerm)
				let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
				if(matches.bestMatch.rating>0.9){
					model.tags.schemes = []
					model.tags.schemes.push(matches.bestMatch.target)
				}
				else if(matches.bestMatch.rating>0.4){
					model.tags.schemes = []
					matches.ratings=matches.ratings.sort(sortBy('-rating'));
					model.tags.schemes = matches.ratings.splice(0,9);
				}
			}
		}
		return model;
}

function dataClean(model){
	model.data = model.data.toLowerCase()
    return model;
}