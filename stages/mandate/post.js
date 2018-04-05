var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const sendExternalData=common.sendExternalData;
const url=common.url;

module.exports={
    validateMandate         :validateMandate,
    makePaymentUsingMandate :makePaymentUsingMandate
}

function validateMandate(model){
    return new Promise(function(resolve,reject){
        try{
            if(     model.data.match(/NFB\d{7}/)
              &&    model.data.match(/NFB\d{7}/)[0]
              &&    model.data.match(/NFB\d{7}/)[0].toString().length==10
              &&    model.tags.TGEditMndID.includes(model.data.match(/NFB\d{7}/)[0])){
                let mandateIdTemp=model.data.match(/NFB\d{7}/)[0];
                for(let i=0;i<model.tags.mandateDetails.length;i++){
                    if(model.tags.mandateDetails[i].TGEditMndID===mandateIdTemp){
                        model.tags.selectedMandate=model.tags.mandateDetails[i];
                        return resolve(model);
                    }
                }
            }
            else{
                return reject("Select valid mandate.");
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.1");
        }
    })
}

function makePaymentUsingMandate(model){
    console.log("IN MAKE PAYMENT USING MANDATE API");
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.selectedMandate){
                console.log(url+"cbapi/MakePaymentUsingMandate?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&MandateID="+model.tags.selectedMandate.MandateID+"&Amount="+model.tags.amount+"&IsThirdPartyBankTerms=1")
                request({
                    uri     : url+"MakePaymentUsingMandate?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&MandateID="+model.tags.selectedMandate.MandateID+"&Amount="+model.tags.amount+"&IsThirdPartyBankTerms=1",
                    headers : headers,
                    body    : JSON.stringify({}),
                    method  :'POST'   
                },(err,req,body)=>{
                    if(err){   
                        console.log(err);
                        return reject("Something went wrong.2");
                    }
                    else{
                        try{
                            console.log(body);
                            body=JSON.parse(body);
                            if(body.Response){
                                if(     body.Response[0]
                                    &&  body.Response[0].result){
                                    let reply={
                                        type    :"text",
                                        text    :"Make Purchase Unsuccessful.Ending the journey.Please type 'invest now' to restart the journey.",
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
                                        return reject("Something went wrong.3");
                                    })
                                }   
                                else if(body.Response.length>0){
                                    let reply={
                                        type    :"text",
                                        text    :"Congratulations!! The purchase has been made successfully.",
                                        next    :{},
                                        sender  :model.sender,
                                        language:"en"
                                    }
                                    sendExternalData(reply)
                                    .then((data)=>{
                                        delete model.stage
                                        console.log("MAKE PURCHASE STAGE COMPLETE----")
                                        return resolve(model);
                                    })
                                    .catch((e)=>{
                                        console.log(e);
                                        return reject("Something went wrong.4");
                                    })
                                }
                                else{
                                    let reply={
                                        type    :"text",
                                        text    :"Something went wrong while making purchase through mandate.Ending the journey.Please type 'invest now' to restart the journey.",
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
                                        return reject("Something went wrong.4");
                                    })
                                }
                            }
                            else{
                                let reply={
                                    type    :"text",
                                    text    :"Something went wrong while making purchase through mandate.Ending the journey.Please type 'invest now' to restart the journey.",
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
                                    return reject("Something went wrong.5");
                                })
                            }
                        }
                        catch(e){
                            console.log(e);
                            return reject("Something went wrong.6"); 
                        }
                    }
                })
            }
            else{
                return reject("Select valid mandate.");
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.7");
        }
    })
}