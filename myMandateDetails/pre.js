'use strict'
module.exports={
	main:main
}

let data = require('../data.json')
let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')
var api = require('../api.js');

let obj = {
	panMobile 	: panMobile,
	otp 		: otp,
	nach 		: nach,
	nachDetails : nachDetails
}

let regexPan   	= /[a-z]{3}p[a-z]\d{4}[a-z]/;
let regexMobile = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/;
let regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/
let schemeType 	= /dividend|growth/
let divOption 	= /re(-|\s)?invest|pay(\s)?out/
let regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
let schemeNames = Object.keys(data)
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
	            text:"Sure, we have your credentials linked to mobile "+formatter.apply(model.tags.mobile)+" saved. Would you like to proceed with fetching nach mandate details?",
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

// function holding(model){
// 	return new Promise(function(resolve, reject){
// 		model.reply={
// 			type:"generic",
//             text:" Please select your holding pattern",
//             next:{
//                 data: model.tags.joinAccList
//             }
// 		}
// 		resolve(model)
// 	})
// }

function nach(model){
	return new Promise(function(resolve,reject){
		api.getMandateDetails(model.tags.ip, model.tags.session, model.tags.joinAccId).then((data)=>{
			let nachDetails = JSON.parse(data.body)
			console.log("----------------here----------------nach-----------")
			console.log(nachDetails.Response)
			console.log("Mandate Status: "+nachDetails.Response[0].MandateStatus)
			console.log(nachDetails.Response.length+"lllllllllength")
			model.tags.nachArray = []
			if(nachDetails.Response.length>=5){
				for(let i=0; i<5; i++){
					model.tags.nachArray.push({
						title 	: "Mandate Status: "+nachDetails.Response[i].MandateStatus ,
						text 	: "BankName:"+nachDetails.Response[i].BankName+". AccountNo:"+nachDetails.Response[i].AccountNo,
						image 	: '',
						buttons : [
							{
								data : nachDetails.Response[i].ReferenceNo+"/"+nachDetails.Response[i].DailyLimit+"/"+nachDetails.Response[i].MandateStatus+"/"+nachDetails.Response[i].AccountNo+"/"+nachDetails.Response[i].BankName,
								text : 'Select'
							}
						]
					})
				}
			}
			else{
				for(let i=0; i<nachDetails.Response.length; i++){
					model.tags.nachArray.push({
						title 	: "Mandate Status: "+nachDetails.Response[i].MandateStatus ,
						text 	: "BankName:"+nachDetails.Response[i].BankName+". AccountNo:"+nachDetails.Response[i].AccountNo,
						image 	: '',
						buttons : [
							{
								data : nachDetails.Response[i].ReferenceNo+"/"+nachDetails.Response[i].DailyLimit+"/"+nachDetails.Response[i].MandateStatus+"/"+nachDetails.Response[i].AccountNo+"/"+nachDetails.Response[i].BankName,
								text : 'Select'
							}
						]
					})
				}
			}
			model.reply = {
				type : "generic",
				text : "I have now fetched your Nach Mandate details, have a look",
				next : {
					data : model.tags.nachArray
				}
			}
			return resolve(model)
		})
		.catch((e)=>{
			console.log(e)
		})
	})
}

function nachDetails(model){
	return new Promise(function(resolve, reject){	
		model.reply = {
			type : 'text',
			text : "Let me brief you on your nach mandate status of "+model.tags.referenceNo+
			". Your daily limit is "+model.tags.dailyLimit+" and status is "+model.tags.mandateStatus+". This mandate is for Account number "+model.tags.accountNo+" linked to "+model.tags.bankName
		}
		return resolve(model)
	})
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