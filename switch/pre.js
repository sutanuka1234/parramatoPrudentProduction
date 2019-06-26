'use strict'
module.exports={
	main:main
}

let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')

let obj = {
	panMobile : panMobile,
	otp 	: otp,
	holding : holding,
	scheme 	: scheme,
	//askSchemeName:askSchemeName,
	showSchemeName:showSchemeName,
	agreement:agreement,
	euin	: euin,
	divOps:divOps,
	unitOrAmount:unitOrAmount,
	amount:amount,
	confirm	: confirm,
	summary:summary
}

let regexPan   	= /[a-z]{3}p[a-z]\d{4}[a-z]|[a-z]{3}h[a-z]\d{4}[a-z]/;
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
			if(!model.tags) {
			model.tags = {}
		}
		if(model.tags.notme) {
			model.tags = {}
		}
		model.tags.amount = false
		model.tags.joinAccId = false
		model.tags.otp=false
		model.tags.resend=false
		model.tags.tranId=false
		model.tags.switchSchemeList=false
		model.tags.switchReferenceId=false
		model.tags.refrenceIdSwitchTxn=false
		model.tags.schemes=false;
		model.tags.paymentDone="false";
		model=dataClean(model)
		if(model.tags.userSays){
			model=extractPan(model)
			model=extractMobile(model)
			// model=extractAmount(model)
		}
		if(model.tags.mobile || model.tags.pan){
			model.reply={
				type:"quickReply",
	            text:"Sure, we have your credentials linked to mobile "+formatter.apply(model.tags.mobile)+" saved. Would you like to proceed with the switch process?",
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
		return resolve(model)
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.tags.resend){
			model.tags.resend=false
			model.reply={
				type : "text",
				text : "The new OTP is sent to your mobile number ("+formatter.apply(model.tags.mobile)+"), Please share it here. In case if you have not received any OTP, we would send you one if you say 'resend'"
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
                data: model.tags.joinAccList
            }
		}
		resolve(model)
	})
}
function agreement(model){
	return new Promise(function(resolve,reject){
		model.reply={
				type:"button",
	            text:"In order to proceed, please read and agree to our and Fund House policies.Link "
					+model.tags.schemeApiDetails.OfferDocumentLink+" is the Offer Document.Link "
					+model.tags.schemeApiDetails.SchemeDocumentLink+" is the Scheme Document.Link "
					+model.tags.schemeApiDetails.AddInformationDocumentLink+" is Additional Information Document."
					+"Terms and Conditions would be "+model.tags.schemeApiDetails.TermsAndConditionDocumentLink,
	            next:{
	                data: [{
	                	text:"I accept and agree",
	                	data:"I accept and agree"
	                }]
	            }
			}
		return resolve(model);
	}) 
}
function scheme(model){
	return new Promise(function(resolve, reject){
			model.reply = {
				type:"generic",
	            text:"Following are the schemes you are invested in. Please choose one",
	            next:{ 
	            	data : model.tags.switchSchemeList
	            }
			}
			return resolve(model)
	})
}



function divOps(model){
	return new Promise(function(resolve, reject){
		model.reply={
			type:"quickReply",
            text:"Let us know the dividend option.",
            next:{
                data: [
                	{
                		data : 're invest',
                		text : 'Re Invest'
                	},
                	{
                		data : 'payout',
                		text : 'Payout'
                	}
                ]
            }
		}
		resolve(model)
	})
}



function askSchemeName(model){
	return new Promise(function(resolve, reject){
		if(!model.tags.schemes){
			model.reply={
				type:"text",
	            text:"Type in a scheme name",
			}
		}
		resolve(model)
	})
}

function showSchemeName(model){
	return new Promise(function(resolve, reject){
		if(model.tags.schemes!=false&&model.tags.schemes.length == 1){
			model.reply={
				type:"quickReply",
	            text:"Would you like to go ahead with "+model.tags.schemes+"? You can also type if there is something else on your mind.",
	            next:{
	                "data": [
	                	{
	                		data : "Yes",
	                		text : "Yes"
	                	}
	                ]
	            }
			}
		}
		else{
			model.reply = {
				type:"generic",
	            text:"Choose amongst the closest schemes, or type if you wish to invest in a different scheme.",
	            next:{ 
	            	data : model.tags.schemeList
	            }
			}
		}
		resolve(model)
	})
}

function euin(model){
	return new Promise(function(resolve, reject){
		if(model.tags.euinApiDetailsList){
			model.reply={
				type:"generic",
	            text:"Can you please let us know the investment mode. You can choose direct or through your advisor (advisor codes available below)",
	            next:{
	                data: model.tags.euinApiDetailsList
	            }
			}
		}
		resolve(model)
	});

}

function folio(model){
	return new Promise(function(resolve, reject){
		if(model.tags.folioList){
			model.reply={
				type:"quickReply",
	            text:"Let us know the folio you wish to invest in.",
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

function unitOrAmount(model){
	return new Promise(function(resolve, reject){
		console.log(model.tags.unitOrAmountList)
		if(model.tags.unitOrAmountList){
			model.reply={
				type:"quickReply",
	            text:"How would you like to switch?",
	            next:{
	            	data:model.tags.unitOrAmountList
	            }
			}
		}
		resolve(model)
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		if(model.tags.unitOrAmount=="PU"){
			model.reply={
				type:"text",
	            text:"Tell me the number of units you want to switch, it should be greater than or equal to "+model.tags.schemeApiDetails["MinSwitchUnits"]
			}
		}
		else{
			model.reply={
				type:"text",
	            text:"Tell me the amount you want to switch, it should be greater than or equal to Rs "+model.tags.schemeApiDetails["MinSwitchAmount"]+" and in multiple of Rs "+model.tags.schemeApiDetails["SwitchMultipleAmount"]
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
			amount+=model.tags.switchSchemeObj["AvailableUnits"]+" units (All units)"
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
            text:model.tags.investorName+", you are about to switch "+amount+" from "+model.tags.switchSchemeObj["SchemeName"]+" to "+model.tags.scheme+divOpt+" with folio "+model.tags.folio+". Do you confirm this transaction?",
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

function summary(model){
	return new Promise(function(resolve, reject){
		console.log(JSON.stringify(model.tags,null,3))
		if(model.tags.switchReferenceId){
			model.reply={
				type:"quickReply",
	            text:"Thanks, your reference id is "+model.tags.switchReferenceId+". What would you like to do next?",
	            next:{
	                data: [
	                	{
	                		data : "Invest now",
	                		text : "Invest now"
	                	},
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
	                	}
	                ]
	            }
			}
		}
		else{
			model.reply={
				type:"quickReply",
	            text:"Could not proceed with the switch with given details. However you can try again or go ahead with the following,",
	            next:{
	                data: [
	                	{
	                		data : "Talk to customer care",
	                		text : "Talk to customer care"
	                	},
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
	                	}
	                ]
	            }
			}
		}
		return resolve(model)
	})
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
			// if(text[i]!=model.tags.mobile||model.tags.mobile===false){
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
		if(matchPan[0]!=model.tags.pan||model.tags.pan===false){
			model.tags = {userSays:model.tags.userSays}
		}
		model.tags.pan = matchPan[0]
		model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
	}
	return model;
}
function extractDivOption(model){
	if(model.tags.userSays.match(divOption)){
		model.tags.divOption = model.tags.userSays.match(divOption)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.divOption, '')
		model.tags.newDivOption=true;
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