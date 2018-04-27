module.exports={
	main:main
}

var schemes = require('../new.json')
var stringSimilarity = require('string-similarity');

let obj = {
	panMobile : panMobile,
	phone	: phone,
	pan		: pan,
	otp		: otp
	// holding : holding,
	// amc 	: amc,
	// type 	: type,
	// subnature : subnature,
	// category:category
	// name 	: name,
	// folio 	: folio,
	// amount 	: amount,
	// term 	: term,
	// mandate : mandate
}

var regexPan=/[a-z]{3}p[a-z]\d{4}[a-z]/;
var regexMobile=/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/;
var regexAmount=/(\d{7}|\d{6}|\d{5}|\d{4}|\d{3}|\d{1}(k|l))/
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
		console.log(model)
		//pan,mobile,amount,amc,scheme,option,payout,tentativeFolio
		if(model.data.match(regexPan)){
			model.data.replace((regexPan), '')
			model.tags.pan = regexPan[0]
		}
		if(model.data.match(/\d+/) && model.data.match(/\d+/)[0].length == 10 && model.data.match(regexMobile)){
			model.data.replace((regexMobile), '')
			model.tags.mobile = regexMobile[0]
		}
		if(model.data.match(regexAmount)){
			model.data.replace((regexAmount), '')
			model.tags.amount = regexAmount[0]
		}
		if(stringSimilarity.findBestMatch(model.data, schemeNames).bestMatch.rating >= 0.4){
			model.tags.schemes = []
			stringSimilarity.findBestMatch(model.data, schemeNames).ratings.forEach(function(element){
				model.tags.schemes.push(element)
			})
		}
		resolve(model)
	})
}

function phone(model){
	return new Promise(function(resolve, reject){
		//mobile,amount,amc,scheme,option,payout,tentativeFolio
		resolve(model)
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		//pan,amount,amc,scheme,option,payout,tentativeFolio
		resolve(model)
	})
}

function otp(model){
	console.log(model.tags.schemes)
	return new Promise(function(resolve, reject){
		//amount,amc,scheme,option,payout,tentativeFolio
		resolve(model)	
	})
}

// function holding(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.tags.joinAcc){
// 			var arr = []
// 			model.tags.joinAcc.forEach(function(element){
// 				arr.push({
// 					data : element.JoinAccId,
// 					text : element.JoinHolderName
// 				})
// 			})
// 			model.reply={
// 				type:"quickReply",
// 	            text:"Select your account",
// 	            next:{
// 	                "data": arr
// 	            }
// 			}
// 			resolve(model)
// 		}
// 	})
// }

// function amc(model){
// 	return new Promise(function(resolve, reject){
// 		if(model.tags.matches){
// 			model.reply={
// 				type:"quickReply",
// 	            text:"Did you mean this?",
// 	            next:{
// 	                "data": [
// 	                	{
// 	                		data : model.tags.matches,
// 	                		text : model.tags.matches
// 	                	}
// 	                ]
// 	            }
// 			}
// 			resolve(model)
// 		}
// 		else{
// 			model.reply={
// 				type:"text",
// 				text:"Enter your AMC name"
// 			}
// 			resolve(model)
// 		}
// 	})
// }

// function type(model){
// 	return new Promise(function(resolve, reject){
// 		model.reply={
// 				type:"quickReply",
// 	            text:"Select a scheme type",
// 	            next:{
// 	                "data": [
// 	                	{
// 	                		data : 'dividend',
// 	                		text : 'Dividend'
// 	                	},
// 	                	{
// 	                		data : 'growth',
// 	                		text : 'Growth'
// 	                	}
// 	                ]
// 	            }
// 			}
// 		resolve(model)
// 	})
// }

// function subnature(model){
// 	return new Promise(function(resolve, reject){
// 		var arr = []
// 		model.tags.subNatures[model.tags.amcNames[model.tags.matches]].forEach(function(element){
// 			arr.push({
// 				data : element,
// 				text : element
// 			})
// 		})
// 		model.reply={
// 			type:"quickReply",
// 			text:"Select a sub nature",
// 			next:{
// 				"data" : arr
// 			} 
// 		}
// 		resolve(model)
// 	})
// }

// function category(model){
// 	return new Promise(function(resolve, reject){
// 		model.reply={
// 			type:"quickReply",
//             text:"Select a category",
//             next:{
//                 "data": [
//                 	{
//                 		data : 'suggested funds',
//                 		text : 'Suggested Funds'
//                 	},
//                 	{
//                 		data : 'all funds',
//                 		text : 'All Funds'
//                 	},
//                 	{
//                 		data : 'nfo/fmp',
//                 		text : 'NFO/FMP'
//                 	}
//                 ]
//             }
// 		}
// 		resolve(model)
// 	})
// }