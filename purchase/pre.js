'use strict'
module.exports={
	main:main
}

let schemes = require('../schemes.js')
let data = require('../data.js')
let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')

let obj = {
	panMobile : panMobile,
	otp 	: otp,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps,
	amount 	: amount,
	holding : holding,
	euin	: euin,
	folio 	: folio,
	sipDay	: sipDay,
	bankMandate : bankMandate,
	summary : summary
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
		model.tags.divOption = undefined
		model.tags.otp=undefined
		model.tags.schemeApiDetails=undefined
		model.tags.resend=undefined
		model.tags.tranId=undefined
		model.tags.investmentType=undefined
		model.tags.transactionRefId=undefined
		model.tags.additional=false;
		model=dataClean(model)
		if(model.tags.userSays){
			model=extractPan(model)
			model=extractMobile(model)
			model=extractInvestmentType(model)
			// model=extractDivOption(model)
			model=extractSchemeName(model)
			model=extractAmount(model)
			// model=extractFolio(model)
			console.log(model.tags.investmentType+":Type of investment")
		}
		let invType=""
		if(model.tags.investmentType){
			invType=model.tags.investmentType
		}
		if(model.tags.mobile || model.tags.pan){
			model.reply={
				type:"quickReply",
	            text:"Sure, we have your credentials linked to mobile "+formatter.apply(model.tags.mobile)+" saved. Would you like to proceed with the "+invType+" investment?",
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
		if(model.tags.schemes.length == 1){
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
	            text:"Choose among the closest schemes, or type if you wish to invest in a different scheme.",
	            next:{ 
	            	data : model.tags.schemeList
	            }
			}
		}
		resolve(model)
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

function amount(model){
	return new Promise(function(resolve, reject){

		model.reply={
			type:"text",
            text:"Tell me the amount you want to invest, it should be greater or equal to Rs "+model.tags.schemeApiDetails["MinimumInvestment"]+" and less than or equal to Rs "+model.tags.schemeApiDetails["MaximumInvestment"] +" and in the multiples of "+model.tags.schemeApiDetails["Multiples"] 
		}
		resolve(model)
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccList){
			model.reply={
				type:"generic",
	            text:" Please select your holding pattern",
	            next:{
	                data: model.tags.joinAccList
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
				type:"quickReply",
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
	                data: model.tags.folioList
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

function sipDay(model){
	return new Promise(function(resolve, reject){
		model.reply={
			type:"text",
            text:"Which day of the month would you like to invest?"
           
		}
		if(model.tags.schemeApiDetails["SIPDays"]==="ALL"){
			model.reply.text+=" Any day between 1-28 works.";
		}
		else{
			model.reply.text+=" Days "+model.tags.schemeApiDetails["SIPDays"]+" would be fine.";
		}
		resolve(model)
	})
}
function bankMandate(model){
	return new Promise(function(resolve, reject){
		model.reply={
			type:"generic",
            text:"Investing Rs "+model.tags.amount+". Please select the bank for payment",
            next:{
                "data": model.tags.bankMandateList
            }
		}
		resolve(model)
	})
}

function summary(model){
	return new Promise(function(resolve, reject){
		if(model.tags.transactionRefId){
			model.reply={
				type : 'quickReply',
				text : 'We have gone ahead with '+model.tags.investmentType+' of '+model.tags.scheme+' with '+model.tags.folio+', investing Rs '+model.tags.amount+'. Reference ID would be '+model.tags.transactionRefId+'. Status of transaction is '+model.tags.status+". What would you like to do next?",
	            next:{
	                data: [
	                	{
	                		data : "Invest now",
	                		text : "Invest now"
	                	},
	                	{
	                		data : "Redeem now",
	                		text : "Redeem now"
	                	},
	                	{
	                		data : "Switch now",
	                		text : "Switch now"
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
				type : 'quickReply',
				text : 'We cannot go ahead with the investment with given details. However you can try again or go ahead with the following.',
	            next:{
	                data: [
	                	{
	                		data : "Talk to agent",
	                		text : "Talk to agent"
	                	},
	                	{
	                		data : "Invest now",
	                		text : "Invest now"
	                	},
	                	{
	                		data : "Redeem now",
	                		text : "Redeem now"
	                	},
	                	{
	                		data : "Switch now",
	                		text : "Switch now"
	                	},
	                	{
	                		data : "FAQs",
	                		text : "FAQs"
	                	}
	                ]
	            }
			}
		}
		model.tags.amount = undefined
		model.tags.joinAccId = undefined
		model.tags.divOption = undefined
		model.tags.otp=undefined
		model.tags.schemeApiDetails=undefined
		resolve(model)
	})
}

function extractDivOption(model){
	if(model.tags.userSays.match(divOption)){
		model.tags.divOption = model.tags.userSays.match(divOption)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.divOption, '')
		model.tags.newDivOption=true;
	}
	return model;
			
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


function extractInvestmentType(model){
	if(model.tags.userSays.toLowerCase().includes("lumpsum")||model.tags.userSays.toLowerCase().includes("one time")){
			model.tags.userSays=model.tags.userSays.replace("lumpsum","")
			model.tags.userSays = model.tags.userSays.replace("one time","")
			model.tags.investmentType="lumpsum"
			model.tags.newInvestmentType=true;
	}
	else if(model.tags.userSays.toLowerCase().includes("sip")||model.tags.userSays.toLowerCase().includes("systematic")||model.tags.userSays.toLowerCase().includes("monthly")){
			model.tags.userSays=model.tags.userSays.replace("sip","")
			model.tags.userSays = model.tags.userSays.replace("systematic","")
			model.tags.userSays = model.tags.userSays.replace("monthly","")
			model.tags.investmentType="sip"
			model.tags.newInvestmentType=true;
	}
	return model;
}

function extractSchemeName(model){
		let wordsInUserSays=model.tags.userSays.split(" ");
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
			startIndex=amcIndex
		}
		if(count>0){
			let searchTerm=""
			for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
				searchTerm+=wordsInUserSays[i]+" "
			}
			searchTerm=searchTerm.trim();
			console.log(searchTerm)
			let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
			if(matches.bestMatch.rating>0.9){
				model.tags.schemes = []
				model.tags.schemes.push(matches.bestMatch.target)
				model.tags.newScheme=true;
			}
			else if(matches.bestMatch.rating>0.4){
				model.tags.schemes = []
				matches.ratings=matches.ratings.sort(sortBy('-rating'));
				model.tags.schemes = matches.ratings.splice(0,9);
				model.tags.newScheme=true;
			}
			console.log("MATCHHH")
			// console.log(matches)
		}
		return model;
}

function dataClean(model){
	// console.log(model.tags.userSays)
	if(model.tags.userSays){
		model.tags.userSays = model.tags.userSays.toLowerCase()
	}
    return model;
}