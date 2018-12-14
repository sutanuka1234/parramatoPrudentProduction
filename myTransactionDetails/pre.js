'use strict'

module.exports = {
	main : main
}

let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')
var api = require('../api.js');

let obj = {
	panMobile 			: panMobile,
	otp 				: otp,
	transactionStatus 	: transactionStatus,
	lastTenTransactions : lastTenTransactions,
	transactionID 		: transactionID
}

let regexPan   	= /[a-z]{3}p[a-z]\d{4}[a-z]/;
let regexMobile = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/;
let regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/
let schemeType 	= /dividend|growth/
let divOption 	= /re(-|\s)?invest|pay(\s)?out/
let regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
let formatter 	= new StringMask('XXXXXX0000', {reverse:true});

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
	obj[req.params.stage](req.body)
	.then((data)=>{
		res.send(data)
	})
	.catch((e)=>{
		console.log(e)
		res.sendStatus(203)
	})
}

function panMobile(model){
	return new Promise(function(resolve, reject){
		model.tags.amount = undefined
		model.tags.joinAccId = undefined
		model.tags.otp=undefined
		model.tags.resend=undefined
		model.tags.tranId=undefined
		model.tags.redeemSchemeList=undefined
		model.tags.redeemReferenceId=undefined
		model.tags.refrenceIdRedeemTxn=undefined
		model=dataClean(model)
		if(model.tags.userSays){
			model=extractPan(model)
			model=extractMobile(model)
			// model=extractAmount(model)
			// model=extractFolio(model)
		}
		if(model.tags.mobile || model.tags.pan){
			model.reply={
				type:"quickReply",
	            text:"Sure, we have your credentials linked to mobile "+formatter.apply(model.tags.mobile)+" saved. Would you like to proceed with fetching transaction details?",
	            next:{
	                "data": [
	                	{
	                		data : 'Proceed',
	                		text : 'Proceed'
	                	},
	                	{
	                		data : 'Not me',
	                		text : 'Not me'
	                	},
	                	{
	                		data : 'Cancel',
	                		text : 'Cancel'
	                	}
	                ]
	            }
			}
		}
		console.log(model.tags.schemes)
		return resolve(model)
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.tags.resend){
			model.tags.resend=undefined
			model.reply={
				type : "text",
				text : "The new OTP is sent to your mobile number ("+formatter.apply(model.tags.mobile)+"), Please share it here. In case if you have not received any OTP, we would send you one if you say 'resend'"
			}
		}
		else{
			model.reply={
				type : "text",
				text : "We have sent an OTP to your mobile number ("+formatter.apply(model.tags.mobile)+"), please share it here. In case if you have not received any OTP, we would send you one if you say 'resend'"
			}
		}
		return resolve(model)
	})
}

function transactionStatus(model){
	return new Promise((resolve,reject)=>{
		console.log("--------------transactionStatus pre---------")
		console.log(model)
		if(model.tags.txId == 1){
			model.reply = {
				type : 'text',
				text : 'Okay, kindly type it below.'
			}
			model.tags.txId = undefined
		}
		else{
			model.reply = {
				type : "quickReply",
				text : "I’ll help you out with your transaction status right away. Kindly choose one below as required.",
				next : {
					data : [
						{
							data : "tenTransaction",
							text : "Last 10 Transactions"
						},
						{
							data : "iHaveTransctionId",
							text : "I have Transaction ID"
						}
					]
				}
			}
		}
		resolve(model);
	})
}

function lastTenTransactions(model){
	return new Promise((resolve,reject)=>{
		console.log("--------------lastTenTransactions pre---------")
		console.log(model)
		if(model.tags.multipleTx == 1){
			model.reply = {
				type : "generic",
				text : "Here you go, you can select one by one and know its details along with the status.",
				next : {
					data : model.tags.transactions
				}
			}
			model.tags.multipleTx = undefined
		}
		else if(model.tags.txNotFound == 1){
			model.reply = {
				type : "generic",
				text : "Oh no. This does not match to any of your transaction reference ID (s). But don’t worry find below the list of the previous transactions, you can choose from it.",
				next : {
					data : model.tags.transactions
				}
			}
			model.tags.txNotFound = undefined
		}
		else{
			model.reply = {
				type : "generic",
				text : "Here you go, you can select one by one and know its details along with the status.",
				next : {
					data : model.tags.transactions
				}
			}
		}
		
		return resolve(model)
	})
}

function transactionID(model){
	return new Promise((resolve,reject)=>{
		console.log("-------------------------txid1-----------")
		let reply
		if(model.tags.txResObj.AMOUNT == "null" || model.tags.txResObj.AMOUNT == null){
			reply = "Let me give you a brief of Transaction "+model.tags.txResObj.ReferenceID+" for scheme "+model.tags.txResObj.SchemeName+", "+model.tags.txResObj.DivOpt+" - "+model.tags.txResObj.TransactionType+". You have purchased "+model.tags.txResObj.UNITS+" units and your status is "+model.tags.txResObj.TransactionStatus+" which was processed on "+model.tags.txResObj.ProcessDate+". "
		}
		else if(model.tags.txResObj.UNITS == "null" || model.tags.txResObj.UNITS == null){
			reply = "Let me give you a brief of Transaction "+model.tags.txResObj.ReferenceID+" for scheme "+model.tags.txResObj.SchemeName+", "+model.tags.txResObj.DivOpt+" - "+model.tags.txResObj.TransactionType+". You have purchased for a total of Rs "+model.tags.txResObj.AMOUNT+", your status is "+model.tags.txResObj.TransactionStatus+" which was processed on "+model.tags.txResObj.ProcessDate+". "
		}
		else{
			reply = "Let me give you a brief of Transaction "+model.tags.txResObj.ReferenceID+" for scheme "+model.tags.txResObj.SchemeName+", "+model.tags.txResObj.DivOpt+" - "+model.tags.txResObj.TransactionType+". You have purchased "+model.tags.txResObj.UNITS+" units for a total of Rs "+model.tags.txResObj.AMOUNT+", your status is "+model.tags.txResObj.TransactionStatus+" which was processed on "+model.tags.txResObj.ProcessDate+". "
		}
		model.reply = {
			type : "text",
			text : reply
		}
		resolve(model)
	})
}

// function transactionIDTwo(model){
// 	return new Promise((resolve,reject)=>{
// 		console.log("-------------------------txid1-----------")
// 		api.getTransactionDetails(model.tags.ip, model.tags.session,model.tags.transactionId).then((data)=>{
// 		data.body = JSON.parse(data.body)
// 		console.log(data.body.Response.length)
// 		if(data.body.Response[0].ProcessDate != null){
//     		data.body.Response[0].ProcessDate = dateTimeFormat(data.body.Response[0].ProcessDate)
// 		}
// 		if(data.body.Response.length > 0){
// 			model.reply = {
// 				type : "text",
// 				text : "Let me give you a brief of Transaction "+data.body.Response[0].ReferenceID+" for scheme "+data.body.Response[0].SchemeName+", "+data.body.Response[0].DivOpt+" - "+data.body.Response[0].TransactionType+". You have purchased "+data.body.Response[0].UNITS+" units for a total of Rs "+data.body.Response[0].AMOUNT+", your status is "+data.body.Response[0].TransactionStatus+" which was processed on "+data.body.Response[0].ProcessDate+". "
// 			}
// 			resolve(model)
// 		}
// 		})
// 		.catch((e)=>{
// 			console.log(e)
// 		})
// 	})
// }

function extractFolio(model){
	if(model.tags.userSays.match(regexFolio)){

		model.tags.folio = model.tags.userSays.match(regexFolio)[0].match(/\d+|new folio/)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.folio, '')
		model.tags.newFolio=true;
	}
	return model;
}

function extractAmount(model){
	if(model.tags.userSays.includes(',')){
		while(model.tags.userSays.includes(','))
    		model.tags.userSays = model.tags.userSays.replace(',', '')
	}
}

function extractFolio(model){
	if(model.tags.userSays.match(regexFolio)){

		model.tags.folio = model.tags.userSays.match(regexFolio)[0].match(/\d+|new folio/)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.folio, '')
		model.tags.newFolio=true;
	}
	return model;
}

function extractAmount(model){
	if(model.tags.userSays.includes(',')){
		while(model.tags.userSays.includes(','))
    		model.tags.userSays = model.tags.userSays.replace(',', '')
	}
	if(model.tags.userSays.match(/\d+\s*k/)){
		let a = model.tags.userSays
   		a = a.match(/\d+\s*k/)[0].replace(/\s+/, '').replace('k', '000')
   		model.tags.userSays = model.tags.userSays.replace(/\d+\s*k/, a)
	}
    if(model.tags.userSays.match(/\d+(\s*)?(lakhs|lakh|lacs|l)/)){
    	let a = model.tags.userSays
		a = a.match(/\d+\s*(lakhs|lakh|lacs|l)/)[0].replace(/\s+/, '').replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
    	model.tags.userSays = model.tags.userSays.replace(/\d+\s*(lakhs|lakh|lacs|l)/, a)
    }
	let text = matchAll(model.tags.userSays, /(\d+)/gi).toArray()
	for(let i in text){
		if(text[i].length < 8){
   			model.tags.newAmount=true;
			model.tags.amount = text[i]
			model.tags.userSays = model.tags.userSays.replace(model.tags.amount, '')
			break;
		}
	}
	return model;
}

function extractMobile(model){
	let text = matchAll(model.tags.userSays, /(\d+)/gi).toArray()
	for(let i in text){
		if(text[i].length == 10){
			// if(text[i]!=model.tags.mobile||model.tags.mobile===undefined){
			// 	console.log(text[i]+"mobile")
			// 	model.tags = {userSays:model.tags.userSays}
			// }
			// model.tags.mobileEntered=true;
			model.tags.mobile = text[i]
			model.tags.userSays = model.tags.userSays.replace(model.tags.mobile, '')
			break;
		}
		else if(text[i].length == 11&&text[i].startsWith("0")){
			model.tags.mobile = text[i].substring(1, 11)
			model.tags.userSays = model.tags.userSays.replace(model.tags.mobile, '')
			// console.log(model.tags.mobile+"mobile")
			break;
		}
		else if(text[i].length == 12&&text[i].startsWith("91")){
			model.tags.mobile = text[i].substring(2, 12)
			model.tags.userSays = model.tags.userSays.replace(model.tags.mobile, '')
			// console.log(model.tags.mobile+"mobile")
			break;
		}
	}
	return model;
}

function extractPan(model){
	let matchPan=model.tags.userSays.match(regexPan)
	if(matchPan&&matchPan.length>0&&matchPan[0]){
		if(matchPan[0]!=model.tags.pan||model.tags.pan===undefined){
			model.tags = {userSays:model.tags.userSays}
		}
		model.tags.pan = matchPan[0]
		model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
	}
	return model;
}

function dataClean(model){
	console.log(model.tags.userSays)
	if(model.tags.userSays){
		model.tags.userSays = model.tags.userSays.toLowerCase()
	}
    return model;
}

function dateTimeFormat(dateTimeValue) {
	if(dateTimeValue == null){
		return dateTimeValue = "-"
	}
    var dt = new Date(parseInt(dateTimeValue.replace(/(^.*\()|([+-].*$)/g, '')));
    var dateTimeFormat = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    console.log(dateTimeFormat)
    return dateTimeFormat;
}
