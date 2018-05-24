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
		console.log(model.bestIntents+":::::::::::::::::>>>>>>>>>>>>>>>>>")
		let data=[]
		for(let element of model.bestIntents){
			data.push({
					title 	: element.query,
					text 	: element.reply,
					buttons : [
						{
							text : 'Know more',
							data : element.query
						}
					]
				})
		}
		model.reply={
			type:"generic",
            text:"We have got few similar answers for you.",
            next:{
                data: data
            }
		}
		return resolve(model)
	});
}