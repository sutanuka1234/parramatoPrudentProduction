'use strict'
module.exports={
	main:main
}

var schemes = require('../schemes.js')
var data = require('../data.js')
var words = require('../words.js')
var stringSimilarity = require('string-similarity');
var sortBy = require('sort-by')
var matchAll = require('match-all')

let obj = {
	panMobile : panMobile,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps,
	amount 	: amount,
	holding : holding,
	folio 	: folio,
	buyCart : buyCart,
	mandate : mandate
}

var regexPan   	= /[a-z]{3}p[a-z]\d{4}[a-z]/;
var regexMobile = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/;
var regexAmount	= /(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{2}(k|l)|\d{1}(k|l))/
var schemeType 	= /dividend|growth/
var divOption 	= /re(-|\s)?invest|pay(\s)?out/
var regexFolio 	= /i?\s*(have|my)?\s*a?\s*folio\s*(n(umber|um|o)?)?\s*(is|=|:)?\s*(\d+|new folio)/
var schemeNames = Object.keys(data)
var amc = [  
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
	return new Promise(function(resolve, reject){
		console.log(req.params.stage)
		obj[req.params.stage](req.body)
		.then((data)=>{
			res.send(data)
		})
		.catch((e)=>{
			console.log(e)
			res.sendStatus(203)
		})
	})
}

function panMobile(model){
	return new Promise(function(resolve, reject){
		model=dataClean(model)
		model=extractPan(model)
		model=extractMobile(model)
		model=extractAmount(model)
		model=extractDivOption(model)
		model=extractFolio(model)
		model=extractSchemeName(model)
		if(model.tags.mobile && model.tags.pan){
			model.reply={
				type:"quickReply",
	            text:"Go ahead with OTP?",
	            next:{
	                "data": [
	                	{
	                		data : 'Proceed',
	                		text : 'Proceed'
	                	}
	                ]
	            }
			}
			resolve(model)
		}
		// else if(model.tags.mobile){
		// 	model.reply={
		// 		type : "text",
		// 		text : "Also enter the PAN"
		// 	}
		// 	resolve(model)
		// }
		// else if(model.tags.pan){
		// 	model.reply={
		// 		type : "text",
		// 		text : "Also enter the mobile number"
		// 	}
		// 	resolve(model)
		// }
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
		if(model.tags.schemes.length == 1){
			model.reply={
				type:"quickReply",
	            text:"Would you like to go ahead with "+model.tags.schemes+"? You can also type if there is something else in your mind.",
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
	            text:"Please select a scheme or type in one of your choice",
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
            text:"Select an type",
            next:{
                "data": [
                	{
                		data : 'reinvest',
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
		if(model.tags.amount){
			model.reply={
				type:"text",
	            text:"Amount Invalid. Enter an amount"
			}
		}
		else{
			model.reply={
				type:"text",
	            text:"Enter an amount"
	        }
		}
		resolve(model)
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccList){
			model.reply={
				type:"generic",
	            text:"Select an account",
	            next:{
	                "data": model.tags.joinAccList
	            }
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
	            text:"Select a folio number",
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

function buyCart(model){
	return new Promise(function(resolve, reject){
		model.reply={
			type:"generic",
            text:"Select a bank account",
            next:{
                "data": model.tags.bankMandateList
            }
		}
		resolve(model)
	})
}

function mandate(model){
	return new Promise(function(resolve, reject){
		if(model.tags.paymentSummary){
			model.reply={
				type : 'text',
				text : 'Scheme Name : '+model.tags.paymentSummary.SchemeName+'. Folio : '+model.tags.paymentSummary.FolioNo+'. Amount : '+model.tags.paymentSummary.Amount+'. Bank : '+model.tags.paymentSummary.BankName+'. Reference ID : '+model.tags.paymentSummary.ReferenceID+'. Status : '+model.tags.paymentSummary.STATUS+'.'
			}
		}
		resolve(model)
	})
}

function extractDivOption(model){
	if(model.tags.userSays.match(divOption)){
		model.tags.divOption = model.tags.userSays.match(divOption)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.divOption, '')
	}
	return model;
			
}

function extractFolio(model){
	if(model.tags.userSays.match(regexFolio)){

		model.tags.folio = model.tags.userSays.match(regexFolio)[0].match(/\d+|new folio/)[0]
		model.tags.userSays = model.tags.userSays.replace(model.tags.folio, '')
	}
	return model;
}
function extractAmount(model){
	let text = matchAll(model.tags.userSays, /(\d+)/gi).toArray()
	for(let i in text){
		if(text[i].length < 8){
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
			model.tags.mobile = text[i]
			model.tags.userSays = model.tags.userSays.replace(model.tags.mobile, '')
			break;
		}
	}
	return model;
}

function extractPan(model){
	var matchPan=model.tags.userSays.match(regexPan)
	if(matchPan){
		model.tags.pan = matchPan[0]
		model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
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
			model.tags.schemes = []
			let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
			if(matches.bestMatch.rating>0.9){
				model.tags.schemes.push(matches.bestMatch.target)
			}
			else{
				matches.ratings=matches.ratings.sort(sortBy('-rating'));
				model.tags.schemes = matches.ratings.splice(0,9);
			}
		}
		return model;
}

function dataClean(model){
	console.log(model.tags.userSays)
	if(model.tags.userSays){
		model.tags.userSays = model.tags.userSays.toLowerCase()
	}
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
    return model;
}