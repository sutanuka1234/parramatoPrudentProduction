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
	new Promise((resolve,reject)=>{
		model.reply={
			type:"generic",
            text:" Please select your holding pattern",
            next:{
                data: [{
									title 	: 'Fallback',
									text 	: "text",
									buttons : [
										{
											text : 'Select',
											data : "Select"
										}
									]
								}]
            }
		}
		resolve(model)
	});
}