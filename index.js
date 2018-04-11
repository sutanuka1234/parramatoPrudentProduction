var request = require('request');
var stringSimilarity = require('string-similarity');
 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var post=require('./postDistributor.js');
var pre=require('./preDistributor.js');

app.use(jsonParser);
app.use(urlencodedParser);

const headers={
    UserName    : "Prudent",
    Password    : "Prudent@123"
}

const url="https://www.prudentcorporate.com/cbapi/";

app.listen(process.env.PORT||80,()=>{
    console.log("Server is listening.")
})


app.post('/:type',(req, res)=>{
    filter(req)
    .then((model)=>{
//        console.log("final response"+JSON.stringify(model))
        res.status(200).json(model)})
    .catch((e)=>{res.status(203).json({error:e})})
})

function filter(request){
    return new Promise(function(resolve, reject){
        switch(request.params.type){
            
            case "validateMobile"   :   
                                        post.validateMobile(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject(e)
                                        });
                break;
                
            case "validatePan"      :
                                        post.validatePan(request.body)
                                        .then(post.validatePanMobileByApi)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                                        
                break;
            
            case "validateOTP"      :   
                                        if(request.body.data.toLowerCase().includes("resend")&&request.body.tags.sessionId){
                                            console.log("IN RESEND PART");
                                            post.resendOTP(request.body)
                                            .then((model)=>{return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.")
                                            })
                                        }
                                        else{
                                            console.log("VALIDATING OTP")
                                            post.getOTP(request.body)
                                            .then(post.validateOTP)
                                            .then((model)=>{
                                                return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.");
                                            })
                                        }
                break;
                
            case "createHoldingPatternResponse":
                                        pre.createHoldingPatternResponse(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "validateHoldingPattern":
                                        post.validateHoldingPattern(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "getAmc" :
                                        pre.getAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
            break;
                
            case "validateAmcName" :
                                        post.vaildateSelectedAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;          
                
            case "getSubnatureOptions":
                                        pre.getSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "validateSubnatureOptions":
                                        post.validateSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showSchemes"      :
                                        pre.showSchemes(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
            
            case "validateSchemeName":
                                        post.validateSchemeName(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showFolio"        :
                                        pre.showFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateFolio"    :
                                        post.validateFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateAmount"   :   
                                        post.validateAmount(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "amountDecoration":
                                        pre.amountDecoration(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });  
                break;
/******/

            case "validateSchemeType"   :  
                                        console.log("validate showScheme type")
                                        console.log("**************************************")
                                        console.log("**************************************")
                                        post.validateSchemeType(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "showSchemeType":      console.log("showScheme type")
                                        console.log("**************************************")
                                        console.log("**************************************")
                                        pre.showSchemeType(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });  
                break;        
/******/
            case "validateAgreement":
                                        post.validateAgreement(request.body)
                                        .then(post.insertBuyCart)
                                        .then((model)=>{
                                            return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        }); 
                break;
                
            case "showMandate"      :
                                        pre.showMandate(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        }); 
                break;
                
            case "validateMandate"  :
                                        post.validateMandate(request.body)
                                        .then(post.makePaymentUsingMandate)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            default                 :   
                                        return reject("No service at this domain.");
                break;
        }
    });
}

// function showFolio(model){
//     return new Promise(function(resolve,reject){
//         try{
//             let reply={};
//             reply.type="generic";
//             reply.text="You can choose from the following folios."
//             reply.next={
//                 data:[]  
//             };
//             model.tags.foliosArray=[];
//             for(let i=0;i<model.tags.folioDetails.length;i++){
//                 console.log(JSON.stringify(model.tags.folioDetails[i])+"-----")
//                 if(model.tags.folioDetails[i]){
//                     reply.next.data.push({
//                         title   :model.tags.folioDetails[i].FolioNo,
//                         text    :"",
//                         buttons :[
//                             {
//                                 text:"Use this",
//                                 data:model.tags.folioDetails[i].FolioNo
//                             }
//                         ]
//                     })
//                     model.tags.foliosArray.push(parseInt(model.tags.folioDetails[i].FolioNo));
//                 }
//             }
//             model.reply=reply;
//             console.log(JSON.stringify(model.reply)+"FOLIOS")
//             return resolve(model);
//         }
//         catch(e){
//             console.log(e);
//             return reject("Something went wrong. Folio")
//         }
//     })
// }