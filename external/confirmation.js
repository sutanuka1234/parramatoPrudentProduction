
'use strict'

var request=require('request');
module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		console.log(req)
		let confirmationBody=req.body
		let arr=Object.keys(confirmationBody)
		if(confirmationBody){
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
				if(confirmationBody["Status"]&&confirmationBody["Status"].toLowerCase().trim()!="failed"){
					let model={
						repo:{"tags.session":session,"callback": true},
						response:session+"-payment-"+refId,
						data:{
							transactionRefId:refId
						}
					}
					sendExternalData(model)
					.then(()=>{});
					return res.sendStatus(200);
				}
				else{
					console.log('FAILED')
					console.log(session)
					console.log(refId)
					let model={
						repo:{"tags.session":session,"callback": true},
						response:session+"-payment-"+refId,
						data:{
							transactionRefId:false
						}
					}
					sendExternalData(model)
					.then((data)=>{ 
			            model.tags={}
						return res.sendStatus(200)
			        })
				}
			}
		}
		return res.sendStatus(203);
			
}


function sendExternalData(data){
    return new Promise(function(resolve,reject){
        try{
            request({
                uri     :'http://localhost:8080/JUBI2prC24_PrudentProduction/external/webViewCallback',
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
