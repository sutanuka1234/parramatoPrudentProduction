'use strict'
module.exports={
	main:main
}

let data = require('../data.js')
let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')

let obj = {
	panMobile : panMobile,
	otp 	: otp,
	holding : holding,
	amount 	: amount,
	scheme 	: scheme,
	confirm	: confirm,
	summary	: summary
}

let regexPan   	= /[a-z]{3}p[a-z]\d{4}[a-z]|[a-z]{3}h[a-z]\d{4}[a-z]/;
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
// console.logeq.params.stage)
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
		model.tags.schemes=false;
		model.tags.paymentDone="false";
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
	            text:"Sure, we have your credentials linked to mobile "+formatter.apply(model.tags.mobile)+" saved. Would you like to proceed with the redemption process?",
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
// console.logodel.tags.schemes)
		return resolve(model)
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.tags.resend){
			model.tags.resend=undefined
			model.reply={
				type : "text",
				text : "The new OTP is sent to your mobile number ("+formatter.apply(model.tags.mobile)+"), Please share it here.In case if you have not received any OTP, we would send you one if you say 'resend'"
			}
		}
		else{
			model.reply={
				type : "text",
				text : "Kindly provide an OTP sent to your mobile number ("+formatter.apply(model.tags.mobile)+"), in case if you have not received any OTP type 'Resend'"
			}
		}
		return resolve(model)
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		model.reply={
			type:"generic",
            text:" Please select your holding pattern",
            next:{
                "data": model.tags.joinAccList
            }
		}
		resolve(model)
	})
}

function folio(model){
	return new Promise(function(resolve, reject){
		if(model.tags.folioList){
			model.reply={
				type:"quickReply",
	            text:"Let us know the folio you wish to redeem.",
	            next:{
	                "data": model.tags.folioList
	            }
			}
		}
		else if(model.tags.folioNo){
			model.reply={
				type:"quickReply",
	            text:"Proceed with folio number?",
	            next:{
	                "data": [
	                	{
	                		data : model.tags.folioNo,
	                		text : model.tags.folioNo
	                	}
	                ]
	            }
			}	
		}
		resolve(model)	
	})
}

function scheme(model){
	return new Promise(function(resolve, reject){
			model.reply = {
				type:"generic",
	            text:"Following are the schemes you are invested in. Please choose one",
	            next:{ 
	            	data : model.tags.redeemSchemeList
	            }
			}
			return resolve(model)
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		if(model.tags.unitOrAmount=="PU"){
			model.reply={
				type:"text",
	            text:"Tell me the number of units you want to redeem, it should be greater than or equal to "+model.tags.redeemSchemeObj["MinRedemptionUnits"]+" and less than or equal to "+model.tags.redeemSchemeObj["AvailableUnits"]
			}
		}
		else{
			model.reply={
				type:"text",
	            text:"Tell me the amount you want to redeem, it should be greater than or equal to Rs "+model.tags.redeemSchemeObj["MinRedemptionAmount"]+" and less than or equal to Rs "+model.tags.redeemSchemeObj["AvailableAmt"]+" and in the multiples of Rs "+model.tags.redeemSchemeObj["RedemptionMultipleAmount"]
			}

		}
		resolve(model)
	})
}



function confirm(model){
	return new Promise(function(resolve, reject){
		let amount=""
		if(model.tags.unitOrAmount=="PU"){
			amount+=model.tags.amount+" units"
		}
		else if(model.tags.unitOrAmount=="AU"){
			amount+=model.tags.redeemSchemeObj["AvailableUnits"]+" units (All units)"
		}
		else{
			amount+="Rs "+model.tags.amount
		}
		let divOpt=""
		if(model.tags.divOption==1){
			divOpt+=" re investment option"
		}
		if(model.tags.divOption==2){
			divOpt+=" payout option"
		}
			model.reply={
			type:"quickReply",
            text:model.tags.investorName+", you are about to redeem "+amount+" from "+model.tags.redeemSchemeObj["SCHEMENAME"]+divOpt+" with folio "+model.tags.folio+". Do you confirm this transaction?",
            next:{
                data: [
                	{
                		data : "Yes",
                		text : "Yes"
                	},
                	{
                		data : "Cancel",
                		text : "Cancel"
                	}
                ]
            }
		}
		resolve(model)
	})
}


// "MinRedemptionAmount": 5**,
//  "RedemptionMultipleAmount": 1**,
//  "MinRedemptionUnits": *,
//  "RedemptionMultiplesUnits": *,
//  "AvailableAmt": 2**.8*,
// 55
//  "AvailableUnits": 1*.1**,
//  "InccurExitLoad": f****,
//  "RedeemAmount": *

function summary(model){
	return new Promise(function(resolve, reject){
// console.logSON.stringify(model.tags,null,3))
		if(model.tags.redeemReferenceId){
			model.reply={
				type:"quickReply",
	            text:"Your redemption is processed and reference ID is "+model.tags.redeemReferenceId+". What would you like to do next?",
	            next:{
	                data: [
	                	{
	                		data : "Invest",
	                		text : "Invest"
	                	},
	                	{
	                		data : "Start SIP",
	                		text : "Start SIP"
	                	},
	                	{
	                		data : "Redeem",
	                		text : "Redeem"
	                	},
	                	{
	                		data : "Switch",
	                		text : "Switch"
	                	},
	                	
	                	{
	                		data : "STP",
	                		text : "STP"
	                	},
	                	{
	                		data : "FAQs",
	                		text : "FAQs"
	                	},
	                	{
	                        data : 'Transaction Details',
	                        text : 'Transaction Details'
	                    },
	                    {
	                        data : 'Get account statement',
	                        text : 'Get account statement'
	                    },
	                    {
	                        data : "Nach Mandate",
	                        text : 'Nach Mandate'
	                    },
	                    {
	                        data : "Talk to customer care",
	                        text : "Talk to customer care"
	                    }
	                ]
	            }
			}
		}
		else{
			model.reply={
				type:"quickReply",
	            text:"Could not proceed with the redemption with given details. However you can try again or go ahead with the following.",
	            next:{
	                data: [
	                	{
	                		data : "Invest",
	                		text : "Invest"
	                	},
	                	{
	                		data : "Start SIP",
	                		text : "Start SIP"
	                	},
	                	{
	                		data : "Redeem",
	                		text : "Redeem"
	                	},
	                	{
	                		data : "Switch",
	                		text : "Switch"
	                	},
	                	
	                	{
	                		data : "STP",
	                		text : "STP"
	                	},
	                	{
	                		data : "FAQs",
	                		text : "FAQs"
	                	},
	                	{
	                        data : 'Transaction Details',
	                        text : 'Transaction Details'
	                    },
	                    {
	                        data : 'Get account statement',
	                        text : 'Get account statement'
	                    },
	                    {
	                        data : "Nach Mandate",
	                        text : 'Nach Mandate'
	                    },
	                    {
	                        data : "Talk to customer care",
	                        text : "Talk to customer care"
	                    }
	                ]
	            }
			}
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
// console.logodel.tags.userSays)
	if(model.tags.userSays){
		model.tags.userSays = model.tags.userSays.toLowerCase()
	}
    return model;
}