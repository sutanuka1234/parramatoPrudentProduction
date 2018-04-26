module.exports={
	main:main
}

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
		resolve(model)
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

function holding(model){
	return new Promise(function(resolve, reject){
		if(model.tags.joinAccId){
			var arr = []
			console.log(model.tags.joinAccId)
			model.tags.joinAccId.forEach(function(element){
				arr.push({
					data : element.JoinAccId,
					text : element.JoinHolderName
				})
			})
			model.reply={
				type:"quickReply",
	            text:"Hey, has your previous policy expired?",
	            next:{
	                "data": arr
	            }
			}
			resolve(model)
		}
	})
}