
'use strict'

var request=require('request');
module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		// console.log(req)
		let confirmationBody = req.body		
		// let confirmationBody={
		//   "ClientName:PATEL ARATIBEN RAJENDRAKUMAR,PAN:CPRPP3661J,SessionId:7C772321713D21713D21713D21713D21713D21713D5E6D3A2364252A7425,ReferenceId:100 1887723,SchemeName:Reliance Liquid Fund - Growth,FolioNo:499153817726,Amount:400.00,BankName:Central Bank of India,Status:Transaction Success,Timest:13 Nov 2018 12:35:00:000": ""
		// }

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
			let status;
			var infoData = Object.keys(confirmationBody)[0].split(',')
			console.log(infoData)
			infoData.forEach(function(element){
			  if(element.includes('Status')){
			    console.log(element.split(':')[1])
			    status = element.split(':')[1]
			  }
			})
			if(session){
				if(status.includes('Success')){
					let model={
						repo:{"tags.session":session,"callback": true},
						response:session+"-payment-"+refId,
						data:{
							paymentDone:true,
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
							paymentDone:false,
							transactionRefId:refId
						}
					}
					sendExternalData(model)
					.then(()=>{});
					return res.sendStatus(200);
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
