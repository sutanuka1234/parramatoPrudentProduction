var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const sendExternalData=common.sendExternalData;
const url=common.url;

module.exports={
    getOTP      :getOTP,
    validateOTP :validateOTP
};

function getOTP(model){
    return new Promise(function(resolve, reject){
        try{
            if(     model.data.match(/\d+/)
               &&   model.data.match(/\d+/)[0]
               &&   model.data.match(/\d+/)[0].length == 6){
                model.tags["otp"]=model.data.match(/\d+/)[0];
                return resolve(model);
            }
            else{
                return reject(model);
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function validateOTP(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.otp){
                var requestParams = {
                    method  : 'POST',
                    url     : url+"ConfirmOTP?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&OTPCode="+model.tags.otp,
                    headers : headers,
                    body    : JSON.stringify({})
                }
                request(requestParams,function(error,response,body){
                    if(body){
                        console.log(body+"OTP VALIDATION RESPONSE");
                        body=JSON.parse(body);
                        if(body.Response&&body.Response.length>0){
                            if(body.Response[0]&&body.Response[0].JoinAccId&&body.Response[0].JoinHolderName){
                                console.log(JSON.stringify(body.Response[0])+"ACCOUNT DETAILS");
                                model.tags.holdingPattern=body.Response;
                                if(model.tags.otpValidateReply){
                                    delete model.tags.otpValidateReply;
                                }
                                let reply={
                                    text    : "Thanks, your OTP is verified ! We can now continue with your investment process :)",
                                    type    : "text",
                                    next    : {},
                                    sender  : model.sender,
                                    language: "en"
                                }
                                sendExternalData(reply)
                                .then((data)=>{
                                    delete model.stage;
                                    return resolve(model)})
                                .catch((e)=>{
                                    console.log(e);
                                    return reject("Something went wrong.");
                                })
                            }
                            else if(body.Response[0].result==="FAIL"){
                                let reply={
                                    type    : "button",
                                    next    : {
                                                "data": [
                                                {
                                                    "text": "Resend OTP",
                                                    "data": "Resend OTP"
                                                }
                                            ]
                                    },
                                    sender  : model.sender,
                                    language: "en"
                                }
                                if(body.Response[0].reject_reason=="Wrong OTP re-enter OTP code."){
                                    reply.text="Oh no, OTP you entered was found to be wrong. Could you please re-enter the OTP?";
                                }
                                else{
                                    reply.text=body.Response[0].reject_reason;
                                }
                                sendExternalData(reply)
                                .then((data)=>{
                                    return reject(model)})
                                .catch((e)=>{
                                    console.log(e);
                                    return reject("Something went wrong.");
                                })
                            }
                            else if(body.Response[0].result==="BADREQUEST"){
                                let reply={
                                    text    :"Apologies! Something went wrong while validating your OTP.",
                                    type    : "button",
                                    next    : {
                                                "data": [
                                                {
                                                    "text": "Resend OTP",
                                                    "data": "Resend OTP"
                                                }
                                            ]
                                    },
                                    sender  : model.sender,
                                    language: "en"
                                }
                                sendExternalData(reply)
                                .then((data)=>{
                                    return reject(model)})
                                .catch((e)=>{
                                    console.log(e);
                                    return reject("Something went wrong.");
                                })
                            }
                            else{
                                return reject("API Call was not made correctly.");        
                            }
                        }
                        else{
                            return reject("Something went wrong.");
                        }
                    }
                    else{
                        console.log(error);
                        return resolve(model);
                    }
                })
            }
            else{
                return resolve(model);
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function resendOTP(model){
    return new Promise(function(resolve, reject){
        try{
            var requestParams = {
                method  : 'POST',
                url     : url+"ReSend?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId,
                headers : headers,
                body    : JSON.stringify({})
            }
            request(requestParams,function(error,response,body){
                if(error){
                    return reject(error);
                }
                else{
                    body=JSON.parse(body);
                    if(body.Response[0].result==="SUCCESS"){
                            let reply={
                                text    : "Hello! Your new OTP has been sent to your mobile number :)",
                                type    : "text",
                                sender  : model.sender,
                                language: "en"
                            }
                            sendExternalData(reply)
                            .then((data)=>{
                                model.tags.otpResentReply={
                                    text    : "You are requested to attempt again.",
                                    type    : "text"
                                };
                                return resolve(model)})
                            .catch((e)=>{
                                console.log(e);
                                return reject("Something went wrong.")
                            })
                    }
                    else if(body.Response[0].result==="FAIL"){
                        if(     body.Response[0].reject_reason!="Sorry, Maximum attempts exceeded."
                           &&   body.Response[0].reject_reason!="Maximum attempts exceeded."){
                            let reply={
                                text    : body.Response[0].reject_reason,
                                type    : "button",
                                sender  : model.sender,
                                next    : {
                                            "data": [
                                            {
                                                "text": "Resend OTP",
                                                "data": "Resend OTP"
                                            }
                                        ]
                                },
                                language: "en"
                            }
                            sendExternalData(reply)
                            .then((data)=>{
                                model.tags.otpResentReply={
                                        text    : "You are requested to attempt again.",
                                        type    : "text"
                                };
                                return resolve(model)})
                            .catch((e)=>{
                                console.log(e);
                                return reject("Something went wrong.")
                            });
                        }
                        else{
                            let reply={
                                text    : "Apologies! The OTP can only be sent two times :(",
                                type    : "text",
                                sender  : model.sender,
                                next    : {},
                                language: "en"
                            }
                            sendExternalData(reply)
                            .then((data)=>{
                                model.stage="final";
                                return resolve(model)})
                            .catch((e)=>{
                                console.log(e);
                                return reject("Something went wrong.")
                            });

                        }
                    }
                    else if(body.Response[0].result==="BADREQUEST"){
                        let reply={
                            text    : "Apologies! Something went wrong when re-sending the OTP. I will have to end the conversation.",
                            type    : "text",
                            sender  : model.sender,
                            next    : {},
                            language: "en"
                        }
                        sendExternalData(reply)
                        .then((data)=>{
                            model.stage="final";
                            return resolve(model)})
                        .catch((e)=>{
                            console.log(e);
                            return reject("Something went wrong.")
                        })
                    }
                    else{
                        return reject("Something went wrong.");        
                    }
                }
            })
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })                   
}

