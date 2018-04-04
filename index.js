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
//                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateFolio"    :
                                        post.validateFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
//                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateAmount"   :   
                                        validateAmount(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "postValidateAmount":
                                        postValidateAmount(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });  
                break;
                
            case "validateAgreement":
                                        validateAgreement(request.body)
                                        .then(insertBuyCart)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        }); 
                break;
                
            case "insertBuyCart"    :
                                        insertBuyCart(request.body)
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

function validateAgreement(model){
    return new Promise(function(resolve,reject){
        try{   
            if(model.data.toLowerCase().includes("yes")){
                model.tags.termsAgreement=true;
                //make api call
//                delete model.stage;
            }
            else if(model.data.toLowerCase().includes("no")){
                let reply={
                    text    : "Please select yes in order to proceed.",
                    type    : "text",
                    sender  : model.sender,
                    language: "en"
                }
                sendExternalData(reply)
                .then((data)=>{
                    return resolve(model);
                })
                .catch((e)=>{
                    console.log(e);
                    return reject("Something went wrong.")
                })
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");  
        }
    })
}

function insertBuyCart(model){
     return new Promise(function(resolve,reject){
        try{
            if(model.tags.termsAgreement){
//                if(model.tags.schemeData.DividendOption==="B"){
                    if(model.tags.divOps=="Reinvest"){
                        model.tags.divOpt=1
                    }
                    else if(model.tags.divOps=="Payout"){
                        model.tags.divOpt=2
                    }
//                }
                console.log("https://www.prudentcorporate.com/cbapi/InsertBuyCart?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&SchemeName="+model.tags.schemeData.SchemeName+"&AMCId="+model.tags.amcId+"&DivOpt="+model.tags.divOpt+"&Amount="+model.tags.amount+"&FolioNo="+model.tags.folioSelected+"&isAgreeTerms=1"+"&IsEKYCTermCondition=1")
                request({
                    uri     :"https://www.prudentcorporate.com/cbapi/InsertBuyCart?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&SchemeName="+model.tags.schemeData.SchemeName+"&AMCId="+model.tags.amcId+"&DivOpt="+model.tags.divOpt+"&Amount="+model.tags.amount+"&FolioNo="+model.tags.folioSelected+"&isAgreeTerms=1"+"&IsEKYCTermCondition=1",
                    headers : headers,
                    body    : JSON.stringify({}),
                    method  :'POST'   
                },(err,req,body)=>{
                    if(err){   
                        console.log(err)
                        return reject("Something went wrong.");
                    }
                    else{
                        try{
                            console.log("BUY CART" + body);
                            body=JSON.parse(body);
                            if(body.Response){
                                if(body.Response[0].result){
    //                                return reject("Buy Cart Unsuccessful."); 
                                    model.reply={
                                        type:"text",
                                        text:"Buy Cart Unsuccessful.",
                                        next:{}
                                    }
                                    return resolve(model);
                                }   
                                else{
                                    model.reply={
                                        type:"text",
                                        text:"Success",
                                        next:{}
                                    }
                                    return resolve(model);
                                }
                            }
                        }
                        catch(e){
                            console.log("BUY CART" + e);
                            return reject("Something went wrong."); 
                        }
                    }
                })  
            }
            return resolve(model);
        }
         catch(e){
             console.log(e);
             return reject("Something went wrong.");
         }
     })
}

function postValidateAmount(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.validateAmountFlag){
                if(model.tags.validateAmountFlag){
                    if(model.tags.validateAmountFlag=="validated"){
                        delete model.tags.validateAmountFlag;
                        console.log(model.tags.schemeData.DividendOption+"----------------")
                    }
                    else if(model.tags.validateAmountFlag=="not validated"){
                        // model.reply={
                        //     text:model.tags.validatedAmountMessage,
                        //     type:"text",
                        //     next:{}
                        // }  
                    }
                }
            }
            else{
                // model.reply={
                //     text:"Please enter an amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.",
                //     type:"text",
                //     next:{}
                // }   
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function validateAmount(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                model.data=Math.round(model.data.match(/\d+/g)[0]);
                if(     model.data%100==0
                    &&  model.data<=parseInt(model.tags.schemeData.MaximumInvestment)
                    &&  model.data>=parseInt(model.tags.schemeData.MinimumInvestment)){
                    model.tags.amount=model.data;
                    model.tags.validateAmountFlag="validated";
                    if(model.tags.schemeData.DividendOption==="B"){
                            console.log("IN BBBBBBBBBBBBBBBBBB")
                            delete model.stage;
                    }
                    else{
                        if(model.tags.schemeData.DividendOption==="Y"){
                            console.log("IN YYYYYYYYYYYYYYY")
                            model.tags.divOpt=1;  
                        }
                        else if(model.tags.schemeData.DividendOption==="N"){
                            console.log("IN NNNNNNNNNNNN")
                            model.tags.divOpt=2;
                        }
                        else if(model.tags.schemeData.DividendOption==="Z"){
                            console.log("IN ZZZZZZZZZZZZZZZZZ")
                            model.tags.divOpt=0;
                        }
                        delete model.stage;
                    }
                }
                else{
                    return reject(model)
                    // model.tags.validateAmountFlag="not validated";
                    // model.tags.validatedAmountMessage="Please enter a valid amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.";   
                }
            }
            else{
                return reject(model)
                // model.tags.validatedAmount="not validated";
                // model.tags.validatedAmountMessage="Please enter an amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.";
            }
            console.log("+++++")
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
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