var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const sendExternalData=common.sendExternalData;
const url=common.url;

module.exports={
    validatePan             :validatePan,
    validatePanMobileByApi  :validatePanMobileByApi
}

function validatePan(model){
    return new Promise(function(resolve, reject){
        try{
            let panData = model.data.match("[a-z|A-Z]{5}[0-9]{4}[a-z|A-Z]");
            if(panData&&panData instanceof Array){
                model.tags["pan"]=panData[0];
                return resolve(model);
            }
            return reject(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}

function validatePanMobileByApi(model){
    return new Promise(function(resolve, reject){
        if(model.tags.pan&&model.tags.mobile){
            makePanMobileValidationRequest({},"AuthenticatePANMobile?IPAddress=192.168.0.102&PanNo="+model.tags.pan+"&MobileNo="+model.tags.mobile)
            .then((data)=>{
                if(data.sessionId){
                    model.tags.sessionId=data.sessionId;
                    let reply={
                        text    : "Congratulations! Your details have been validated!",
                        type    : "text",
                        sender  : model.sender,
                        language: "en"
                    }
                    sendExternalData(reply)
                    .then((data)=>{
                        delete model.stage;
                        return resolve(model);
                    })
                    .catch((e)=>{
                        console.log(e);
                        return reject("Something went wrong.")
                    })
                }
                else if(data.fail){
                    delete model.tags.pan;
                    delete model.tags.mobile;
                    let reply={
                        text    : "Sorry. It seems this client does not exist.",
                        type    : "text",
                        sender  : model.sender,
                        language: "en"
                    }
                    sendExternalData(reply)
                    .then((data)=>{
                        model.stage="validateMobile";
                        model.message=data.reason;
                        return resolve(model);
                    })
                    .catch((e)=>{
                        console.log(e);
                        return reject("Something went wrong.");
                    })
                }
                else if(data.badRequest){
                    let reply={
                        text    : data.reason,
                        type    : "text",
                        sender  : model.sender,
                        language: "en"
                    }
                    sendExternalData(reply)
                    .then((data)=>{
                        model.message=data.reason;
                        return resolve(model)})
                    .catch((e)=>{
                        console.log(e);    
                        return reject("Something went wrong.")
                    })   
                }
            })
            .catch((e)=>{
                console.log(e);
                return reject("Something went wrong.")
            });
        }
        else{
            return resolve(model);
        }
    });
}

function makePanMobileValidationRequest(requestData,urlExtension){
    return new Promise(function(resolve, reject){
        try{
            var requestParams = {
                method  : 'POST',
                url     : url+urlExtension,
                headers : headers,
                body    : JSON.stringify(requestData)
            }
            request(requestParams,function(error,response,body){
                if(body){
                    console.log(body+"PAN MOBILE VALIDATION RESPONSE")
                    try{
                        body=JSON.parse(body);
                        if(body.Response&&body.Response.length>0){
                            let data={};
                            if(body.Response[0].result==="SUCCESS"){
                                data.sessionId=body.Response[0].SessionId;
                                return resolve(data);
                            }
                            else if(body.Response[0].result==="FAIL"){
                                data.fail=true;
                                data.reason=body.Response[0].reject_reason;
                                return resolve(data);
                            }
                            else if(body.Response[0].result==="BADREQUEST"){
                                data.badRequest=true;
                                data.reason="Something went wrong during API Call";
                                return resolve(data);
                            }
                            else{
                                return reject("API Call was not made correctly.");        
                            }
                        }
                        else{
                            return reject("Something went wrong.");
                        }
                    }
                    catch(e){
                        console.log(e);
                        return reject("Something went wrong.");
                    }
                }
                else{
                    console.log(error)
                    return reject("Something went wrong.");
                }
            })
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}