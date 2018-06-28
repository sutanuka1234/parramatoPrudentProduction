
'use strict'

let external = require('../external.js')
module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		"ClientName:PATEL ARATIBEN RAJENDRAKUMAR,PAN:CPRPP3661J,SessionId:7C772321713D21713D21713D21713D21713D21713D21713D2F612A3F6326,
		ReferenceId:1001195225,SchemeName:IDFC Government Securities Fund - Investment Plan - Regular Plan - Periodic Dividend,FolioNo:1694776/24,Amount:5000.00,BankName:Central Bank of India,Status:Transaction Success,Timest:28 Jun 2018 15:27:17:000": ""
		console.log(JSON.stringify(req.body,null,3))

		res.sendStatus(200);
}


function sendExternalMessage(sender,text){
	let reply={
            text    : text,
            type    : "text",
            sender  : sender,
            language: "en"
        }
		external(reply)
		.then((data)=>{ })
        .catch((e)=>{
            // console.log(e);
       })
}