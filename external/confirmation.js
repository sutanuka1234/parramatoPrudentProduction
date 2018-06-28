
'use strict'

var request=require('request');
module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		let confirmationBody=JSON.parse(req.body)
		console.log(JSON.stringify(confirmationBody,null,3))
		let model={
			tags:{
					session:confirmationBody["SessionId"]
			},
			response:confirmationBody["SessionId"]+"-"+"payment",
			data:{
				transactionRefId:confirmationBody["ReferenceId"]
			}
		}
		sendExternalData(model)
		.then(()=>{});
		res.sendStatus(200);
}


function sendExternalData(data){
    return new Promise(function(resolve,reject){
        try{
            request({
                uri     :'https://fund-bazar-backend.herokuapp.com/JUBI2prC24_PrudentAPIs/external/webViewCallback',
                json    :data,
                method  :'POST'   
            },(err,req,body)=>{
                if(err){   
                    console.log(err)
                    return reject("Something went wrong.");
                }
                else{
                    console.log(body);
                    return resolve(body);
                }
            })      
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.")
        }
    });
}
