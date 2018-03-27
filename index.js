var request = require('request');
var stringSimilarity = require('string-similarity');
 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
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
        res.json(model).status(200)})
    .catch((e)=>{res.status(203).json({message:e})})
})
   
function filter(request){
    return new Promise(function(resolve, reject){
        switch(request.params.type){
            
            case "validateMobile"   :   
                                        validateMobile(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
                
//            case "validatePanMobileByApi"    :  
//                                        getPanMobile(request.body)
//                                            .then(validatePanMobileByApi)
//                                        .then((model)=>{return resolve(model)})
//                                        .catch((e)=>{return reject(e)})
//                break;
                
            case "validatePan"      :
                                        validatePan(request.body)
                                        .then(validatePanMobileByApi)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                                        
                break;
            
            case "validateOTP"      :   
                                        if(request.body.data.toLowerCase().includes("resend")&&request.body.tags.sessionId){
                                            console.log("IN RESEND PART");
                                            resendOTP(request.body)
                                            .then((model)=>{return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.")
                                            })
                                        }
                                        else{
                                            console.log("VALIDATING OTP")
                                            getOTP(request.body)
                                            .then(validateOTP)
                                            .then((model)=>{
                                                console.log(JSON.stringify(model)+"AT FILTER--------------")
                                                return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.");
                                            })
                                        }
                break;
            
            case "postValidateMobile":
                                        postValidateMobile(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "postValidatePan"  :
                                        postValidatePan(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        })
                break;
                
            case "postValidateOtp"  :
                                        postValidateOtp(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "createHoldingPatternResponse":
                                        createHoldingPatternResponse(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "validateHoldingPattern":
                                        validateHoldingPattern(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
            case "getAmc" :
                                        getAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
            break;
            case "validateAmcName" :
                                        vaildateSelectedAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;          
            case "getSubnatureOptions":
                                        getSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
            
            default                 :   
                                        return reject("No service at this domain.");
                break;
        }
    });
}

function getSubnatureOptions(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.subnatureOptions){
                let reply={};
                reply.type="generic";
                reply.text="You can choose from the following sub-natures."
                reply.next={
                    data: []
                }
                
                let loop=model.tags.subnatureOptions.length/3;
                
                let min=0;
                let max=3
                
                console.log(loop+"////////////////////")
                
                for(let i=0;i<loop;i++){
                    reply.next.data.push({
                        title   :"Select from the following Sub-natures.",
                        text    :"",
                        buttons :[]
                    })
                    for(let j=min;j<max;j++){
                        if(model.tags.subnatureOptions[min]&&model.tags.subnatureOptions[j].SubNature){
                            reply.next.data[i].buttons.push({
                                text:model.tags.subnatureOptions[j].SubNature,
                                data:model.tags.subnatureOptions[j  ].SubNature
                            })
                        }
                    }
                    min=max;
                    max=max+3;
                }
                
//                for(let i=1;i<model.tags.subnatureOptions.length+1;i++){
//                    reply.next.data.push({
//                        title   :"Select from the following SUb-natures.",
//                        text    :"",
//                        buttons :[
//                            {
//                                text:"Use this",
//                                data:
//                            }
//                        ]
//                    })
//                    for(let j=1;j<4;j++){
//                        
//                    }
//                }
                model.reply=reply;
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}
    
function vaildateSelectedAmc(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.amcConfirmation){
                console.log("POST CONFIRMATION")
                if(model.data.toLowerCase().includes("yes")){
                    for(let i=0;i<model.tags.AMCNames.length;i++){
                        console.log(model.tags.match+" Mutual Fund"+"---------------"+model.tags.AMCNames[i].AMCName);
                        if(model.tags.match+" Mutual Fund"===model.tags.AMCNames[i].AMCName){
                            model.tags.amcName=model.tags.match+" Mutual Fund";
                            model.tags.amcId=model.tags.AMCNames[i].ID
                            delete model.stage;
                            console.log(JSON.stringify(model.tags)+"TAGS")
                            break;
                        }
                    }
                }
                else if(model.data.toLowerCase().includes("no")){
                    if( match
                       &&match.bestMatch
                       &&match.bestMatch.rating
                       &&((match.bestMatch.rating)>0.2)){
                        model.tags.match=match.bestMatch.target;
                    }
                    else{
                        if(model.tags.match){
                            delete model.tags.match;
                        }
                    }
                    return resolve(model);
                }
                delete model.tags.amcConfirmation;
            }
            else{
                var match = stringSimilarity.findBestMatch(model.data.replace("invest",""), model.tags.amcNamesArray);
                console.log("SEARCH FOR MATCH")
                if( match
                   &&match.bestMatch
                   &&match.bestMatch.rating
                   &&((match.bestMatch.rating)>0.2)){
                    model.tags.match=match.bestMatch.target;
                }
                else{
                    if(model.tags.match){
                        delete model.tags.match;
                    }
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}
function getAmc(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.AMCNames){
                if(model.tags.match){
                    console.log("MATCH EXISTS")
                    model.reply={
                        type:"quickReply",
                        text:"Did you mean "+model.tags.match +" Mutual Fund",
                        next:{
                                "data": [
                                    {
                                        "text": "yes",
                                        "data": "yes"
                                    },
                                    {
                                        "text": "no",
                                        "data": "no"
                                    }
                                ]
                        }
                    }
//                    delete model.tags.match;
                    model.tags.amcConfirmation=true;
                }
                else{
                    console.log("MATCH DOES NOT EXIST")
                    model.reply={
                        type:"text",
                        text:"Please type in amc again.",
                        next:{}
                    }
                    if(model.tags.amcConfirmation){
                        delete model.tags.amcConfirmation;
                    }
                }
                return resolve(model);
            }
            else{
                var getAmcReq={
                    method  : 'POST',
                    url     : url+"GetAMC?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId,
                    headers : headers,
                    body    : JSON.stringify({})
                }
                request(getAmcReq,(err,http,body)=>{
                    if(err){
                        console.log("get amc" + err)
                        return reject("failed");
                    }
                    else{
                      console.log("get Amc " + body)
                      if(body){
                        body= JSON.parse(body);
                        model.tags.AMCNames= body["Response"][0]
                        let amcNamesArray = []
                        for(let i=0;i<model.tags.AMCNames.length;i++){
                            amcNamesArray.push(model.tags.AMCNames[i].AMCName.replace(" Mutual Fund","").trim());
                        }
                        model.tags.amcNamesArray=amcNamesArray;
                        model.tags.subnatureOptions=body["Response"][2];
                        return resolve(model)
                      }
                      else{
                        return reject("failed")
                      }
                    }
                })
            }
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    })
}

function validateMobile(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.data.match(/\d+/g)){
                let mobileData = model.data.match(/\d+/g);
                console.log(mobileData[0]+"---");
                
                if(mobileData && mobileData[0].toString().length==10 && mobileData instanceof Array){
                    model.tags["mobile"]=mobileData[0];
                    model.tags.mobileValidated="validated";
                    delete model.stage;
                    return resolve(model);
                }
                else{
                    model.tags.mobileValidated="not validated";
                    model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid 10 digit mobile phone number."
                    return resolve(model);
                }
            }
            else{
                model.tags.mobileValidated="not validated";
                model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number.";
                return resolve(model);
            }
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    });
}

function validatePan(model){
    return new Promise(function(resolve, reject){
        try{
            let panData = model.data.match("[a-z|A-Z]{5}[0-9]{4}[a-z|A-Z]");
            if(panData&&panData instanceof Array){
                model.tags["pan"]=panData[0];
                model.tags.panValidated="validated";
                return resolve(model);
            }
            else{
                model.tags.panValidated="not validated";
                model.tags.panValidatedData="Sorry thats not the one :( You are requested to enter a valid PAN number. A valid PAN  looks like this- abcde1234f :)";
                return resolve(model)
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}

function postValidateMobile(model){
    return new Promise(function(resolve, reject){   
        try{
            if(model.tags.mobileValidated){
                let text;
                if(model.tags.mobileValidated&&model.tags.mobileValidated=="validated"){
                    delete model.tags.mobileValidated;
                    delete model.tags.mobileValidated;
                    return resolve(model);
                }
                else if(model.tags.mobileValidated&&model.tags.mobileValidated=="not validated"){
                    if(model.tags.mobileValidatedData){
                        text=model.tags.mobileValidatedData;
                    }
                    else{
                        text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
                    }
                }
                else{
                    text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
                }
                model.reply={
                    text:text,
                    type:"text",
                    next:{}
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}

function postValidatePan(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.panValidated){
                let text;
                if(model.tags.panValidated&&model.tags.panValidated=="validated"){
                    delete model.tags.panValidated;
                    delete model.tags.panValidated;
                    return resolve(model);
                }
                else if(model.tags.panValidated&&model.tags.panValidated=="not validated"){
                    if(model.tags.panValidatedData){
                        text=model.tags.panValidatedData;
                    }
                    else{
                        text="Sorry thats not the one :( You are requested to enter a valid PAN number. A valid PAN  looks like this- abcde1234f :)"
                    }
                }
                else{
                    text="Sorry thats not the one :( You are requested to enter a valid PAN number. A valid PAN  looks like this- abcde1234f :)"
                }
                model.reply={
                    text:text,
                    type:"text",
                    next:{}
                }
            }
            return resolve(model);    
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}

function postValidateOtp(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.otpValidateReply){
                model.reply=model.tags.otpValidateReply;
                delete model.tags.otpValidateReply;
            }
            else if(model.tags.otpResentReply){
                model.reply=model.tags.otpResentReply;
                delete model.tags.otpResentReply;
            }
            return resolve(model);
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    })
}

function getPanMobile(model){
    return new Promise(function(resolve, reject){
        try{
            let panData = model.data.match("[a-z|A-Z]{5}[0-9]{4}[a-z|A-Z]");
            if(panData&&panData instanceof Array){
                model.tags["pan"]=panData[0];
            }
            let mobileData = model.data.match(/[0-9]{10}/g);
            if(mobileData&&mobileData instanceof Array){
                model.tags["mobile"]=mobileData[0];
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}

function getOTP(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.data.match(/\d+/)&&model.data.match(/\d+/)[0]&&model.data.match(/\d+/)[0].length == 6){
                model.tags["otp"]=model.data.match(/\d+/)[0];
                return resolve(model);
            }
            else{
                if(model.tags.otp){
                    delete model.tags.otp;
                }
                if(model.data.match(/\d+/)&&model.data.match(/\d+/)[0]){
                    model.tags.otpValidateReply={
                        text:"Please enter a valid 6 digit OTP code.",
                        type:"text",
                        next:{}
                    }
                    return resolve(model);
                }
                else{
                    model.tags.otpValidateReply={
                        text:"Sorry. You are requested to enter a valid OTP code. A valid OTP looks like this- 123456 :)",
                        type:"text",
                        next:{}
                    }
                    return resolve(model);
                }
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function validatePanMobileByApi(model){
    return new Promise(function(resolve, reject){
        console.log(JSON.stringify(model)+"++++++++++++++++++++")
        if(model.tags.pan&&model.tags.mobile){
            makePanMobileValidationRequest({},"AuthenticatePANMobile?IPAddress=192.168.0.102&PanNo="+model.tags.pan+"&MobileNo="+model.tags.mobile)
            .then((data)=>{
                if(data.sessionId){
                    model.tags.sessionId=data.sessionId;
                    delete model.stage;
                    let reply={
                        text    : "Congratulations! Your details have been validated!",
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
                        model.stage="validateMobile"
                        console.log(JSON.stringify(model)+"INVALID DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
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
            console.log(JSON.stringify(requestParams)+"PAN MOBILE VALIDATION REQUEST")
            request(requestParams,function(error,response,body){
                if(body){
                    console.log(body+"PAN MOBILE VALIDATION RESPONSE")
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

function validateOTP(model){
    console.log(JSON.stringify(model.tags)+"::::::::::::::::")
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.otp){
                var requestParams = {
                    method  : 'POST',
                    url     : url+"ConfirmOTP?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&OTPCode="+model.tags.otp,
                    headers : headers,
                    body    : JSON.stringify({})
                }
                console.log(JSON.stringify(requestParams)+"OTP VALIDATION REQUEST")
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
                                    sender  : model.sender,
                                    next    : {},
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
                                model.tags.otpValidateReply={
                                    text    :"Oh no, OTP you entered was found to be wrong. Could you please re-enter the OTP?",
                                    type    : "button",
                                    next    : {
                                                "data": [
                                                {
                                                    "text": "Resend OTP",
                                                    "data": "Resend OTP"
                                                }
                                            ]
                                    }
                                }
                                return resolve(model);
                            }
                            else if(body.Response[0].result==="BADREQUEST"){
                                model.tags.otpValidateReply={
                                    text    :"Apologies! Something went wrong while validating your OTP.",
                                    type    : "button",
                                    next    : {
                                                "data": [
                                                {
                                                    "text": "Resend OTP",
                                                    "data": "Resend OTP"
                                                }
                                            ]
                                    }
                                }
                                return resolve(model);
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
//            if(model.tags.otp){
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
                            if(body.Response[0].reject_reason=="Wrong OTP re-enter OTP code."){
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
//            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })                   
}

function createHoldingPatternResponse(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.holdingPattern){
                model.tags.JoinAccIds=[];
                let reply={};
                reply.type="generic";
                reply.text="You can choose from the following holding patterns."
                reply.next={
                        data: []
                }
                for(let i=0;i<5;i++){
                    if(model.tags.holdingPattern[i]){
                        reply.next.data.push({
                            title   :model.tags.holdingPattern[i].JoinHolderName,
                            text    :"",
                            buttons :[
                                {
                                    text:"Use this",
                                    data:model.tags.holdingPattern[i].JoinAccId
                                }
                            ]
                        })
                        model.tags.JoinAccIds.push(model.tags.holdingPattern[i].JoinAccId);
                    }
                }
                model.reply=reply;
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.")
        }
    })
}

function validateHoldingPattern(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                if(model.tags.JoinAccIds.includes(model.data.match(/\d+/g)[0])){
                    model.tags.JoinAccId = model.data.match(/\d+/g)[0]
                    delete model.stage;
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.")
        }
    })
}

function sendExternalData(data){
    console.log("send external")
    return new Promise(function(resolve,reject){
        try{
            let projectId;
            if(data.sender&&data.sender.split("|").length===3){
                projectId=data.sender.split("|")[1]
                request({
                    uri     :'http://bot.meetaina.com/backend/'+projectId+'/external/send',
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
            else{
                return reject("Something went wrong.");    
            }
        }catch(e){
            console.log(e)
            return reject("Something went wrong.")
        }
    });
}