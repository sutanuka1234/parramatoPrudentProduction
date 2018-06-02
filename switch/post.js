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
	divOps:divOps,
	unitOrAmount:unitOrAmount,
	amount : amount
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
		// console.log(req.params.stage)
		obj[req.params.stage](req.body)
		.then((data)=>{
			// console.log(req.params.stage+"::::::::::::::::::::::::::::::::::::::::::")
			// console.log(JSON.stringify(data,null,3))
			res.send(data)
		})
		.catch((e)=>{
			// console.log(e)
			res.sendStatus(203)
		})
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
			model = extractAmount(model);
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
											data : element.target
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
		if(model.tags.joinAccId.includes(model.data)){
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
						response.Response.forEach(function(element,index){
							console.log(index+"::::::::::::::::::::::::::::::")
							if(index<10){
								model.tags.switchSchemeList.push({
									title 	: element["SchemeName"],
									text 	: "Folio "+element["FOLIO_NO"]+". Invested Rs. "+element["AvailableAmt"]+". Minimum Rs. "+element["MinSwitchOutAmount"],
									buttons : [
										{
											text : 'Select',
											data : element["SCHEMECODE"].toString()
										}
									]
								})
							}
						})

						if(model.tags.switchSchemeList.length==0){
							sendExternalMessage(model,"Oops. This pattern has no schemes to switch.")
							model.stage="summary"
							return resolve(model)
						}
						else{
							console.log(JSON.stringify(model.tags.switchSchemeList,null,3))
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
		try{
			if(model.tags.switchSchemes){
				for(let scheme of model.tags.switchSchemes){
					console.log(model.data+"::"+scheme["SCHEMECODE"])
					if(scheme["SCHEMECODE"]==model.data){
						model.tags.switchSchemeObj=scheme;
						model.tags.folio=scheme["FOLIO_NO"]
						sendExternalMessage(model,"Going ahead with "+scheme["SchemeName"])
						if(scheme["InccurExitLoad"]=="true"){
							sendExternalMessage(model,`This holding have units / amount that are held for less than a
														year and hence may attract short-term capital gains tax at 15% as
														well as exit load, if any You may want to modify your request to
														avoid these losses. It is advisable to hold equity funds for longer
														time frames to benefit from them.`)
						}
						delete model.stage;
						return resolve(model);
					}
				}
			}
		}
		catch(e){
			console.log(e)
			return reject(model);			
		}

		return reject(model)
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
			if(data[key].amcCode==model.tags.switchSchemeObj["AMC_CODE"]){
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
							data : element.target
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
			if(data[model.tags.scheme].optionCode == 1 || model.tags.divOption!==undefined){
				if(model.tags.divOption){
					if(model.tags.divOption.toString().includes('re') && data[model.tags.scheme].optionCode != 1){
						model.tags.divOption = 1
					}
					else if(model.tags.divOption.toString().includes('pay') && data[model.tags.scheme].optionCode != 1){
						model.tags.divOption = 2
					}
					else{
						model.tags.divOption = 0
					}
					model.stage = 'unitOrAmount'
				}
				else{
					model.tags.divOption = 0
				}
				model.stage = 'unitOrAmount'
			}
			else{
				delete model.stage
			}
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
								data : element.target
							}
						]
					})
				})
			}
		}



		api.getScheme(model.tags.session, model.tags.joinAccId, '2', data[model.tags.scheme].amcCode, data[model.tags.scheme].optionCode, data[model.tags.scheme].subNatureCode,undefined,true)
			.then((response)=>{
				// console.log(response.body)
				try{
					response = JSON.parse(response.body)
				


					if(response.Response && response.Response[0] && response.Response[0][0] && response.Response[0][0].FUNDNAME){
						model.tags.schemeApiDetails=response.Response[0][0];
						model.tags.euinApiDetails=response.Response[0][1];
						model.tags.switchMinAmount=parseFloat(model.tags.schemeApiDetails["MinimumInvestment"])

						if(parseFloat(model.tags.switchSchemeObj["AvailableAmt"])<model.tags.switchMinAmount){
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
							if(parseFloat(model.tags.switchSchemeObj["MinSwitchOutAmount"])>model.tags.switchMinAmount){
								model.tags.switchMinAmount=parseFloat(model.tags.switchSchemeObj["MinSwitchOutAmount"])
							}
							model.tags.switchMinAmount=model.tags.switchMinAmount.toString()
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





	})
}

function divOps(model){
	return new Promise(function(resolve, reject){
		model = extractAmount(model)
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



function unitOrAmount(model) {

	return new Promise(function(resolve, reject){
		model=dataClean(model)
		console.log(model.data)
		if(model.data.includes("all")){
			model.tags.unitOrAmount="AU";
			// console.log("amount valid")
			api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount, model.tags.switchSchemeObj["AvailableUnits"], model.tags.folio,model.tags.divOption,'E020391')
				.then((data)=>{
					console.log(data.body)
					try{
						data.body = JSON.parse(data.body)
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
					if(data.body.Response&&data.body.Response.length>0&&data.body.Response[0].result=="FAIL"){
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
					else if(data.body.Response&&data.body.Response.length>0){
						let refrenceId=data.body.Response[0]["TranReferenceID"];
						api.confirmSwitch(model.tags.session,refrenceId)
						.then((data)=>{
							console.log(data.body)
							try{
								data.body = JSON.parse(data.body)
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
							if(data.Response&&data.Response.length>0&&data.body.Response[0].result=="FAIL"){
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
							else{
								model.tags.switchReferenceId=refrenceId;
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
	console.log(model.tags.schemeApiDetails["MinimumInvestment"]+":::::::::::::::::::::::::::::::::::::::::::::::")
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		model=extractAmount(model)
		// console.log("amount::::::::::::::::::"+model.tags.amount)
		try{
			if(model.tags.amount&&model.tags.switchSchemeObj){
				
				// let amount=parseFloat(model.tags.amount)
				// let maxAmount=parseFloat(model.tags.switchSchemeObj["AvailableAmt"])
				// let minAmount=parseFloat(model.tags.switchMinAmount)
				// console.log(minAmount)
				// console.log(maxAmount)
				// console.log(amount)
				// if(amount<minAmount){
				// 	// sendExternalMessage(model,"Redemption amount should be greater than or equal to Rs "+minAmount+".")
				// 	model.tags.amount=undefined;
				// }
				// else if(amount>maxAmount){
				// 	// sendExternalMessage(model,"Redemption amount should be equal to or less than Rs "+maxAmount+".")
				// 	model.tags.amount=undefined;
				// }



				
				if(model.tags.unitOrAmount=="PU"){
					let amount=parseFloat(model.tags.amount)
					let maxAmount=parseFloat(model.tags.switchSchemeObj["AvailableUnits"])
					let minAmount=parseFloat(model.tags.switchSchemeObj["MinSwitchOutUnits"])
					let multiple=parseFloat(model.tags.switchSchemeObj["SwitchOutMultiplesUnits"])
					console.log(minAmount)
					console.log(maxAmount)
					console.log(multiple)
					console.log(amount)
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
				else{
					let amount=parseFloat(model.tags.amount)
					let maxAmount=parseFloat(model.tags.switchSchemeObj["AvailableAmt"])
					let minAmount=parseFloat(model.tags.switchMinAmount)
					let multiple=parseFloat(model.tags.switchSchemeObj["SwitchOutMultipleAmount"])
					console.log(minAmount)
					console.log(maxAmount)
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
					else if(amount>maxAmount){
						// sendExternalMessage(model,"Redemption amount should be equal to or less than Rs "+maxAmount+".")
						model.tags.amount=undefined;
					}
				}
			


			}

			if(model.tags.amount){

				// console.log("amount valid")
				api.insertBuyCartSwitch(model.tags.session, model.tags.joinAccId, model.tags.switchSchemeObj["SCHEMECODE"], data[model.tags.scheme].schemeCode,model.tags.unitOrAmount,  model.tags.amount, model.tags.folio,model.tags.divOption,'E020391')
				.then((data)=>{
					console.log(data.body)
					try{
						data.body = JSON.parse(data.body)
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
					if(data.body.Response&&data.body.Response.length>0&&data.body.Response[0].result=="FAIL"){
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
					else if(data.body.Response&&data.body.Response.length>0){
						let refrenceId=data.body.Response[0]["TranReferenceID"];
						api.confirmSwitch(model.tags.session,refrenceId)
						.then((data)=>{
							console.log(data.body)
							try{
								data.body = JSON.parse(data.body)
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
							if(data.Response&&data.Response.length>0&&data.body.Response[0].result=="FAIL"){
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
							else{
								model.tags.switchReferenceId=refrenceId;
								delete model.stage
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

function extractMobile(model){
	let text = matchAll(model.data, /(\d+)/gi).toArray()

	// console.log(text)
	for(let i in text){
		if(text[i].length > 10){
			model.tags.mobile = text[i].subString(text[i].length-10,text[i].length)
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