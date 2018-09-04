"use strict"
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
	holding : holding,
	scheme 	: scheme,
	askSchemeName:askSchemeName,
	showSchemeName:showSchemeName,
	euin	: euin,
	divOps:divOps,
	unitOrAmount:unitOrAmount,
	amount : amount,
	confirm : confirm
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

let sortedJourney=["panMobile",
"mobile",
"pan",
"otp",
"agreement",
"holding",
"scheme",
"askSchemeName",
"showSchemeName",
"euin",
"divOps",
"unitOrAmount",
"amount",
"confirm",
"summary"]


function main(req, res){
		console.log(req.params.stage)
		var buttonStageArr=req.body.data.split("|||")
		if(buttonStageArr.length==2&&obj[buttonStageArr[0]]){
			req.body.data=buttonStageArr[1]
			// console.log(req.params.stage+":::"+buttonStageArr[0])
			// if(req.params.stage!=buttonStageArr[0]&&sortedJourney.indexOf(req.params.stage)>sortedJourney.indexOf(buttonStageArr[0])){
			// 		req.params.stage=buttonStageArr[0];
			// 		delete req.body.stage
			// }
		}
		
		if(obj[req.params.stage]){
			obj[req.params.stage](req.body)
			.then((data)=>{
				console.log("3")
				res.send(data)
			})
			.catch((e)=>{
				// console.log(e)
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
		// model=extractDivOption(model)
		// model=extractSchemeName(model)

		console.log("::::::::::::::::::")
		if(model.data.toLowerCase().includes("not")&&model.data.toLowerCase().includes("me")){
			model.stage="panMobile";
			model.tags={}
			return resolve(model);
		}

		console.log("::::::::::::::::::")
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
			model.tags=temp;
			model.tags.newPan=undefined;
			model.tags.newFolio=undefined;
			model.tags.newScheme=undefined;
			model.tags.newAmount=undefined;
		}
		else{
				model.tags.newFolio=undefined;
				model.tags.newScheme=undefined;
				model.tags.newAmount=undefined;

		}
		console.log("::::::::::::::::::")
		if(model.data&&!model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){	
			console.log("1")
			return reject(model);
		}
		else if(model.data&&model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){
			console.log("2")
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
		                // console.log(e);
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
			console.log("3")

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
			console.log("4")
			model = extractMobile(model);
			// model = extractAmount(model);
			if(model.tags.pan&&model.tags.mobile){
				api.panMobile(model.tags.mobile, model.tags.pan)
				.then(data=>{
					// console.log(data.body)
					let response;
					try{
						response = JSON.parse(data.body)
					}
					catch(e){// console.log(e);
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
			                // console.log(e);
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
					console.log("no pan mobile")
					return reject(model);
				}
				if(!model.tags.mobile){
					console.log("no mobile")
					model.stage = 'mobile' 
					return resolve(model)
				}
				else if(!model.tags.pan){
					console.log("no pan")
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
			// model=extractDivOption(model)
			// model=extractSchemeName(model)
			if(model.tags.pan&&model.tags.mobile){
					api.panMobile(model.tags.mobile, model.tags.pan)
					.then(data=>{
						// console.log(data.body)
						let response;
						try{
							response = JSON.parse(data.body)
						}
						catch(e){// console.log(e);
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
				                // console.log(e);
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
						// console.log(error);
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
		// model=extractDivOption(model)
		// model=extractSchemeName(model)
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
				catch(e){// console.log(e);
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
		                // console.log(e);
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
				// console.log(error);
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
		if(model.data.toLowerCase().includes('re send')||model.data.toLowerCase().includes('resend')){
			api.resendOtp(model.tags.session)
			.then((response)=>{
				// console.log(response.body)
				try{
					response = JSON.parse(response.body)
				}
				catch(e){
					// console.log(e)
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
				// console.log(e)
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
					catch(e){// console.log(e);
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
			                // console.log(e);
			                return reject(model)
			            })
					}
					else{
						model.tags.joinAcc = response.Response
						model.tags.investorName=model.tags.joinAcc[0].JoinHolderName.split("/")[0];
						sendExternalMessage(model,"Hi "+model.tags.joinAcc[0].JoinHolderName.split("/")[0]+", hope you are doing great today.");
						model.tags.joinAccIdList = []
						response.Response.forEach(function(element){
							model.tags.joinAccIdList.push(element.JoinAccId.toString())
						})
						model.tags.joinAccList = []
						for(let i in model.tags.joinAcc){
							model.tags.joinAccList.push({
								title: 'Holding Patterns',
								text : model.tags.joinAcc[i].JoinHolderName,
								buttons : [{
									data : "holding|||"+model.tags.joinAcc[i].JoinAccId,
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
						delete model.stage
						return resolve(model)
					}
				}
				catch(e){
					// console.log(e);
					return reject(model);
				}
			})
			.catch(error=>{
				// console.log(error);
				return reject(model)
			})
		}
		else{
			return reject(model)
		}
	})
}

//============================================================


function holding(model){
	return new Promise(function(resolve, reject){
		model.tags.amount = undefined
		model.tags.joinAccId = undefined
		model.tags.tranId=undefined
		model.tags.switchSchemeList=undefined
		model.tags.switchReferenceId=undefined
		model.tags.refrenceIdSwitchTxn=undefined
		if(model.tags.joinAccIdList.includes(model.data)){
			for (let element of model.tags.joinAcc){
				console.log(element.JoinAccId+"::"+model.data)
				if(element.JoinAccId==model.data){
					sendExternalMessage(model,"Going ahead with "+element.JoinHolderName)
					break;
				}
			}
			model.tags.joinAccId = model.data
			console.log("here")
			api.getSwitchScheme(model.tags.session,model.tags.joinAccId)
			.then((data)=>{
				let response;
				try{
					console.log(data)
					response = JSON.parse(data.body)
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

				if(response.Response&&response.Response.length>0){
					if(response.Response[0]["reject_reason"]){
							

						let reply={
			                text    : response.Response[0]["reject_reason"],
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
						model.tags.switchSchemes=response.Response;
						model.tags.switchSchemeList=[]
						model.tags.switchSchemes.forEach(function(element,index){
							console.log(index+"::::::::::::::::::::::::::::::")
							if(index<10){
								if(index==9&&model.tags.switchSchemes.length>10){
									model.tags.switchSchemeList.push({
										title 	: element["SchemeName"],
										text 	: "Folio "+element["FOLIO_NO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
										buttons : [
											{
												text : 'Select',
												data : "scheme|||"+element["SCHEMECODE"].toString()
											},
											{
												text : 'Next',
												data : "scheme|||next"
											}
										]
									})
								}
								else{
									model.tags.switchSchemeList.push({
										title 	: element["SchemeName"],
										text 	: "Folio "+element["FOLIO_NO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
										buttons : [
											{
												text : 'Select',
												data : "scheme|||"+element["SCHEMECODE"].toString()
											}
										]
									})
								}
								
								model.tags.lastSwitchSchemeElement=index+1;


							}
						})

						if(model.tags.switchSchemeList.length==0){
							sendExternalMessage(model,"Oops. This pattern has no schemes to switch.")
							model.stage="summary"
							return resolve(model)
						}
						else{
							console.log(JSON.stringify(model.tags.switchSchemeList,null,3))
							model.stage="scheme"
							return resolve(model)
						}
					}
				}
				else{
					sendExternalMessage(model,"Sorry, you dont have any scheme in this pattern.");
					model.stage="summary"
					return resolve(model)
				}				 
				 
			})
			.catch((e)=>{
				console.log(e)
				return reject(model);
			})
				
		}
		else{
			console.log("3 reject no data")
			return reject(model)
		}
	})
}



function scheme(model){
	return new Promise(function(resolve, reject){
		
		model.tags.amount = undefined
		model.tags.tranId=undefined
		model.tags.switchSchemeList=undefined
		model.tags.switchReferenceId=undefined
		model.tags.refrenceIdSwitchTxn=undefined
		try{
			if(model.data.endsWith("next")){
				model.tags.switchSchemes.forEach(function(element,index){
					console.log(index+"::::::::::::::::::::::::::::::")
					if(index<10){
						if(index==9&&model.tags.switchSchemes.length>10){
							model.tags.switchSchemeList.push({
								title 	: element["SchemeName"],
								text 	: "Folio "+element["FOLIO_NO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
								buttons : [
									{
										text : 'Select',
										data : "scheme|||"+element["SCHEMECODE"].toString()
									},
									{
										text : 'Next',
										data : "scheme|||next"
									}
								]
							})
						}
						else{
							model.tags.switchSchemeList.push({
								title 	: element["SchemeName"],
								text 	: "Folio "+element["FOLIO_NO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
								buttons : [
									{
										text : 'Select',
										data : "scheme|||"+element["SCHEMECODE"].toString()
									}
								]
							})
						}
						
						model.tags.lastSwitchSchemeElement=index+1;


					}
				})
			}
			else if(model.tags.switchSchemes){
				for(let scheme of model.tags.switchSchemes){
					console.log(model.data+"::"+scheme["SCHEMECODE"])
					if(scheme["SCHEMECODE"]==model.data){
						model.tags.switchSchemeObj=scheme;
						model.tags.folio=scheme["FOLIO_NO"]
						let message="Going ahead with "+scheme["SchemeName"]+",";
						if(scheme["InccurExitLoad"]&&scheme["InccurExitLoad"].toString().trim().toLowerCase().includes("true")){
							message+=" This holding have units / amount that are held for less than a year and hence may attract short-term capital gains tax at 15% as well as exit load, if any You may want to modify your request to avoid these losses. It is advisable to hold equity funds for longer time frames to benefit from them."						
						}
						sendExternalMessage(model,message)
						let filteredData={}
						for(let key in data){
							if(data[key].amcCode==model.tags.switchSchemeObj["AMC_CODE"]){
								filteredData[key]=data[key]
							}
						}

						let matches = stringSimilarity.findBestMatch("", Object.keys(filteredData))
						matches.ratings=matches.ratings.sort(sortBy('-rating'));
						model.tags.schemes = matches.ratings.splice(0,9);
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
						model.stage="askSchemeName";
						return resolve(model);
					}
				}
			}
		}
		catch(e){
			console.log(e)
			return reject(model);			
		}

	})
}





function askSchemeName(model){
	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("cancel")||model.data.toLowerCase().includes("stop")||model.data.toLowerCase().trim()=="exit"){
			return reject(model)
		}
		model = extractDivOption(model)
		// model = extractAmount(model)
		// if(model.tags.selectType.toLowerCase().includes("additional")){
		// 	model.stage = 'holding'
		// 	return resolve(model)
		// }
		console.log(JSON.stringify(model.tags.switchSchemeObj,null,3))
		let filteredData={}
		for(let key in data){
			if(data[key].amcCode==model.tags.switchSchemeObj["AMC_CODE"]&&model.tags.switchSchemeObj["SCHEMECODE"]!=data[key].schemeCode){
				filteredData[key]=data[key]
			}
		}
				
		let dataAmc=getAmcNamesEntityReplaced(model.data);
		model.data=dataAmc.text
		let matches = stringSimilarity.findBestMatch(model.data, Object.keys(filteredData))
		if(matches.bestMatch.rating>0.9){
			model.tags.schemes.push(matches.bestMatch.target)
		}
		else if(matches.bestMatch.rating>0.10||dataAmc.flag){
			matches.ratings=matches.ratings.sort(sortBy('-rating'));
			model.tags.schemes = matches.ratings.splice(0,9);
		}
		else{
			return reject(model);
		}
		if(model.tags.schemes){
			model.tags.schemeList = []
			model.tags.schemes.forEach(function(element){
				if(element.target){
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
			})

		}

		model.stage="showSchemeName"
		return resolve(model)
	})
}

function showSchemeName(model){
	return new Promise(function(resolve, reject){
		model.tags.amount = undefined
		model.tags.tranId=undefined
		model.tags.switchReferenceId=undefined
		model.tags.refrenceIdSwitchTxn=undefined
		if(model.data.toLowerCase().includes("cancel")||model.data.toLowerCase().includes("stop")||model.data.toLowerCase().trim()=="exit"){
			return reject(model)
		}
		model = extractDivOption(model)
		// model = extractAmount(model)
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
			api.getFolio(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode,undefined,true)
			.then(response=>{
				console.log(response.body)
				try{


					response = JSON.parse(response.body)
					model.tags.unitOrAmountList=undefined

					if(response.Response.length > 0){
						let folioData=response.Response[0]
						let unitOrAmountData=response.Response[1]
						let folioObj;
						for(let i in folioData){
							if(folioData[i].FolioNo==model.tags.folio){
								folioObj=folioData[i]
							}
						}
						for(let element of unitOrAmountData){
							console.log(element)
							if(element["Value"]=="AU"){
								if(!model.tags.unitOrAmountList){
									model.tags.unitOrAmountList=[]
								}
								model.tags.unitOrAmountList.push({
									data : "All Units",
									text : "All Units"
								})
							}
							else if(element["Value"]=="PU"){
								if(!model.tags.unitOrAmountList){
									model.tags.unitOrAmountList=[]
								}
								model.tags.unitOrAmountList.push({
									data : "Partial Units",
									text : "Partial Units"
								})
							}
							else if(element["Value"]=="R"){
								if(!model.tags.unitOrAmountList){
									model.tags.unitOrAmountList=[]
								}
								model.tags.unitOrAmountList.push({
									data : "Amount",
									text : "Amount"
								})
							}
						}


						if(folioObj){
							console.log("FOLIO:::::::::::::::::::::::::::::"+JSON.stringify(folioObj,null,3)+":::::"+data[model.tags.scheme].optionCode)
							model.tags.divOption=undefined
								if(folioObj["DIVIDENDOPTION"]){
									if(folioObj["FolioNo"]==model.tags.folio||(folioObj["FolioNo"]=="New Folio"&&model.tags.folio=="0")){
										switch(folioObj["DIVIDENDOPTION"]){
											case "Y": model.tags.divOption = 1
													  sendExternalMessage(model,"Dividend option available to you is re-investment")
												break;
											case "N": model.tags.divOption = 2
													  sendExternalMessage(model,"Dividend option available to you is Pay out")
												break;
											case "Z": model.tags.divOption = 0
												break;
											default: model.tags.divOption = undefined
													break;
										}
									}
								}
								if(data[model.tags.scheme].optionCode == 1){
										model.tags.divOption = 0
								}
								// if(model.tags.divOption!=undefined){

								// 	model.stage = 'unitOrAmount'
								// }
								// else{
								// 	delete model.stage
								// }
								sendExternalMessage(model,"Going ahead with "+model.tags.scheme)
								api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode,undefined,model.tags.folio,model.tags.switchSchemeObj["SCHEMECODE"],true)
								.then((response)=>{
									console.log(response.body)
									try{
										response = JSON.parse(response.body)
										if(response.Response && response.Response[0] && response.Response[0][0] && response.Response[0][0].FUNDNAME){

											console.log("1")
											for(let schemeElement of response.Response[0]){
												if(schemeElement["SCHEMECODE"]==data[model.tags.scheme].schemeCode){
													model.tags.schemeApiDetails=schemeElement;
												}
											}
											// model.tags.schemeApiDetails=response.Response[0][0];
											model.tags.euinApiDetails=response.Response[1][0];
											model.tags.euinApiDetailsList=[];
											if(response.Response.length>1){
												for(let i in response.Response[1]){
													model.tags.euinApiDetailsList.push({
														title 	: 'Mode',
														text 	: "Invesment through "+response.Response[1][i]["EUIN"],
														buttons : [
															{
																text : 'Select',
																data : response.Response[1][i]["ID"]
															}
														]
													})
												}
											}
											model.tags.euinApiDetailsList.push({
												title 	: 'Mode',
												text 	: "Self initialized Investment",
												buttons : [
													{
														text : 'Select',
														data : "Direct"
													}
												]
											})
											// model.tags.switchMinAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])

											// if(parseFloat(model.tags.switchSchemeObj["AvailableAmt"])<model.tags.switchMinAmount){
											// 	console.log("2")
											// 	let reply={
									  //               text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account as the minimum investment amount for this scheme is lesser than the amount available in current investment',
									  //               type    : "text",
									  //               sender  : model.sender,
									  //               language: "en"
									  //           }
											// 	external(reply)
											// 	.then((data)=>{
											// 		model.stage = 'showSchemeName'
											// 		model.tags.schemes=undefined;
											// 		model.tags.scheme=undefined;
											// 		return resolve(model)
									  //           })
									  //           .catch((e)=>{
									  //               console.log(e);
									  //               return reject(model)
									  //           })
											// }
											// else{
											// if(parseFloat(model.tags.switchSchemeObj["MinSwitchOutAmount"])>model.tags.switchMinAmount){
											// 	model.tags.switchMinAmount=parseFloat(model.tags.switchSchemeObj["MinSwitchOutAmount"])
											// }
											// model.tags.switchMinAmount=model.tags.switchMinAmount.toString()
											model.stage="agreement"
											return resolve(model)
											// }
												
										}
										else{
											let reason=""
											if(response.Response && response.Response[0]&&response.Response[0]["reject_reason"]){
												reason+=response.Response[0]["reject_reason"]
											}

											let reply={
								                text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account. '+reason,
								                type    : "text",
								                sender  : model.sender,
								                language: "en"
								            }
											external(reply)
											.then((data)=>{
												model.stage = 'showSchemeName'
												model.tags.schemes=undefined;
												model.tags.scheme=undefined;
												return resolve(model)
								            })
								            .catch((e)=>{
								                console.log(e);
								                return reject(model)
								            })
										}
									}
									catch(e){
										return reject(model)
										console.log(e)
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

					}
				}
				catch(e){
					console.log(e);
					return reject(model);
				}
			})
			.catch(e=>{
				console.log(e)
				return reject(model)
			})
			
		}
		else{
			let filteredData={}
			for(let key in data){
				if(data[key].amcCode==model.tags.switchSchemeObj["AMC_CODE"]&&model.tags.switchSchemeObj["SCHEMECODE"]!=data[key].schemeCode){
					filteredData[key]=data[key]
				}
			}
					
			let dataAmc=getAmcNamesEntityReplaced(model.data);
			model.data=dataAmc.text
			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(filteredData))
			if(matches.bestMatch.rating>0.9){
				model.tags.schemes.push(matches.bestMatch.target)
			}
			else if(matches.bestMatch.rating>0.10||dataAmc.flag){
				matches.ratings=matches.ratings.sort(sortBy('-rating'));
				model.tags.schemes = matches.ratings.splice(0,9);
			}
			else{
				return reject(model);
			}
			if(model.tags.schemes){
				model.tags.schemeList = []
				model.tags.schemes.forEach(function(element){
					if(element.target){
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
				})

			}
			model.stage = 'showSchemeName'
			return resolve(model)
		}


	})
}



function euin(model){
	return new Promise(function(resolve, reject){
		let euinFlag=false;
		for(let data of model.tags.euinApiDetailsList){
			if(data.buttons[0].data==model.data){
				euinFlag=true;
				if(model.data.toLowerCase().includes("direct")){
					model.tags.euin=""
					model.tags.existingEuinApiDetails=""
					sendExternalMessage(model,"Hey, as you are investing by yourself, you hereby confirm that this a transaction done purely at your sole discretion, hence transaction will process in 'Execution Only' mode");
				}
				else{
					model.tags.euin=model.data
					model.tags.existingEuinApiDetails=model.data
				}
				console.log("::::::::::::::::::::::::::")
				console.log(model.tags.switchSchemeObj)
				if(model.tags.switchSchemeObj["eKYC"] == "1"){
					model.tags.switchSchemeObj["AvailableAmt"]="50000";
				}
				if(model.tags.divOption!=undefined&&parseFloat(model.tags.switchSchemeObj["AvailableUnits"])<=1){
				// if(true&&model.tags.divOption!=undefined){
							model.tags.unitOrAmount="AU";
							// console.log("amount valid")
							api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount, model.tags.switchSchemeObj["AvailableUnits"], model.tags.folio,model.tags.divOption,model.tags.euin,model.tags.switchSchemeObj["eKYC"])
							.then((data)=>{
								console.log(data)
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
								else if(data.Response&&data.Response.length>0){
									model.tags.refrenceIdSwitchTxn=data.Response[0]["TranReferenceID"];
									model.stage="confirm"
									return resolve(model);
								}
								else{
						                return reject(model)
									
								}
							})
							.catch(e=>{
								console.log(e)
								return reject(model)
							})
				}
				else{
					if(model.tags.divOption!=undefined){
						model.stage = 'unitOrAmount'
					}
					else{
						delete model.stage
					}
					return resolve(model);
				}
			}
		}
		
	});

}

function divOps(model){
	return new Promise(function(resolve, reject){
		// model = extractAmount(model)
		if(model.data.toLowerCase().includes('re invest')||model.data.toLowerCase().includes('re-invest')|| model.data.toLowerCase().includes('payout')){
			
			if(model.data.toLowerCase().includes('re invest')||model.data.toLowerCase().includes('re-invest')){
				model.tags.divOption = 1
				model.tags.divOptionText="Reinvestment Option"
			}
			else{
				model.tags.divOption = 2
				model.tags.divOptionText="Payout Option"
			}
			sendExternalMessage(model,"Going ahead with "+model.tags.divOptionText)
			if(parseFloat(model.tags.switchSchemeObj["AvailableUnits"])<=1){
			// if(true){
							model.tags.unitOrAmount="AU";
							// console.log("amount valid")
							api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount, model.tags.switchSchemeObj["AvailableUnits"], model.tags.folio,model.tags.divOption,model.tags.euin,model.tags.switchSchemeObj["eKYC"])
							.then((data)=>{
								console.log(data.body)
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
								else if(data.Response&&data.Response.length>0){
									model.tags.refrenceIdSwitchTxn=data.Response[0]["TranReferenceID"];
									model.stage="confirm"
									return resolve(model);
								}
								else{
						                return reject(model)
									
								}
							})
							.catch(e=>{
								console.log(e)
								return reject(model)
							})
				}
				else{
					delete model.stage;
					return resolve(model)					
				}

		}
		else{
			return reject(model)
		}
	})
}



function unitOrAmount(model) {

	return new Promise(function(resolve, reject){
		model=dataClean(model)
		console.log(model.data)
		if(model.data.includes("all")){
			model.tags.unitOrAmount="AU";
			// console.log("amount valid")
			api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount, model.tags.switchSchemeObj["AvailableUnits"], model.tags.folio,model.tags.divOption,model.tags.euin,model.tags.switchSchemeObj["eKYC"])
			.then((data)=>{
				console.log(data.body)
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
				else if(data.Response&&data.Response.length>0){
					model.tags.refrenceIdSwitchTxn=data.Response[0]["TranReferenceID"];
					model.stage="confirm"
					return resolve(model);
				}
				else{
		                return reject(model)
					
				}
			})
			.catch(e=>{
				console.log(e)
				return reject(model)
			})
		}
		else if(model.data.includes("amount")){
			model.tags.unitOrAmount="R";
			delete model.stage
			return resolve(model);
		}
		else if(model.data.includes("partial")){
			model.tags.unitOrAmount="PU";
			delete model.stage
			return resolve(model);
		}
		else{
			model.tags.unitOrAmount=undefined;
			return reject(model);
		}
	});
}
function amount(model){
	// console.log(model.tags.schemeApiDetails["MinimumInvestment"]+":::::::::::::::::::::::::::::::::::::::::::::::")
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		console.log(model.tags.unitOrAmount)
		if(model.tags.unitOrAmount=="PU"){
			model=extractAmountUptoThree(model)
		}
		else{
			model=extractAmount(model)
		}
		console.log("amount::::::::::::::::::"+model.tags.amount)
		try{
			if(model.tags.amount&&model.tags.switchSchemeObj){
				

				
				if(model.tags.unitOrAmount=="PU"){
					let amount=parseFloat(model.tags.amount)
					let minAmount=parseFloat(model.tags.schemeApiDetails["MinSwitchUnits"])
					console.log(minAmount)
					console.log(amount)
					// if(amount%multiple!=0){
					// 	model.tags.amount=undefined;
					// }
					if(amount<minAmount){
						sendExternalMessage(model,"Amount should be greater than or equal to Rs "+minAmount+".")
						model.tags.amount=undefined;
					}
				}
				else{
					let amount=parseFloat(model.tags.amount)
					let minAmount=parseFloat(model.tags.schemeApiDetails["MinSwitchAmount"])
					let multiple=parseFloat(model.tags.schemeApiDetails["SwitchMultipleAmount"])
					console.log(minAmount)
					console.log(multiple)
					console.log(amount)
					console.log(amount%multiple)
					if(amount%multiple!=0){
						model.tags.amount=undefined;
					}
					if(amount<minAmount){
						// sendExternalMessage(model,"Redemption amount should be greater than or equal to Rs "+minAmount+".")
						model.tags.amount=undefined;
					}
					// else if(amount>maxAmount){
					// 	// sendExternalMessage(model,"Redemption amount should be equal to or less than Rs "+maxAmount+".")
					// 	model.tags.amount=undefined;
					// }
				}
			


			}

			if(model.tags.amount){

				// console.log("amount valid")
				api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount,  model.tags.amount, model.tags.folio,model.tags.divOption,model.tags.euin,model.tags.switchSchemeObj["eKYC"])
				.then((data)=>{
					console.log(data.body)
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
					else if(data.Response&&data.Response.length>0){
						model.tags.refrenceIdSwitchTxn=data.Response[0]["TranReferenceID"];
						model.stage="confirm"
						return resolve(model);
					}
					else{
			                return reject(model)
						
					}

				})
				.catch(e=>{
					console.log(e)
					return reject(model)
				})

			}
			else{
				console.log("no data")
				return reject(model)
			}	
		}
		catch(e){
			console.log(e)
			return reject(model)
		}
	})
}


function confirm(model){

	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("yes")){
			api.confirmSwitch(model.tags.session,model.tags.refrenceIdSwitchTxn)
			.then((data)=>{
				console.log(data.body)
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
					console.log(model.tags.switchReferenceId+":::::::::::::")
					model.tags.switchReferenceId=data.Response[0]["ReferenceNo"];
					model.stage="summary"
					return resolve(model)

				}

			})
			.catch(e=>{
	            console.log(e);
	            return reject(model)
			})
		}
		else{
			return reject(model)
		}
	});
}


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
            // console.log(e);
       })
}

function extractOTP(model){
	if(model.data.match(regexOtp)){
		model.tags.otp = model.data.match(regexOtp)[0]
		model.data = model.data.replace(model.tags.regexOtp, '')
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
			if(!model.data.includes("-"+text[i])){
				model.tags.amount = text[i]
			}
			model.data = model.data.replace(text[i], '')
			break;
		}
	}

	return model;
}


function extractAmountUptoThree(model){
	
 	if(model.data.match(/\d+\./)){
 		let text = matchAll(model.data, /(\d+\.\d+)/gi).toArray()
 		console.log(text)
 		console.log(text.length)
 		if(text.length>0){
 			if(!model.data.includes("-"+text[0])){
	 			console.log(text[0])
	 			console.log(parseFloat(text[0]).toFixed(3))
	 			console.log(typeof parseFloat(text[0]).toFixed(3))
				model.tags.amount = parseFloat(parseFloat(text[0]).toFixed(3))
				console.log(model.tags.amount+":::::::::::::::::;amount")
			}
			model.data = model.data.replace(text[0], '')
		}
		if(model.tags.amount){
			return model;
		}
 	}
 	return extractAmount(model)
	
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
		else if(text[i].length == 11&&text[i].startsWith("0")){
			model.tags.mobile = text[i].substring(1, 11)
			model.data = model.data.replace(model.tags.mobile, '')
			// console.log(model.tags.mobile+"mobile")
			break;
		}
		else if(text[i].length == 12&&text[i].startsWith("91")){
			model.tags.mobile = text[i].substring(2, 12)
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

function extractDivOption(model){
	if(model.data.match(divOption)){
		model.tags.divOption = model.data.match(divOption)[0]
		model.data = model.data.replace(model.tags.divOption, '')
	}
	return model;			
}

var amcsEntities={
	"Axis":["axis"],
	"Baroda Pioneer":["baroda pioneer","baroda"],
	"Aditya Birla Sun Life":["birla sun life","birla","sun life","bnp"],
	"BNP Paribas":["bnp paribas","bnp","paribas"],
	"BOI AXA":["boi axa investment managers","boi","axa"],
	"Canara Robeco":["canara robeco","canara"],
	"DSP BlackRock":["dsp blackrock", "dsp"],
	"Franklin":["franklin templeton","franklin","ft"],
	"HDFC":["hdfc"],
	"ICICI Prudential":["icici prudential","icici"],
	"IDBI":["idbi"],
	"IDFC":["idfc"],
	"Kotak":["kotak mahindra","kotak","mahindra"],
	"L&T":["l and t","lnt","l and t","l&t"],
	"LIC MF":["lic nomura","lic"],
	"Mirae Asset":["mirae asset global investments","mirae"],
	"Motilal Oswal":["motilal oswal asset management services","motilal"],
	"DHFL Pramerica":["dhfl pramerica","dhfl"],
	"Principal":["principal pnb asset management company","pnb","principal","principal pnb"],
	"Reliance":["reliance"],
	"Invesco":["religare invesco","religare","invesco"],
	"SBI":["sbi"],
	"Sundaram":["sundaram"],
	"Tata":["tata"],
	"UTI":["uti"]
}
function getAmcNamesEntityReplaced(text){
	let flag;
	for(let amcElement in amcsEntities){
		for(let alias of amcsEntities[amcElement]){
			if(text.includes(alias)){
				text=text.replace(alias,amcElement);
				flag=true;		
			}
		}
	}
	return {text:text,flag:flag};
}

function dataClean(model){
	model.data = model.data.toLowerCase()
    return model;
}