module.exports={
	main:main
}

let obj = {
	// panMobile : panMobile,
	// phone	: phone,
	// pan		: pan,
	// otp		: otp
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