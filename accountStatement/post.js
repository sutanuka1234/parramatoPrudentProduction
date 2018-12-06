"use strict"
module.exports={
	main:main
}


let api = require('../api.js')
let external = require('../external.js')
let words = require('../words.js')
let data = require('../data.json')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
const size=10

let obj = {
	panMobile 	: panMobile,
	mobile		: mobile,
	pan			: pan,
	otp			: otp,
	folio 		: folio
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

let sortedJourney=["panMobile",
"mobile",
"pan",
"otp",
"agreement",
"holding",
"scheme",
"unitOrAmount",
"amount",
"confirm",
"summary"]


function main(req, res){
		console.log(req.params.stage)
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
				// console.log(e)
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
	return new Promise(async function(resolve, reject){
		model = dataClean(model);
		model = extractOTP(model);
		if(model.data.toLowerCase().includes('re send')||model.data.toLowerCase().includes('resend')){
			try{
				let response=await api.resendOtp(model.tags.ip, model.tags.session)
				response = JSON.parse(response.body)
				if(response.Response){
					model.tags.resend = true
					return resolve(model)
				}
				else{
					return reject(model)
				}
			}
			catch(e){
				console.log(e)
				return reject(model)
			}
				
		}
		else if(model.tags.otp){
			try{
				let data=await api.otp(model.tags.ip, model.tags.session, model.tags.otp)
				// console.log(data.body)
				let response = JSON.parse(data.body)
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
		                console.log(e);
		                return reject(model)
		            })
				}
				else{
					let data=await api.getClientAllFolio(model.tags.ip, model.tags.session);
					data.body = JSON.parse(data.body);
					model.tags.folioArray = []
					model.tags.showFolioArray = []
					model.tags.maskedFolios = []
					model.tags.folios=[]
					model.tags.amccodes=[]
					for (let i in data.body.Response){
						model.tags.folios.push(data.body.Response[i].FolioNo)    
	    				model.tags.maskedFolios.push(new Array(parseInt(data.body.Response[i].FolioNo.length*2/3) + 1).join( 'x' ) + data.body.Response[i].FolioNo.substring(parseInt(data.body.Response[i].FolioNo.length*2/3),data.body.Response[i].FolioNo.length))
						model.tags.amccodes.push(data.body.Response[i].AMCCode)
					}
					for(var i = 0; i<data.body.Response.length; i++){
						model.tags.folioArray.push({
							title 	: model.tags.Folios[i],
							// title 	: model.tags.maskedFolios[i],
							text 	: data.body.Response[i].AMCNAME,
							image 	: '',
							buttons : [
								{
									data : data.body.Response[i].AMCCode+','+data.body.Response[i].FolioNo,
									text : 'Select'
								}
							]
						})
					}
					model.tags.showFolioArray=model.tags.folioArray
					if(data.body.Response.length>9){
						model.tags.showFolioArray=model.tags.showFolioArray.splice(0,9)
						model.tags.showFolioArray.push({
							title : 'More Folio',
							text : '',
							image : '',
							buttons : [
								{
									data : 'more',
									text : 'More Folios'
								}
							]
						})
					}
					model.tags.firstFolioIndex=0
					model.tags.currentFolioShow=9;
					delete model.stage;
					return resolve(model)
				}
			}
			catch(e){
				console.log(e)
				return reject(e);
			}
			
		}
		else{
			return reject(model)
		}
	})
}

//============================================================

function folio(model){
	return new Promise(function (resolve,reject){
		if(model.data.toLowerCase().trim()== 'more'){
			console.log("1:::::::::::::")
			model.tags.firstFolioIndex+=9
			model.tags.currentFolioShow+=(model.tags.folioArray.length-model.tags.currentFolioShow)>9?(model.tags.currentFolioShow+9):(model.tags.folioArray.length-model.tags.currentFolioShow);
			model.tags.showFolioArray=[]
			for(var i=model.tags.firstFolioIndex; i<model.tags.currentFolioShow; i++){
				model.tags.showFolioArray.push(model.tags.folioArray[i])
			}
			if(model.tags.currentFolioShow<model.tags.folioArray){
				model.tags.showFolioArray=model.tags.showFolioArray.splice(0,9)
				model.tags.showFolioArray.push({
					title : 'More Folio',
					text : '',
					image : '',
					buttons : [
						{
							data : 'more',
							text : 'More Folios'
						}
					]
				})
			}
			return resolve(model)
		}
		else if(model.data.includes(",")&&model.tags.folios.includes(model.data.split(",")[1])){
			console.log("2::::::::::::")
			model.tags.folioNo = model.data.split(",")[1]
			// delete model.stage
			// return resolve(model);
			model.tags.amcCodeFolioNo = model.data.split(",")
			api.getAccountStatement(model.tags.ip,model.tags.session,model.data.split(",")[1],model.data.split(",")[0]).then((data)=>{
				data.body = JSON.parse(data.body)
				let input = data.body.Response[0].FileStatus.toLowerCase().trim()
				console.log("------------getAccountStatement response--------------------01")
				console.log(input)
				if(input.includes("no")){
					model.tags.fail = 1
					model.tags.nextFolio = undefined
					model.stage = 'statement'
					return resolve(model)
				}
				else if(input.includes("not found")){
					model.tags.fail = 1
					model.tags.nextFolio = undefined
					model.stage = 'statement'
					return resolve(model)
				}
				else if(input.includes("yes")){
					model.tags.nextFolio = undefined
					model.stage = 'statement'
					return resolve(model)
				}
				else{
					model.tags.nextFolio = undefined
					model.stage = 'statement'
					return resolve(model)
				}
			})
			.catch((e)=>{
				console.log(e)
				return reject(model);
			})
		}
		else{
			console.log("3::::::::::::")
			return reject("error");
		}
	})
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