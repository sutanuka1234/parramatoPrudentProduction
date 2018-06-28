
'use strict'

var request=require('request');
module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		let confirmationBody=req.body
		"ClientName:PATEL ARATIBEN RAJENDRAKUMAR,PAN:CPRPP3661J,SessionId:7C772321713D21713D21713D21713D21713D21713D21713D3F63262A7425,ReferenceId:1001195233,SchemeName:Axis Focused 25 Fund - Growth,FolioNo:91031723562,Amount:9000.00,BankName:Central Bank of India,Status:Transaction Success,Timest:28 Jun 2018 17:55:04:000"
		
		let arr=Object.keys(confirmationBody)
		let session=""
		let refId=""
		if(arr.length>0){
			arr=arr[0].split(",")
			for(let element of arr){
				if(element.startsWith("SessionId:")){
					session=element.split(":")[1]	
				}
				if(element.startsWith("ReferenceId:")){
					refId=element.split(":")[1]
				}
			}
		}
		if(session){
			console.log(session)
			console.log(refId)
			let model={
				tags:{
						session:session
				},
				response:session+"-"+"payment",
				data:{
					transactionRefId:refId
				}
			}
			sendExternalData(model)
			.then(()=>{});
			res.sendStatus(200);
		}
		else{
			res.sendStatus(203);
		}
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
