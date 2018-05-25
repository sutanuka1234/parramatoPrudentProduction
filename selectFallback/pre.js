'use strict'
module.exports={
	main:main
}

let schemes = require('../schemes.js')
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


function fallback(model){
	return new Promise((resolve,reject)=>{
		console.log(JAON.stringify(model.bestIntents)+":::::::::::::::::>>>>>>>>>>>>>>>>>")
		for(let index in model.bestIntents){
			if(model.bestIntents[index].intentName.startsWith("st_")){
				model.bestIntents.splice(index, 1)
			}
		}
		let data=[]
		for(let element of model.bestIntents){
			data.push({
					title 	: "Query",
					text 	: element.query,
					buttons : [
						{
							text : 'Its similar',
							data : "<similar> "+element.intentName+"|"+element.query+"|"+model.prevQuery+" </similar>"
						}
					]
				})
		}
		if(data.length>0){
			model.reply={
				type:"generic",
	            text:"We have got few similar answers asked by people like you.",
	            next:{
	                data: data
	            }
			}
		}
		else{
			model.reply={
				type:"generic",
	            text:"I am not sure how to answer this, trying my best to learn. Could you please rephrase your query?"
			}
		}
		return resolve(model)
	});
}