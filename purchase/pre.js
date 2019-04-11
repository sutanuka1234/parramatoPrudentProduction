'use strict'
module.exports={
		main:main

}

	let obj = {
	panMobile : panMobile,
	
	otp		: otp,
	agreement	: agreement,
	investmentType :investmentType,
	askSchemeName : askSchemeName,
	showSchemeName : showSchemeName,
	divOps 	: divOps,
	amount 	: amount,
	holding : holding,
	//additional : additional,
	euin: euin , 
	folio 	: folio,
	sipDay	: sipDay,
	bankMandate : bankMandate
}

let fs = require('fs')
let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')
let data = require('../data.json')

let path = require("path");

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
	return new Promise(async function(resolve, reject){
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
		model.tags.schemes=false;
		model.tags.paymentDone="false";
		console.log(model)
		model=dataClean(model)
		if(model.tags.userSays){
			model=extractPan(model)
			model=extractMobile(model)
			model=extractInvestmentType(model)
			// model=extractDivOption(model)
			model=await extractSchemeName(model)
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
function investmentType(model) {
	console.log("INVESTMENT TYPE PRE")
	return new Promise(async function (resolve, reject) {
		try {

			
			
			model.reply = {
				type: "button",
				text: "Make a choice",
				next: {
					data: [
						{
							text: "*lumpsum* ",
							data: '1'
						},
						{
							text: "*SIP* ",
							data: '2'
						}
					]
				}
			}
			return resolve(model)

		} catch (e) {
			console.log(e)
			return reject(e)
		}
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
				text : "Kindly provide an OTP sent to your mobile number ("+formatter.apply(model.tags.mobile)+"), in case if you have not received any OTP type 'Resend'"
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
		if(model.tags.schemes&&model.tags.schemes.length == 1){
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

function initAmount(model){
	return new Promise(function(resolve, reject){

		model.reply={
			type:"text",
            text:"Tell me the amount you want to start with, it should be greater than or equal to Rs "+model.tags.schemeApiDetails["MinimumInvestment"]+" and less than or equal to Rs "+model.tags.schemeApiDetails["MaximumInvestment"] +" and in the multiples of "+model.tags.schemeApiDetails["Multiples"] 
		}
		resolve(model)
	})
}

function amount(model){
	return new Promise(function(resolve, reject){
		console.log(model.tags.schemeApiDetails)
		model.reply={
			type:"text",
            text:"Tell me the amount you want to invest, it should be greater than or equal to Rs "+model.tags.schemeApiDetails["MinimumInvestment"]+" and less than or equal to Rs "+model.tags.schemeApiDetails["MaximumInvestment"] +" and in the multiples of "+model.tags.schemeApiDetails["Multiples"] 
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

function agreement(model){
	return new Promise(function(resolve,reject){
		let doc;
		if(model.tags.additional){
			doc=model.tags.termsAdditional
		}
		else{
			doc=model.tags.schemeApiDetails
		}
		model.reply={
				type:"button",
	            text:"In order to proceed, please read and agree to our and Fund House policies.Link "
					+doc.OfferDocumentLink+" is the Offer Document.Link "
					+doc.SchemeDocumentLink+" is the Scheme Document.Link "
					+doc.AddInformationDocumentLink+" is Additional Information Document."
					+"Terms and Conditions would be "+doc.TermsAndConditionDocumentLink,
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

function euin(model){
	return new Promise(function(resolve, reject){
		if(model.tags.euinApiDetailsList){
			model.reply={
				type:"generic",
	            text:"Select whether fund selection is done by you or suggested by distributor. Is fund selection done yourself or suggested by distributor?",
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
            text:"Which date of the month would you like to invest?"
           
		}
		if(model.tags.schemeApiDetails["SIPDays"]==="ALL"){
			model.reply.text+=" Any day between 1-28 works.";
		}
		else{

			if(model.tags.schemeApiDetails["SIPDays"].includes(",")){
				model.reply.text+=" Days "+model.tags.schemeApiDetails["SIPDays"]+" would be fine.";
			}
			else{
				model.reply.text+=" Following days would work.";
				model.reply.type="quickReply"
				model.reply.next={
					"data": [
		                	{
		                		data : model.tags.schemeApiDetails["SIPDays"],
		                		text : model.tags.schemeApiDetails["SIPDays"]
		                	}
		                ]
				}
			}
			
		}
		resolve(model)
	})
}
function bankMandate(model){
	return new Promise(function(resolve, reject){
		let divOpt=""
		if(model.tags.divOption==1){
			divOpt+=" re investment option"
		}
		if(model.tags.divOption==2){
			divOpt+=" payout option"
		}
		model.reply={
			type:"generic",
            text:model.tags.investorName+", you are about to invest "+model.tags.amount+" in "+model.tags.scheme+divOpt+" with folio "+model.tags.folio+". Please select the bank to confirm and proceed for the payment. Note that by proceeding, you confirm that you are not using a third party bank account to fund mutual fund investment.",
            next:{
                "data": model.tags.bankMandateList
            }
		}
		resolve(model)
	})
}

function summary(model){
	return new Promise(function(resolve, reject){
		console.log(model.tags.paymentDone)
		console.log(typeof model.tags.paymentDone)
		if(model.tags.paymentDone&&model.tags.paymentDone==true){
			model.reply={
				type : 'quickReply',
				text : 'Hurray!! We have sucessfully initiated your transaction. Reference ID would be '+model.tags.transactionRefId+". What would you like to do next?",
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
	                	}
	                ]
	            }
			}
		}
		else{
			model.reply={
				type : 'quickReply',
				text : 'We cannot go ahead with the investment with given details. However you can try again or go ahead with the following. Reference ID would be '+model.tags.transactionRefId+". " ,
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

		model.tags.paymentDone="false";
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
			if(!model.tags.userSays.includes("-"+text[i])){
				model.tags.amount = text[i]
			}
			model.tags.userSays = model.tags.userSays.replace(text[i], '')
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
	return new Promise(async function(resolve,reject){
		let schemeNames = Object.keys(await readSchemes());
		// console.log(model)
		// console.log(schemeNames)
		let dataAmc=getAmcNamesEntityReplaced(model.tags.userSays);
		console.log(model)
		model.tags.userSays=dataAmc.text
		let wordsInUserSays=model.tags.userSays.toLowerCase().split(" ");
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
			// 	startIndex=amcIndex
			// }

			if(count>0){
				let searchTerm=""
				for(let i=parseInt(startIndex);i<=parseInt(endIndex);i++){
					searchTerm+=wordsInUserSays[i]+" "
				}
				searchTerm=searchTerm.trim();
				// // console.log(searchTerm)
				let matches = stringSimilarity.findBestMatch(searchTerm, schemeNames)
				if(matches.bestMatch.rating>0.9){
					model.tags.schemes = []
					model.tags.schemes.push(matches.bestMatch.target)
				}
				else if(matches.bestMatch.rating>0.4||dataAmc.flag){
					model.tags.schemes = []
					matches.ratings=matches.ratings.sort(sortBy('-rating'));
					model.tags.schemes = matches.ratings.splice(0,9);
				}
			}
		}
		return resolve(model);
	})
}
function readSchemes(){
	return new Promise((resolve,reject)=>{
		fs.readFile(path.resolve(__dirname, "../data.json"), 'utf8', function(err, data) {
            if(err){
                return reject(err)
            }
            console.log(typeof data)
            return resolve(JSON.parse(data));
        });
	})
}


// axis;
// baroda pioneer;baroda;
// birla sun life;birla;sun life;bnp;
// bnp paribas;bnp;paribas;
// boi axa investment managers;boi;axa;
// canara robeco;canara;
// dsp blackrock; dsp;
// franklin templeton;franklin;ft;
// hdfc;
// icici prudential;icici;
// idbi;
// idfc;
// kotak mahindra;kotak;mahindra;
// l and t;lnt;l and t;l&t;
// lic nomura;lic;
// mirae asset global investments;mirae;
// motilal oswal asset management services;motilal;
// dhfl pramerica;dhfl;
// principal pnb asset management company;pnb;principal;principal pnb;
// reliance;
// religare invesco;religare;invesco;
// sbi;
// sundaram;
// tata;
// uti;
// religare;


var amcsEntities={
	"Axis":["axis"],
	"Baroda Pioneer":["baroda pioneer","baroda"],
	"Aditya Birla Sun Life":["birla sun life","birla","sun life","bnp"],
	"BNP Paribas":["bnp paribas","bnp","paribas"],
	"BOI AXA":["boi axa investment managers","boi","axa"],
	"Canara Robeco":["canara robeco","canara"],
	"DSP BlackRock":["dsp blackrock", "dsp"],
	"Franklin":["franklin templeton","franklin","ft"],
	"HDFC":["hdfc"],
	"ICICI Prudential":["icici prudential","icici"],
	"IDBI":["idbi"],
	"IDFC":["idfc"],
	"Kotak":["kotak mahindra","kotak","mahindra"],
	"L&T":["l and t","lnt","l and t","l&t"],
	"LIC MF":["lic nomura","lic"],
	"Mirae Asset":["mirae asset global investments","mirae"],
	"Motilal Oswal":["motilal oswal asset management services","motilal"],
	"DHFL Pramerica":["dhfl pramerica","dhfl"],
	"Principal":["principal pnb asset management company","pnb","principal","principal pnb"],
	"Reliance":["reliance"],
	"Invesco":["religare invesco","religare","invesco"],
	"SBI":["sbi"],
	"Sundaram":["sundaram"],
	"Tata":["tata"],
	"UTI":["uti"]
}
function getAmcNamesEntityReplaced(text){
	let flag;
	for(let amcElement in amcsEntities){
		for(let alias of amcsEntities[amcElement]){
			if(text.includes(alias)){
				text=text.replace(alias,amcElement);
				flag=true;		
			}
		}
	}
	return {text:text,flag:flag};
}

function dataClean(model){
	// console.log(model.tags.userSays)
	if(model.tags.userSays){
		model.tags.userSays = model.tags.userSays.toLowerCase()
	}
    return model;
}