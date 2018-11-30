'use strict'
module.exports={
	main:main
}

let data = require('../data.js')
let words = require('../words.js')
let stringSimilarity = require('string-similarity');
let sortBy = require('sort-by')
let matchAll = require('match-all')
let StringMask = require('string-mask')

let obj = {
	fallback : fallback
}


function main(req, res){
		// console.log(req.params.stage)
		obj[req.params.stage](req.body)
		.then((data)=>{
			res.send(data)
		})
		.catch((e)=>{
			// console.log(e)
			res.sendStatus(203)
		})
}


function fallback(model){
	return new Promise((resolve,reject)=>{
		try{
			// console.log(JSON.stringify(model.bestIntents,null,3)+":::::::::::::::::>>>>>>>>>>>>>>>>>")
			let bestIntentSet=[]
			for(let index in model.bestIntents){
				let confidence=model.bestIntents[index].confidence
				// console.log("CONFIDENCE:::::::::::::::::::::::"+confidence)
				try{
					confidence=parseFloat(confidence)
					// console.log("CONFIDENCE:::FLOAT::::::::::::::::::::"+confidence)
				}
				catch(e){
					// console.log(e)
				}
				if(model.bestIntents[index].intentName.startsWith("st_")||confidence<0.35){
					// model.bestIntents.splice(index, 1)
				}
				else{
					bestIntentSet.push(model.bestIntents[index])
				}
			}
			model.bestIntents=bestIntentSet;
			if(model.prevQuery){
				if(model.prevQuery.startsWith("[similar] ")){
					model.prevQuery=model.prevQuery.replace("[similar]").replace("[/similar]").trim().split("|")[0];
				}
				if(model.prevQuery.startsWith("[nomatch] ")){
					model.prevQuery=model.prevQuery.replace("[similar]").replace("[/similar]").trim().split("|")[0];
				}
			}
			let data=[]
			if(model.bestIntents){
				for(let element of model.bestIntents){
					let query=replaceAll(element.query,"@","");
					if(query.length>80){
						query=query.substring(0, 80)+"...";
					}
					if(element.reply.length>80){
						element.reply=element.reply.substring(0, 80)+"...";
					}
					data.push({
							// title 	: "Query",
							// text 	: query,
							title 		: query,
							text		: element.reply,
							buttons : [
								{
									text : 'Read more',
									data : "[similar] "+query+"|"+model.prevQuery+"|"+element.id+" [/similar]"
								}
							]
						})
				}
			}
			if(data.length>0){
				data[data.length-1].buttons.push({
					text : 'Not relevant',
					data : "[nomatch] "+model.prevQuery+"|"+model.bestIntents[0].id.split("-")[0]+" [/nomatch]"
				})
				model.reply={
					type:"generic",
		            text:"We have got few similar questions asked by people like you. Slide through the cards to find one.",
		            next:{
		                data: data
		            }
				}
			}
			else{
				model.reply={
					type:"quickReply",
		            text:"I am not sure how to answer this, trying my best to learn. However, right now, you could try the following.",
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
		}
		catch(e){
			// console.log(e)
			return reject(model)
		}
		return resolve(model)
	});
}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}