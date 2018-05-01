'use strict'
module.exports={
	main:main
}

var schemes = require('../new.json')
var words = require('../words.js')
var stringSimilarity = require('string-similarity');
var sortBy = require('sort-by')
let obj = {
	panMobile : panMobile,
	mobile	: mobile,
	pan		: pan,
	otp		: otp,
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
var schemeNames = Object.keys(schemes)

function main(req, res){
	return new Promise(function(resolve, reject){
		console.log(req.url.split('/')[3])
		obj[req.url.split('/')[3]](req.body)
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
		//pan,mobile,amount,amc,scheme,option,payout,tentativeFolio
		model.tags.userSays=model.tags.userSays.toLowerCase();
		if(model.tags.userSays.includes(',')){
			while(model.tags.userSays.includes(','))
	    		model.tags.userSays = model.tags.userSays.replace(',', '')
		}
		if(model.tags.userSays.match(/\d+\s*k/)){
			console.log(model.tags.userSays.match(/\d+\s*k/)[0])
	       	model.tags.userSays = model.tags.userSays.match(/\d+\s*k/)[0].replace(/\d+\s*k/, '000')
	    }
	    if(model.tags.userSays.match(/\d+\s*(lakhs|lakh|lacs|l)/)){
	    	model.tags.userSays = model.tags.userSays.match(/\d+\s*(lakhs|lakh|lacs|l)/)[0].replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000')
	    }
		console.log(model.tags.userSays)
		var matchPan=model.tags.userSays.match(regexPan)
		if(matchPan){
			model.tags.pan = matchPan[0]
			model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
		}
		var matchMobile=model.tags.userSays.match(regexMobile)
		if(model.tags.userSays.match(/\d+/) && model.tags.userSays.match(/\d+/)[0].length == 10 && matchMobile){			
			model.tags.mobile = matchMobile[0]
			model.tags.userSays=model.tags.userSays.replace(model.tags.mobile, '')
		}
		var matchAmount=model.tags.userSays.match(regexAmount)
		if(matchAmount){
			model.tags.amount = matchAmount[0]
			model.tags.userSays=model.tags.userSays.replace(model.tags.amount, '')
		}
		var matchDivOption=model.tags.userSays.match(divOption)
		if(matchDivOption){
			model.tags.divOption=matchDivOption[0]
			model.tags.userSays=model.tags.userSays.replace(model.tags.divOption, '')
		}
		var matchFolio=model.tags.userSays.match(regexFolio)
		if(matchFolio){
			model.tags.folio = matchFolio[0].match(/\d+|new folio/)[0]
			model.tags.userSays=model.tags.userSays.replace(matchFolio, '')
		}
		let wordsInUserSays=model.tags.userSays.split(" ");
		let count=0;
		let startIndex;
		let endIndex;
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
				model.tags.schemes.push(bestMatch)
			}
			else{
				matches.ratings=matches.ratings.sort(sortBy('-rating'));
				model.tags.schemes = matches.ratings.splice(0,9);
			}
		}
		var matchType=model.tags.userSays.match(schemeType)
		if(matchType){
			model.tags.schemeType = matchType[0]
			model.tags.userSays=model.tags.userSays.replace(model.tags.schemeType, '')
		}
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
		else if(model.tags.mobile){
			model.reply={
				type : "text",
				text : "Also enter the PAN"
			}
			resolve(model)
		}
		else if(model.tags.pan){
			model.reply={
				type : "text",
				text : "Also enter the mobile number"
			}
			resolve(model)
		}
		resolve(model)
	})
}

function mobile(model){
	return new Promise(function(resolve, reject){
		//mobile,amount,amc,scheme,option,payout,tentativeFolio
		// model.tags.userSays=model.tags.userSays.toLowerCase();
		// if(model.tags.userSays.includes(',')){
		// 	while(model.tags.userSays.includes(','))
	 //    		model.tags.userSays = model.tags.userSays.replace(',', '')
		// }
		// if(model.tags.userSays.match(/\d+(\s*)?(k|K)/)){
	 //       	model.tags.userSays = model.tags.userSays.replace('k', '000').replace('K', '000')
	 //    }
		// var matchPan=model.tags.userSays.match(regexPan)
		// if(matchPan){
		// 	model.tags.pan = matchPan[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
		// }
		// var matchMobile=model.tags.userSays.match(regexMobile)
		// if(model.tags.userSays.match(/\d+/) && model.tags.userSays.match(/\d+/)[0].length == 10 && matchMobile){			
		// 	model.tags.mobile = matchMobile[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.mobile, '')
		// }
		// var matchAmount=model.tags.userSays.match(regexAmount)
		// if(matchAmount){
		// 	model.tags.amount = matchAmount[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.amount, '')
		// }
		// var matchDivOption=model.tags.userSays.match(divOption)
		// if(matchDivOption){
		// 	model.tags.divOption=matchDivOption[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.divOption, '')
		// }
		// var matchFolio=model.tags.userSays.match(regexFolio)
		// if(matchFolio){
		// 	model.tags.folio = matchFolio[0].match(/\d+|new folio/)[0]
		// 	model.tags.userSays=model.tags.userSays.replace(matchFolio, '')
		// }
		// let wordsInUserSays=model.tags.userSays.split(" ");
		// let count=0;
		// let startIndex;
		// let endIndex;
		// for(let wordIndex in wordsInUserSays){
		// 	if(words.includes(wordsInUserSays[wordIndex])){
		// 		count++;
		// 		if(count==1){
		// 			startIndex=wordIndex;
		// 			endIndex=wordIndex;
		// 		}
		// 		else{
		// 			endIndex=wordIndex;
		// 		}
		// 	}
		// }
		// if(count>0){
		// 	let searchTerm=""
		// 	for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
		// 		searchTerm+=wordsInUserSays[i]+" "
		// 	}
		// 	searchTerm=searchTerm.trim();
		// 	model.tags.schemes = []
		// 	let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
		// 	if(matches.bestMatch.rating>0.9){
		// 		model.tags.schemes.push(bestMatch)
		// 	}
		// 	else{
		// 		matches.ratings=matches.ratings.sort(sortBy('-rating'));
		// 		model.tags.schemes = matches.ratings.splice(0,9);
		// 	}
		// }
		// var matchType=model.tags.userSays.match(schemeType)
		// if(matchType){
		// 	model.tags.schemeType = matchType[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.schemeType, '')
		// }
		resolve(model)
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		//pan,amount,amc,scheme,option,payout,tentativeFolio
		// model.tags.userSays=model.tags.userSays.toLowerCase();
		// if(model.tags.userSays.includes(',')){
		// 	while(model.tags.userSays.includes(','))
	 //    		model.tags.userSays = model.tags.userSays.replace(',', '')
		// }
		// if(model.tags.userSays.match(/\d+(\s*)?(k|K)/)){
	 //       	model.tags.userSays = model.tags.userSays.replace('k', '000').replace('K', '000')
	 //    }
		// var matchPan=model.tags.userSays.match(regexPan)
		// if(matchPan){
		// 	model.tags.pan = matchPan[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.pan, '')
		// }
		// var matchMobile=model.tags.userSays.match(regexMobile)
		// if(model.tags.userSays.match(/\d+/) && model.tags.userSays.match(/\d+/)[0].length == 10 && matchMobile){			
		// 	model.tags.mobile = matchMobile[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.mobile, '')
		// }
		// var matchAmount=model.tags.userSays.match(regexAmount)
		// if(matchAmount){
		// 	model.tags.amount = matchAmount[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.amount, '')
		// }
		// var matchDivOption=model.tags.userSays.match(divOption)
		// if(matchDivOption){
		// 	model.tags.divOption=matchDivOption[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.divOption, '')
		// }
		// var matchFolio=model.tags.userSays.match(regexFolio)
		// if(matchFolio){
		// 	model.tags.folio = matchFolio[0].match(/\d+|new folio/)[0]
		// 	model.tags.userSays=model.tags.userSays.replace(matchFolio, '')
		// }
		// let wordsInUserSays=model.tags.userSays.split(" ");
		// let count=0;
		// let startIndex;
		// let endIndex;
		// for(let wordIndex in wordsInUserSays){
		// 	if(words.includes(wordsInUserSays[wordIndex])){
		// 		count++;
		// 		if(count==1){
		// 			startIndex=wordIndex;
		// 			endIndex=wordIndex;
		// 		}
		// 		else{
		// 			endIndex=wordIndex;
		// 		}
		// 	}
		// }
		// if(count>0){
		// 	let searchTerm=""
		// 	for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
		// 		searchTerm+=wordsInUserSays[i]+" "
		// 	}
		// 	searchTerm=searchTerm.trim();
		// 	model.tags.schemes = []
		// 	let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
		// 	if(matches.bestMatch.rating>0.9){
		// 		model.tags.schemes.push(bestMatch)
		// 	}
		// 	else{
		// 		matches.ratings=matches.ratings.sort(sortBy('-rating'));
		// 		model.tags.schemes = matches.ratings.splice(0,9);
		// 	}
		// }
		// var matchType=model.tags.userSays.match(schemeType)
		// if(matchType){
		// 	model.tags.schemeType = matchType[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.schemeType, '')
		// }
		resolve(model)
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		//amount,amc,scheme,option,payout,tentativeFolio
		// model.tags.userSays=model.tags.userSays.toLowerCase();
		// if(model.tags.userSays.includes(',')){
		// 	while(model.tags.userSays.includes(','))
	 //    		model.tags.userSays = model.tags.userSays.replace(',', '')
		// }
		// if(model.tags.userSays.match(/\d+(\s*)?(k|K)/)){
	 //       	model.tags.userSays = model.tags.userSays.replace('k', '000').replace('K', '000')
	 //    }
		// var matchAmount=model.tags.userSays.match(regexAmount)
		// if(matchAmount){
		// 	model.tags.amount = matchAmount[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.amount, '')
		// }
		// var matchDivOption=model.tags.userSays.match(divOption)
		// if(matchDivOption){
		// 	model.tags.divOption=matchDivOption[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.divOption, '')
		// }
		// var matchFolio=model.tags.userSays.match(regexFolio)
		// if(matchFolio){
		// 	model.tags.folio = matchFolio[0].match(/\d+|new folio/)[0]
		// 	model.tags.userSays=model.tags.userSays.replace(matchFolio, '')
		// }
		// let wordsInUserSays=model.tags.userSays.split(" ");
		// let count=0;
		// let startIndex;
		// let endIndex;
		// for(let wordIndex in wordsInUserSays){
		// 	if(words.includes(wordsInUserSays[wordIndex])){
		// 		count++;
		// 		if(count==1){
		// 			startIndex=wordIndex;
		// 			endIndex=wordIndex;
		// 		}
		// 		else{
		// 			endIndex=wordIndex;
		// 		}
		// 	}
		// }
		// if(count>0){
		// 	let searchTerm=""
		// 	for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
		// 		searchTerm+=wordsInUserSays[i]+" "
		// 	}
		// 	searchTerm=searchTerm.trim();
		// 	model.tags.schemes = []
		// 	let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
		// 	if(matches.bestMatch.rating>0.9){
		// 		model.tags.schemes.push(bestMatch)
		// 	}
		// 	else{
		// 		matches.ratings=matches.ratings.sort(sortBy('-rating'));
		// 		model.tags.schemes = matches.ratings.splice(0,9);
		// 	}
		// }
		// var matchType=model.tags.userSays.match(schemeType)
		// if(matchType){
		// 	model.tags.schemeType = matchType[0]
		// 	model.tags.userSays=model.tags.userSays.replace(model.tags.schemeType, '')
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
		model.reply = {
			type:"generic",
            text:"Please select a scheme or type in one of your choice",
            next:{ 
            	data : model.tags.schemeList
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
				type:"quickReply",
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
			type:"quickReply",
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
		resolve(model)
	})
}