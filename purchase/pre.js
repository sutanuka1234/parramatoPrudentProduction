module.exports={
	main:main
}

let obj = {
	phone:phone,
	pan:pan,
	otp:otp
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

function phone(model){
	return new Promise(function(resolve, reject){
		resolve(model)
	})
}

function pan(model){
	return new Promise(function(resolve, reject){
		resolve(model)
	})
}

function otp(model){
	return new Promise(function(resolve, reject){
		resolve(model)	
	})
}