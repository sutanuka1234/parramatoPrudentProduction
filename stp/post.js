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


function main(req, res){
		console.log(req.params.stage)
		var buttonStageArr=req.body.data.split("|||")
		if(buttonStageArr.length==2){
			req.body.data=buttonStageArr[1]
			console.log(req.params.stage+":::"+buttonStageArr[0])
			if(req.params.stage!=buttonStageArr[0]){
					req.params.stage=buttonStageArr[0];
					delete req.body.stage
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
		model.tags.stpSchemeList=undefined
		model.tags.stpReferenceId=undefined
		model.tags.refrenceIdstpTxn=undefined
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

// {
//  "Response": [
//  {
//  "SCHEME_NAME": "I**** B********* F***********",
//  "FOLIO_NO": "1*************7",
//  "ID": "3**,3****,1*******7",
//  "Scheme_Folio": "I*** B****** F******** # Folio No : 1**********7",
//  "SCH_CODE": 3*****6,
//  "MinRedemptionAmount": 1***,
//  "RedemptionMultipleAmount": 1**,
//  "AMC_CODE": 4*****8,
//  "InccurExitLoad": f****,
//  "CurAmount": "4***.8*",
//  "CurUnit": "4**.3**"
//  }
//  ]
// }

// {"Response":[{"SCHEME_NAME":"IDFC Balanced Fund - Regular Plan - Growth","FOLIO_NO":"1794035/37","ID":"374,34066,1794035/37","Scheme_Folio":"IDFC Balanced Fund - Regular Plan - Growth #  Folio No : 1794035/37","SCH_CODE":34066,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400028,"InccurExitLoad":false,"CurAmount":"5780.45","CurUnit":"500"},{"SCHEME_NAME":"Motilal Oswal MOSt Focused Dynamic Equity Fund - Regular Plan - Growth","FOLIO_NO":"9104430742","ID":"374,35831,9104430742","Scheme_Folio":"Motilal Oswal MOSt Focused Dynamic Equity Fund - Regular Plan - Growth #  Folio No : 9104430742","SCH_CODE":35831,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400042,"InccurExitLoad":false,"CurAmount":"12114.7","CurUnit":"1000"},{"SCHEME_NAME":"Reliance Liquid Fund - Treasury Plan - Growth","FOLIO_NO":"499153817726","ID":"374,2637,499153817726","Scheme_Folio":"Reliance Liquid Fund - Treasury Plan - Growth #  Folio No : 499153817726","SCH_CODE":2637,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400025,"InccurExitLoad":false,"CurAmount":"220105","CurUnit":"51.3547"},{"SCHEME_NAME":"Reliance Small Cap Fund - Growth","FOLIO_NO":"499153817726","ID":"374,12758,499153817726","Scheme_Folio":"Reliance Small Cap Fund - Growth #  Folio No : 499153817726","SCH_CODE":12758,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400025,"InccurExitLoad":true,"CurAmount":"8670.92","CurUnit":"199.902"}]}' },
// 2018-06-18T13:12:30.797870+00:00 app[web.1]: body: '{"Response":[{"SCHEME_NAME":"IDFC Balanced Fund - Regular Plan - Growth","FOLIO_NO":"1794035/37","ID":"374,34066,1794035/37","Scheme_Folio":"IDFC Balanced Fund - Regular Plan - Growth #  Folio No : 1794035/37","SCH_CODE":34066,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400028,"InccurExitLoad":false,"CurAmount":"5780.45","CurUnit":"500"},{"SCHEME_NAME":"Motilal Oswal MOSt Focused Dynamic Equity Fund - Regular Plan - Growth","FOLIO_NO":"9104430742","ID":"374,35831,9104430742","Scheme_Folio":"Motilal Oswal MOSt Focused Dynamic Equity Fund - Regular Plan - Growth #  Folio No : 9104430742","SCH_CODE":35831,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400042,"InccurExitLoad":false,"CurAmount":"12114.7","CurUnit":"1000"},{"SCHEME_NAME":"Reliance Liquid Fund - Treasury Plan - Growth","FOLIO_NO":"499153817726","ID":"374,2637,499153817726","Scheme_Folio":"Reliance Liquid Fund - Treasury Plan - Growth #  Folio No : 499153817726","SCH_CODE":2637,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400025,"InccurExitLoad":false,"CurAmount":"220105","CurUnit":"51.3547"},{"SCHEME_NAME":"Reliance Small Cap Fund - Growth","FOLIO_NO":"499153817726","ID":"374,12758,499153817726","Scheme_Folio":"Reliance Small Cap Fund - Growth #  Folio No : 499153817726","SCH_CODE":12758,"MinRedemptionAmount":1000,"RedemptionMultipleAmount":100,"AMC_CODE":400025,"InccurExitLoad":true,"CurAmount":"8670.92","CurUnit":"199.902"}]}' }


			api.getSTPScheme(model.tags.session,model.tags.joinAccId)
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
						model.tags.stpSchemes=response.Response;
						model.tags.stpSchemeList=[]
						response.Response.forEach(function(element,index){
							console.log(index+"::::::::::::::::::::::::::::::")
							if(index<10){
								model.tags.stpSchemeList.push({
									title 	: element["SCHEME_NAME"],
									text 	: "Folio "+element["FOLIO_NO"]+". Invested Rs. "+element["CurAmount"]+". Minimum Rs. "+element["MinRedemptionAmount"],
									buttons : [
										{
											text : 'Select',
											data : "scheme|||"+element["SCH_CODE"].toString()
										}
									]
								})
							}
						})

						if(model.tags.stpSchemeList.length==0){
							sendExternalMessage(model,"Oops. This pattern has no schemes to stp.")
							model.stage="summary"
							return resolve(model)
						}
						else{
							console.log(JSON.stringify(model.tags.stpSchemeList,null,3))
							delete model.stage
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
		model.tags.stpSchemeList=undefined
		model.tags.stpReferenceId=undefined
		model.tags.refrenceIdstpTxn=undefined
		try{
			if(model.tags.stpSchemes){
				for(let scheme of model.tags.stpSchemes){
					console.log(model.data+"::"+scheme["SCH_CODE"])
					if(scheme["SCH_CODE"]==model.data){
						model.data=""
						model.tags.stpSchemeObj=scheme;
						model.tags.folio=scheme["FOLIO_NO"]
						let message="Going ahead with "+scheme["SCHEME_NAME"]+",";
						if(scheme["InccurExitLoad"]&&scheme["InccurExitLoad"].toString().trim().toLowerCase().includes("true")){
							message+=" This holding have units / amount that are held for less than a year and hence may attract short-term capital gains tax at 15% as well as exit load, if any You may want to modify your request to avoid these losses. It is advisable to hold equity funds for longer time frames to benefit from them."						
						}
						sendExternalMessage(model,message)
						let filteredData={}
						for(let key in data){
							if(data[key].amcCode==model.tags.stpSchemeObj["AMC_CODE"]){
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
						model.stage="showSchemeName";
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
		console.log(JSON.stringify(model.tags.stpSchemeObj,null,3))
		let filteredData={}
		for(let key in data){
			if(data[key].amcCode==model.tags.stpSchemeObj["AMC_CODE"]){
				filteredData[key]=data[key]
			}
		}

		let matches = stringSimilarity.findBestMatch(model.data, Object.keys(filteredData))
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
		model.tags.amount = undefined
		model.tags.tranId=undefined
		model.tags.stpReferenceId=undefined
		model.tags.refrenceIdstpTxn=undefined
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
			api.getFolio(model.tags.session, model.tags.joinAccId, data[model.tags.scheme].schemeCode, data[model.tags.scheme].amcCode,undefined,undefined,true)
			.then(response=>{
				console.log(response.body)
				try{


					response = JSON.parse(response.body)
					model.tags.unitOrAmountList=undefined
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
					

					else if(response.Response.length > 0){
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
								if(folioObj["DivOpt"]){
									switch(folioObj["DivOpt"]){
										case "Y": model.tags.divOption = 1
											break;
										case "N": model.tags.divOption = 2
											break;
										case "B": model.tags.divOption = 0
											break;
										default: model.tags.divOption = undefined
												break;
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
// "Response": [
//  [
//  {
//  "ID": *,
//  "FUNDNAME": "I****** M********* C********",
//  "SCHEMECODE": 7***,
//  "ACLASSCODE": *,
//  "OPT_CODE": *,
//  "SchemeName": "I***** A****** R********",
//  "Category": "E***",
//  "CurrentNAV": 1*.2***,
//  "MinimumInvestment": 1***,
//  "1YearReturns": 2*.1***,
//  "3YearReturns": 1*.2***,
//  "5YearReturns": 2*.1***,
//  "MinSwitchAmount": 5**,
//  "MININVT": 1***,
//  "MULTIPLES": 5**,
//  "INC_INVEST": 1***,
//  "ADNMULTIPLES": 5**,
//  "MinRedemptionAmount": 1***,
//  "RedemptionMultipleAmount": 1**,
//  "AMC_CODE": 4****8,
//  "RECOMD": *,
//  "MaxInvestment": 9*******,
//  "eKYC": *
//  }
//  ],
//  [
//  {
//  "ID": "E020391",
//  "EUIN": "STAFF / E020391"
//  }
//  ]
//  ]
								api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode,undefined,undefined,true)
								.then((response)=>{
									// console.log(response.body)
									try{
										response = JSON.parse(response.body)
									


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
											model.tags.stpMinAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])

											if(parseFloat(model.tags.stpSchemeObj["CurAmount"])<model.tags.stpMinAmount){
												let reply={
									                text    : 'The scheme '+model.tags.scheme+' cannot be purchased with this account as the minimum investment amount for this scheme is lesser than the amount available in current investment',
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
											else{
												if(parseFloat(model.tags.stpSchemeObj["MinSwitchAmount"])>model.tags.stpMinAmount){
													model.tags.stpMinAmount=parseFloat(model.tags.stpSchemeObj["MinSwitchAmount"])
												}
												model.tags.stpMinAmount=model.tags.stpMinAmount.toString()
												delete model.stage
												return resolve(model)
											}
												
										}
										else{
											let reason=""
											if(response.Response && response.Response[0]){
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
				if(data[key].amcCode==model.tags.stpSchemeObj["AMC_CODE"]){
					filteredData[key]=data[key]
				}
			}

			let matches = stringSimilarity.findBestMatch(model.data, Object.keys(filteredData))
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
								data : "showSchemeName|||"+element.target
							}
						]
					})
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
			if(data["data"]==model.data){
				euinFlag=true;
				model.tags.euin=model.data
				model.tags.existingEuinApiDetails=model.data
				return resolve(model);
			}
		}
		
		return reject(model);
	});

}


function divOps(model){
	return new Promise(function(resolve, reject){
		// model = extractAmount(model)
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
			delete model.stage;
			return resolve(model)
		}
		else{
			return reject(model)
		}
	})
}




function confirm(model){

	return new Promise(function(resolve, reject){
		if(model.data.toLowerCase().includes("yes")){
			api.confirmSTP(model.tags.session,model.tags.refrenceIdstpTxn)
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
					model.tags.stpReferenceId=data.Response[0]["ReferenceNo"];
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
			model.tags.amount = text[i]
			model.data = model.data.replace(model.tags.amount, '')
			break;
		}
	}
	return model;
}


function extractAmountUptoThree(model){
	
 	if(model.data.match(/\d+\./)){
 		let text = matchAll(model.data, /(\d+[\.\d{1-3}]?)/gi).toArray()
		for(let i in text){
			if(text[i].length < 12){
				model.tags.amount = parseFloat(text[i].toFixed(3))
				model.data = model.data.replace(model.tags.amount, '')
				break;
			}
		}

		return model;
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


function dataClean(model){
	model.data = model.data.toLowerCase()
    return model;
}