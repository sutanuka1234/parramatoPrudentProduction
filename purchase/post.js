module.exports={
	main:main
}

let obj = {
	panMobile : panMobile,
	phone	: phone,
	pan		: pan,
	otp		: otp
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
		if(model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/) && model.data.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)) {
			if(model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/) && model.data.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)){
				model.tags.phone = model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/)[0]
				model.tags.pan = model.data.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)[0]
				model.stage = 'otp' 
				resolve(model)
			}
			else if(model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/)){
				console.log('PHONE')
				model.tags.phone = model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/)[0]
				model.stage = 'pan'
				resolve(model)
			}
			else if(model.data.match(/[a-z]{3}p[a-z]\d{4}[a-z]/)){
				console.log('PAN')
				model.tags.pan = model.tags.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)[0]
				delete model.stage
				resolve(model)
			}
			else{
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
		if(model.data.match(/((?:(?:\+|0{0,2})91(\s*[\-|\s]\s*)?|[0]?)?[789]\d{9})/)){
			model.stage = 'otp'
			resolve(model)
		}
		else{
			reject(model)
		}
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		if(model.data.match.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)){
			model.tags.pan = model.data.toLowerCase().match(/[a-z]{3}p[a-z]\d{4}[a-z]/)[0]
			resolve(model)
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
			resolve(model)
		}
		else{
			reject(model)
		}
	})
}