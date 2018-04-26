module.exports={
	main:main
}

var api = require('../api.js')

let obj = {
	panMobile : panMobile,
	phone	: phone,
	pan		: pan,
	otp		: otp,
	holding : holding
	// amc 	: amc,
	// subnature : subnature,
	// name 	: name,
	// folio 	: folio,
	// amount 	: amount,
	// term 	: term,
	// mandate : mandate
}

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
		var phone = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/
		var pan = /[a-z]{3}p[a-z]\d{4}[a-z]/
		if((model.data.match(/\d+/)[0].length == 10 && model.data.match(phone) && model.data.toLowerCase().match(pan)) || (model.data.match(/\d+/)[0].length == 10 && model.data.match(phone)) || model.data.match(pan)) {
			if(model.data.match(phone) && model.data.toLowerCase().match(pan)){
				model.tags.phone = model.data.match(phone)[0]
				model.tags.pan = model.data.toLowerCase().match(pan)[0]
				api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
					response = JSON.parse(response)
					model.tags.session = response.Response[0].SessionId
					model.stage = 'otp' 
					resolve(model)
				})
			}
			else if(model.data.match(phone)){
				console.log('PHONE')
				model.tags.phone = model.data.match(phone)[0]
				model.stage = 'pan'
				resolve(model)
			}
			else if(model.data.match(pan)){
				console.log('PAN')
				model.tags.pan = model.data.match(pan)[0]
				delete model.stage
				resolve(model)
			}		
		}
		else{
			reject(model)
		}
	})
}

function phone(model){
	return new Promise(function(resolve, reject){
		var phone = /((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/
		if(model.data.match(/\d+/)[0].length == 10 && model.data.match(phone)){
			model.tags.phone = model.data.match(phone)[0]
			api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.session = response.Response[0].SessionId
				model.stage = 'otp'
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		var pan = /[a-z]{3}p[a-z]\d{4}[a-z]/
		if(model.data.toLowerCase().match(pan)){
			model.tags.pan = model.data.toLowerCase().match(pan)[0]
			api.panMobile(model.tags.phone, model.tags.pan, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.session = response.Response[0].SessionId
				delete model.stage
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		if(model.data.match(/\d{6}/)){
			model.tags.otp = model.data.match(/\d{6}/)[0]
			api.otp(model.tags.session, model.tags.otp, (err, http, response)=>{
				response = JSON.parse(response)
				model.tags.joinAccId = response.Response
				delete model.stage
				resolve(model)
			})
		}
		else{
			reject(model)
		}
	})
}

function holding(model){
	return new Promise(function(resolve, reject){
		console.log(model.data)
		resolve(model)
	})
}