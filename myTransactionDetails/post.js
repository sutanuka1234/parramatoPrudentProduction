"use strict"

module.exports = {
	main : main
}

let api = require('../api.js')
let external = require('../external.js')
let words = require('../words.js')
let data = require('../data.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
const size = 10

let obj = {
	panMobile 			: panMobile,
	mobile				: mobile,
	pan					: pan,
	otp					: otp,
	transactionStatus 	: transactionStatus,
	lastTenTransactions : lastTenTransactions,
	transactionID 		: transactionID
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

let sortedJourney = [
	"panMobile",
	"mobile",
	"pan",
	"otp",
	"agreement",
	"holding",
	"scheme",
	"unitOrAmount",
	"amount",
	"confirm",
	"summary"
]


function main(req, res){
	console.log(req.params.stage)
	console.log("POST")
	var buttonStageArr=req.body.data.split("|||")
	if(buttonStageArr.length==2&&obj[buttonStageArr[0]]){
		req.body.data=buttonStageArr[1]
		console.log(req.params.stage+":::"+buttonStageArr[0])
		if(req.params.stage!=buttonStageArr[0]&&sortedJourney.indexOf(req.params.stage)>sortedJourney.indexOf(buttonStageArr[0])){
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
			api.panMobile(model.tags.ip, model.tags.mobile, model.tags.pan)
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
				api.panMobile(model.tags.ip, model.tags.mobile, model.tags.pan)
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
					api.panMobile(model.tags.ip, model.tags.mobile, model.tags.pan)
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
			api.panMobile(model.tags.ip, model.tags.mobile, model.tags.pan)
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
			api.resendOtp(model.tags.ip, model.tags.session)
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
			api.otp(model.tags.ip, model.tags.session, model.tags.otp)
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

function transactionStatus(model){
	return new Promise((resolve,reject)=>{
		if(model.data.toLowerCase().includes('10 transaction') || model.data.toLowerCase().includes('last 10 transactions') || model.data.toLowerCase().includes('last ten transactions')){
			model.tags.transactionId = 0
			api.getTransactionDetails(model.tags.ip, model.tags.session,model.tags.transactionId).then((data)=>{
				data.body = JSON.parse(data.body)
				console.log(data.body.Response.length)
				console.log("--------------transactionStatus post getTransactionDetails---------")
				console.log(data.body)
				model.tags.transactions = []
				for(let i = 0; i<10; i++){
					model.tags.transactions.push({
						title 	: "Folio No. "+data.body.Response[i].Foliono,
						text 	: data.body.Response[i].SchemeName+" - "+data.body.Response[i].TransactionType+". Amount: "+data.body.Response[i].AMOUNT+" on "+dateTimeFormat(data.body.Response[i].ProcessDate),
						image 	: '',
						buttons : [
							{
								data : data.body.Response[i].ReferenceID,
								text : "Tx ID: "+data.body.Response[i].ReferenceID
							}
						]
					})
				}
				model.stage = 'lastTenTransactions'
				return resolve(model)
			})
			.catch((e)=>{
				console.log(e)
			})	
		}
		else if(model.data.match(/\d{10}/)){
			model.tags.transactionId = model.data.match(/\d{10}/)[0]
			api.getTransactionDetails(model.tags.ip, model.tags.session,model.tags.transactionId).then((data)=>{
				data.body = JSON.parse(data.body)
				console.log(data.body.Response.length)
				if(data.body.Response.length == 0){
					model.tags.txNotFound = 1
					model.tags.transactionId = 0
					api.getTransactionDetails(model.tags.ip, model.tags.session,model.tags.transactionId).then((data)=>{
						data.body = JSON.parse(data.body)
						console.log(data.body.Response.length)
						model.tags.transactions = []
						for(let i = 0; i<10; i++){
							model.tags.transactions.push({
								title 	: "Folio No. "+data.body.Response[i].Foliono,
								text 	: data.body.Response[i].SchemeName+" - "+data.body.Response[i].TransactionType+". Amount: "+data.body.Response[i].AMOUNT+" on "+dateTimeFormat(data.body.Response[i].ProcessDate),
								image 	: '',
								buttons : [
									{
										data : data.body.Response[i].ReferenceID,
										text : "Tx ID: "+data.body.Response[i].ReferenceID
									}
								]
							})
						}
						model.stage = 'lastTenTransactions'
						resolve (model)
					})
					.catch((e)=>{
						console.log(e)
						reject(model)
					})
				}
				else if(data.body.Response.length >1){
					model.tags.transactions = []
					for(let i = 0; i<data.body.Response.length; i++){
						model.tags.transactions.push({
							title 	: "TX ID: "+data.body.Response[i].ReferenceID,
							text 	: data.body.Response[i].SchemeName+" - "+data.body.Response[i].TransactionType+" "+amountNull(data.body.Response[i].AMOUNT)+" on "+dateTimeFormat(data.body.Response[i].ProcessDate),
							image 	: '',
							buttons : [
								{
									data : data.body.Response[i].ReferenceID+"|"+data.body.Response[i].SchemeName+"|"+data.body.Response[i].DivOpt+"|"+data.body.Response[i].TransactionType+"|"+data.body.Response[i].UNITS+"|"+data.body.Response[i].AMOUNT+"|"+data.body.Response[i].TransactionStatus+"|"+dateTimeFormat(data.body.Response[i].ProcessDate),
									text : "Select"
								}
							]
						})
					}
					model.tags.multipleTx = 1
					model.stage = 'lastTenTransactions'
					return resolve (model)
				}
				else if(data.body.Response.length == 1 || data.body){
					console.log("here---------------")
					model.tags.txResObj = {}
					model.tags.txResObj.ReferenceID = data.body.Response[0].ReferenceID
					model.tags.txResObj.SchemeName = data.body.Response[0].SchemeName
					model.tags.txResObj.DivOpt = data.body.Response[0].DivOpt
					model.tags.txResObj.TransactionType = data.body.Response[0].TransactionType
					model.tags.txResObj.UNITS = data.body.Response[0].UNITS
					model.tags.txResObj.AMOUNT = data.body.Response[0].AMOUNT
					model.tags.txResObj.TransactionStatus = data.body.Response[0].TransactionStatus
					model.tags.txResObj.ProcessDate = dateTimeFormat(data.body.Response[0].ProcessDate)
					// console.log(model.tags)
					model.stage = 'transactionID'
					resolve(model)
				}
				else{
					model.stage = 'lastTenTransactions'
					resolve(model)
				}
			})
			.catch((e)=>{
				console.log(e)
				reject(model)
			})
		}
		else if(model.data.toLowerCase().includes('id') || model.data.toLowerCase().includes('transaction id')){
			model.tags.txId = 1
			resolve(model)
		}
		else{
			reject(model)

		}
	})
}

function lastTenTransactions(model){
	return new Promise(function(resolve,reject){
		if(model.data.includes("|")){
			// console.log("-------here")
			let dataArray = model.data.split("|")
			model.tags.txResObj = {}
			model.tags.txResObj.ReferenceID = dataArray[0]
			model.tags.txResObj.SchemeName = dataArray[1]
			model.tags.txResObj.DivOpt = dataArray[2]
			model.tags.txResObj.TransactionType = dataArray[3]
			model.tags.txResObj.UNITS = dataArray[4]
			model.tags.txResObj.AMOUNT = dataArray[5]
			model.tags.txResObj.TransactionStatus = dataArray[6]
			model.tags.txResObj.ProcessDate = dataArray[7]
			model.stage = 'transactionID'
			return resolve(model)
		}
		else if(model.data.match(/\d{10}/)){
			model.tags.transactionId = model.data.match(/\d{10}/)[0]
			api.getTransactionDetails(model.tags.ip, model.tags.session,model.tags.transactionId).then((data)=>{
				data.body = JSON.parse(data.body)
				if(data.body.Response.length >1){
					model.tags.transactions = []
					for(let i = 0; i<data.body.Response.length; i++){
						model.tags.transactions.push({
							title 	: "TX ID: "+data.body.Response[i].ReferenceID,
							text 	: data.body.Response[i].SchemeName+" - "+data.body.Response[i].TransactionType+" "+amountNull(data.body.Response[i].AMOUNT)+" on "+dateTimeFormat(data.body.Response[i].ProcessDate),
							image 	: '',
							buttons : [
								{
									data : data.body.Response[i].ReferenceID+"|"+data.body.Response[i].SchemeName+"|"+data.body.Response[i].DivOpt+"|"+data.body.Response[i].TransactionType+"|"+data.body.Response[i].UNITS+"|"+data.body.Response[i].AMOUNT+"|"+data.body.Response[i].TransactionStatus+"|"+dateTimeFormat(data.body.Response[i].ProcessDate),
									text : "Select"
								}
							]
						})
					}
					model.tags.multipleTx = 1
					return resolve (model)
				}
				else{
					model.tags.txResObj = {}
					model.tags.txResObj.ReferenceID = data.body.Response[0].ReferenceID
					model.tags.txResObj.SchemeName = data.body.Response[0].SchemeName
					model.tags.txResObj.DivOpt = data.body.Response[0].DivOpt
					model.tags.txResObj.TransactionType = data.body.Response[0].TransactionType
					model.tags.txResObj.UNITS = data.body.Response[0].UNITS
					model.tags.txResObj.AMOUNT = data.body.Response[0].AMOUNT
					model.tags.txResObj.TransactionStatus = data.body.Response[0].TransactionStatus
					model.tags.txResObj.ProcessDate = dateTimeFormat(data.body.Response[0].ProcessDate)
					model.stage = 'transactionID'
					return resolve(model)
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

function transactionID(model){
	return new Promise((resolve,reject)=>{
		let input = model.data.toLowerCase().trim()
		if(input.includes("done")){
			model.stage = 'final'
			return resolve(model)
		}
		else if(input.includes("more transaction") || input.includes("check other") || input.includes("transaction details")){
			model.stage = 'transactionStatus'
			return resolve(model)
		}
		return reject(model)
	})
}

function amountNull(amount){
	if(amount == 'null' || amount == null){
		return ""
	}
	else{
		return " Amount: "+amount
	}
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

function dateTimeFormat(dateTimeValue) {
	if(dateTimeValue == null){
		return dateTimeValue = "-"
	}
    var dt = new Date(parseInt(dateTimeValue.replace(/(^.*\()|([+-].*$)/g, '')));
    var dateTimeFormat = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    // console.log(dateTimeFormat)
    return dateTimeFormat;
}