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
const size=10
let obj = {
	panMobile : panMobile,
	mobile	: mobile,
	pan		: pan,
	otp		: otp,
	holding : holding,
	scheme 	: scheme,
	unitOrAmount:unitOrAmount,
	amount 	:amount,
	confirm : confirm
}


let regexMobile	= /[789]\d{9}/gi
let regexPan 	= /[a-z]{3}p[a-z]\d{4}[a-z]|[a-z]{3}h[a-z]\d{4}[a-z]/
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
"unitOrAmount",
"amount",
"confirm",
"summary"]

let greeting = ["Hope you are doing great today", "Good to see you!", "Hope you are having a good time", "Hope you are doing well today."]

function main(req, res){
// console.logeq.params.stage)
		var buttonStageArr=req.body.data.split("|||")
		if(buttonStageArr.length==2&&obj[buttonStageArr[0]]){
			req.body.data=buttonStageArr[1]
// console.logeq.params.stage+":::"+buttonStageArr[0])
			if(req.params.stage!=buttonStageArr[0]&&sortedJourney.indexOf(req.params.stage)>sortedJourney.indexOf(buttonStageArr[0])){
					req.params.stage=buttonStageArr[0];
					delete req.body.stage
			}
		}
		
		if(obj[req.params.stage]){
			obj[req.params.stage](req.body)
			.then((data)=>{
// console.log3")
				res.send(data)
			})
			.catch((e)=>{
				console.log(e)
				res.sendStatus(203)
			})
		}
		else{
// console.logNo such function available")
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
		if(model.data&&!model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){	
			// console.log("1")
			return reject(model);
		}
		else if(model.data&&model.data.includes("proceed")&&model.tags.mobile&&model.tags.pan){
			// console.log("2")
			api.panMobile(model.tags.ip,model.tags.mobile, model.tags.pan)
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
			// model = extractAmount(model);
			model = extractFolio(model);
			if(model.tags.pan&&model.tags.mobile){
				api.panMobile(model.tags.ip,model.tags.mobile, model.tags.pan)
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
			// model = extractAmount(model);
			// model = extractFolio(model);
			if(model.tags.pan&&model.tags.mobile){
					api.panMobile(model.tags.ip,model.tags.mobile, model.tags.pan)
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
		// model = extractAmount(model);
		// model = extractFolio(model);
			// console.log("TAGG")
			// console.log(JSON.stringify(model.tags,null,3))
		if(model.tags.pan&&model.tags.mobile){
			api.panMobile(model.tags.ip,model.tags.mobile, model.tags.pan)
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
			api.resendOtp(model.tags.ip,model.tags.session)
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
			api.otp(model.tags.ip,model.tags.session, model.tags.otp)
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
						sendExternalMessage(model,"Hi "+model.tags.joinAcc[0].JoinHolderName.split("/")[0]+", "+greeting[Math.floor(Math.random()* 3)]);
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
											data : "scheme|||"+element.target
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
		model.tags.redeemSchemeList=undefined
		model.tags.redeemReferenceId=undefined
		model.tags.refrenceIdRedeemTxn=undefined
		if(model.tags.joinAccIdList.includes(model.data)){
			for (let element of model.tags.joinAcc){
				console.log(element.JoinAccId+"::"+model.data)
				if(element.JoinAccId==model.data){
					sendExternalMessage(model,"Going ahead with "+element.JoinHolderName)
					break;
				}
			}
			model.tags.joinAccId = model.data
// console.loghere")
			api.getRedemptionSchemes(model.tags.ip,model.tags.session, model.tags.joinAccId)
			.then((data)=>{
				let response;
					try{
// console.logata)
						response = JSON.parse(data.body)
// console.logyogi")
// console.logSON.stringify(response, null, 3))
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
					try{
						if(response.Response&&response.Response.length>0&&response.Response[0].result=="FAIL"){
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
// console.logSON.stringify(response,null,3))
						if(response.Response&&response.Response.length>0&&response.Response[0].length>0){
							model.tags.redeemSchemes=response.Response[0];
							model.tags.redeemSchemeList=[]
							model.tags.redeemSchemes.forEach(function(element,index){
								if(index<size){
									if(index==size-1&&model.tags.redeemSchemes.length>size){
										model.tags.redeemSchemeList.push({
											title 	: element["SCHEMENAME"],
											text 	: "Folio "+element["FOLIONO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
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
										model.tags.redeemSchemeList.push({
											title 	: element["SCHEMENAME"],
											text 	: "Folio "+element["FOLIONO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
											buttons : [
												{
													text : 'Select',
													data : "scheme|||"+element["SCHEMECODE"].toString()
												}
											]
										})
									}
									
									model.tags.lastRedeemSchemeElement=index+1;
								}
							})
							if(model.tags.redeemSchemeList.length==0){
								sendExternalMessage(model,"Oops. This pattern has no schemes to redeem.")
								model.stage="summary"
								return resolve(model)
							}
							else{
								model.stage="scheme"
								return resolve(model)
							}
						}
						else{
							sendExternalMessage(model,"Sorry, you dont have any scheme in this pattern.");
							model.stage="summary"
							return resolve(model)
						}
					}
					catch(e){
						console.log(e)
						return reject(model)
					}
			})
			.catch(e=>{
				console.log(e);
				return reject(model);
			});
				
		}
		else{
// console.log3 reject no data")
			return reject(model)
		}
	})
}

// function folio(model){
// 	return new Promise(function(resolve, reject){
// 		let arr = []
// 		for(let i in model.tags.folioList){
// 			arr.push(model.tags.folioList[i].data)
// 		}
// 		model.tags.amcName = data[model.tags.scheme].amcName
// 		if(arr.includes(model.data)){
// 			sendExternalMessage(model,"Going ahead with "+model.data)
// 			model.tags.folio = model.data
			
// 		}
// 		else{

// 			console.log("no data");
// 			return reject(model)
// 		}
// 	})
// }

function scheme(model){
	return new Promise(function(resolve, reject){
		model.tags.amount = undefined
		model.tags.tranId=undefined
		model.tags.redeemSchemeList=undefined
		model.tags.redeemReferenceId=undefined
		model.tags.refrenceIdRedeemTxn=undefined
		let flag=false
		try{
			if(model.data.endsWith("next")&&model.tags.lastRedeemSchemeElement&&model.tags.redeemSchemes.length>model.tags.lastRedeemSchemeElement){
				model.tags.redeemSchemeList=[]
				// model.tags.redeemSchemes.forEach(function(element,index){
				for(let index = model.tags.lastRedeemSchemeElement;index<model.tags.redeemSchemes.length;index++){
					let element=model.tags.redeemSchemes[index];
					if(index<model.tags.lastRedeemSchemeElement+size){
						if(index==model.tags.lastRedeemSchemeElement-1+size&&model.tags.redeemSchemes.length>model.tags.lastRedeemSchemeElement+size){
							model.tags.redeemSchemeList.push({
								title 	: element["SCHEMENAME"],
								text 	: "Folio "+element["FOLIONO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
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
							model.tags.redeemSchemeList.push({
								title 	: element["SCHEMENAME"],
								text 	: "Folio "+element["FOLIONO"]+". Amount Rs. "+element["AvailableAmt"]+". Units "+element["AvailableUnits"],
								buttons : [
									{
										text : 'Select',
										data : "scheme|||"+element["SCHEMECODE"].toString()
									}
								]
							})
						}
						
						model.tags.lastRedeemSchemeElement=index+1;
					}
				}
				model.stage="scheme"
				return resolve(model)
			}
			else if(model.tags.redeemSchemes){
				for(let scheme of model.tags.redeemSchemes){
// console.logodel.data+"::"+scheme["SCHEMECODE"])
					if(scheme["SCHEMECODE"]==model.data){
						flag=true
						model.tags.redeemSchemeObj=scheme;
						model.tags.folio=scheme["FOLIONO"]
						let message="Going ahead with "+scheme["SCHEMENAME"]+",";
						if(scheme["InccurExitLoad"]&&scheme["InccurExitLoad"].toString().trim().toLowerCase().includes("true")){
							message+=" This holding have units / amount that are held for less than a year and hence may attract short-term capital gains tax at 15% as well as exit load, if any You may want to modify your request to avoid these losses. It is advisable to hold equity funds for longer time frames to benefit from them."						
						}
						sendExternalMessage(model,message)
						if(parseFloat(model.tags.redeemSchemeObj["AvailableUnits"])<=1){
						// if(true){
							model.tags.unitOrAmount="AU";
							// console.log("amount valid")
							api.insertBuyCartRedeem(model.tags.ip,model.tags.session, model.tags.joinAccId, model.tags.redeemSchemeObj["SCHEMECODE"], model.tags.redeemSchemeObj["SCHEMENAME"],model.tags.redeemSchemeObj["AvailableUnits"], model.tags.folio,model.tags.unitOrAmount)
							.then((data)=>{
// console.logata.body)
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
// console.logdata 1 failed")
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
// console.logdata 2 failed")
						                return reject(model);
						            })
						            .catch((e)=>{
						                console.log(e);
						                return reject(model)
						            })
								}
								else if(data.Response&&data.Response.length>0){
									model.tags.refrenceIdRedeemTxn=data.Response[0]["TranReferenceID"];
									model.stage="confirm";
// console.logresolved confirm")
									return resolve(model);
								}
								else{
// console.logall failed")
						                return reject(model)
									
								}

							})
							.catch(e=>{
								console.log(e)
								return reject(model)
							})
						}
						else{
							model.stage="unitOrAmount";
							return resolve(model);

						}
					}
				}
				if(!flag){
					return reject(model)
				}
				
			}
			else{
// console.lognone")
				return reject(model)
			}
		}
		catch(e){
			console.log(e)
			return reject(model);			
		}
		// return reject(model)
	})
}

function unitOrAmount(model) {

	return new Promise(function(resolve, reject){
		model=dataClean(model)
// console.logodel.data)
		if(model.data.includes("all")){
			model.tags.unitOrAmount="AU";
			// console.log("amount valid")
			api.insertBuyCartRedeem(model.tags.ip,model.tags.session, model.tags.joinAccId, model.tags.redeemSchemeObj["SCHEMECODE"], model.tags.redeemSchemeObj["SCHEMENAME"],model.tags.redeemSchemeObj["AvailableUnits"], model.tags.folio,model.tags.unitOrAmount)
			.then((data)=>{
// console.logata.body)
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
					model.tags.refrenceIdRedeemTxn=data.Response[0]["TranReferenceID"];
					model.stage="confirm";
					return resolve(model)
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
// console.logamount::::::::::::::::::")
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		if(model.tags.unitOrAmount=="PU"){
			model=extractAmountUptoThree(model)
		}
		else{
			model=extractAmount(model)
		}
		// model=extractAmount(model)
// console.logamount::::::::::::::::::"+model.tags.amount)
		try{
			if(model.tags.amount&&model.tags.redeemSchemeObj){
				if(model.tags.unitOrAmount=="PU"){
					let amount=parseFloat(model.tags.amount)
					let maxAmount=parseFloat(model.tags.redeemSchemeObj["AvailableUnits"])
					let minAmount=parseFloat(model.tags.redeemSchemeObj["MinRedemptionUnits"])
					let multiple=parseFloat(model.tags.redeemSchemeObj["RedemptionMultiplesUnits"])
// console.loginAmount)
// console.logaxAmount)
// console.logmount)
					if(amount<minAmount){
						// sendExternalMessage(model,"Redemption amount should be greater than or equal to Rs "+minAmount+".")
						model.tags.amount=undefined;
					}
					else if(amount>maxAmount){
						// sendExternalMessage(model,"Redemption amount should be equal to or less than Rs "+maxAmount+".")
						model.tags.amount=undefined;
					}
				}
				else{
					let amount=parseFloat(model.tags.amount)
					let maxAmount=parseFloat(model.tags.redeemSchemeObj["AvailableAmt"])
					let minAmount=parseFloat(model.tags.redeemSchemeObj["MinRedemptionAmount"])
					let multiple=parseFloat(model.tags.redeemSchemeObj["RedemptionMultipleAmount"])
// console.loginAmount)
// console.logaxAmount)
// console.logultiple)
// console.logmount)
// console.logmount%multiple)
					if(amount%multiple!=0){
						model.tags.amount=undefined;
					}
					if(amount<minAmount){
						// sendExternalMessage(model,"Redemption amount should be greater than or equal to Rs "+minAmount+".")
						model.tags.amount=undefined;
					}
					else if(amount>maxAmount){
						// sendExternalMessage(model,"Redemption amount should be equal to or less than Rs "+maxAmount+".")
						model.tags.amount=undefined;
					}
				}
			}

			if(model.tags.amount){

				// console.log("amount valid")
				api.insertBuyCartRedeem(model.tags.ip,model.tags.session, model.tags.joinAccId, model.tags.redeemSchemeObj["SCHEMECODE"], model.tags.redeemSchemeObj["SCHEMENAME"],model.tags.amount, model.tags.folio,model.tags.unitOrAmount)
				.then((data)=>{
// console.logata.body)
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
						model.tags.refrenceIdRedeemTxn=data.Response[0]["TranReferenceID"];
						model.stage="confirm";
						return resolve(model)
					}
					else{
// console.logno ref id")
			                return reject(model)
						
					}

				})
				.catch(e=>{
					console.log(e)
					return reject(model)
				})

			}
			else{
// console.logno data")
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
			api.confirmRedemption(model.tags.ip,model.tags.session,model.tags.refrenceIdRedeemTxn)
			.then((data)=>{
// console.logata.body)
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
// console.logsummaryyyyy")
					model.tags.redeemReferenceId=data.Response[0]["ReferenceNo"];
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


function extractFolio(model){
	if(model.data.match(regexFolio)){

		model.tags.folio = model.data.match(regexFolio)[0].match(/\d+|new folio/)[0]
		if(model.tags.folio.includes("new folio")){
			model.tags.folio="0";
		}
		model.data = model.data.replace(model.tags.folio, '')
	}
	return model;
}


function extractAmountUptoThree(model){
	
 	if(model.data.match(/\d+\./)){
 		let text = matchAll(model.data, /(\d+\.\d+)/gi).toArray()
// console.logext)
// console.logext.length)
 		if(text.length>0){
 			if(!model.data.includes("-"+text[0])){
// console.logext[0])
// console.logarseFloat(text[0]).toFixed(3))
// console.logypeof parseFloat(text[0]).toFixed(3))
				model.tags.amount = parseFloat(parseFloat(text[0]).toFixed(3))
// console.logodel.tags.amount+":::::::::::::::::;amount")
			}
			model.data = model.data.replace(text[0], '')
		}
		if(model.tags.amount){
			return model;
		}
 	}
 	return extractAmount(model)
	
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


function dataClean(model){
	model.data = model.data.toLowerCase()
    return model;
}