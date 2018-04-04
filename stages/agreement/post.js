var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const sendExternalData=common.sendExternalData;
const url=common.url;

module.exports={
    validateAgreement   :validateAgreement,
    insertBuyCart       :insertBuyCart
}

function validateAgreement(model){
    return new Promise(function(resolve,reject){
        try{   
            if(model.data.toLowerCase().includes("yes")){
                model.tags.termsAgreement=true;
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
                    return reject("Invalid option.");
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
                request({
                    uri     : "https://www.prudentcorporate.com/cbapi/InsertBuyCart?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&SchemeName="+model.tags.schemeData.SchemeName+"&AMCId="+model.tags.amcId+"&DivOpt="+model.tags.divOpt+"&Amount="+model.tags.amount+"&FolioNo="+model.tags.folioSelected+"&isAgreeTerms=1"+"&IsEKYCTermCondition=1",
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
                                if(     body.Response[0]
                                    &&  body.Response[0].result){
                                    let reply={
                                        type    :"text",
                                        text    :"Insert Buy Cart Unsuccessful.Ending the journey.Please type 'invest now' to restart the journey.",
                                        next    :{},
                                        sender  :model.sender,
                                        language:"en"
                                    }
                                    sendExternalData(reply)
                                    .then((data)=>{
                                        model.stage="final";
                                        return resolve(model);
                                    })
                                    .catch((e)=>{
                                        console.log(e);
                                        return reject("Something went wrong.");
                                    })
                                    return resolve(model);
                                }   
                                else if(body.Response.length>0){
                                    let reply={
                                        type    :"text",
                                        text    :"Congratulations!! Insert Buy Cart Successful",
                                        next    :{},
                                        sender  :model.sender,
                                        language:"en"
                                    }
                                    sendExternalData(reply)
                                    .then((data)=>{
                                        delete model.stage
                                        return resolve(model);
                                    })
                                    .catch((e)=>{
                                        console.log(e);
                                        return reject("Something went wrong.");
                                    })
                                    return resolve(model);
                                }
                                else{
                                    let reply={
                                        type    :"text",
                                        text    :"Something went wrong while adding the purchase to cart.Ending the journey.Please type 'invest now' to restart the journey.",
                                        next    :{},
                                        sender  :model.sender,
                                        language:"en"
                                    }
                                    sendExternalData(reply)
                                    .then((data)=>{
                                        model.stage="final";
                                        return resolve(model);
                                    })
                                    .catch((e)=>{
                                        console.log(e);
                                        return reject("Something went wrong.");
                                    })
                                    return resolve(model);
                                }
                            }
                            else{
                                let reply={
                                    type    :"text",
                                    text    :"Something went wrong while adding the purchase to cart.Ending the journey.Please type 'invest now' to restart the journey.",
                                    next    :{},
                                    sender  :model.sender,
                                    language:"en"
                                }
                                sendExternalData(reply)
                                .then((data)=>{
                                    model.stage="final";
                                    return resolve(model);
                                })
                                .catch((e)=>{
                                    console.log(e);
                                    return reject("Something went wrong.");
                                })
                                return resolve(model);
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