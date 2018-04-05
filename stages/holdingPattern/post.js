var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const url=common.url;

module.exports={
    validateHoldingPattern  :validateHoldingPattern,
    makeGetAmcRequest       :makeGetAmcRequest
};

function validateHoldingPattern(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                if(model.tags.JoinAccIds.includes(model.data.match(/\d+/g)[0])){
                    model.tags.JoinAccId = model.data.match(/\d+/g)[0]
//                    delete model.stage;
                    return resolve(model);
                }
            }
            return reject(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.")
        }
    })
}

function makeGetAmcRequest(model){
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
            try{
                console.log("get Amc " + body)
                if(body){
                    try{
                        body= JSON.parse(body);
                        if( body.Response
                          &&body.Response[0]){
                            if(body.Response[0].result){
                                if(body.Response[0].result==="FAIL"){
                                    let reply={
                                        text    : body.Response[0].result.reject_reason,
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
                                        return reject("Something went wrong.");
                                    })
                                }
                                else if(body.Response[0].result==="BADREQUEST"){
                                    let reply={
                                        text    : "Something went wrong while getting the AMC's.Ending the journey",
                                        type    : "text",
                                        sender  : model.sender,
                                        language: "en"
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
                                }
                            }
                            else if(body["Response"].length===3){
                                model.tags.AMCNames= body["Response"][0]
                                let amcNamesArray = []
                                for(let i=0;i<model.tags.AMCNames.length;i++){
                                    amcNamesArray.push(model.tags.AMCNames[i].AMCName.replace(" Mutual Fund","").trim());
                                }
                                model.tags.amcNamesArray=amcNamesArray;
                                model.tags.subnatureOptions=body["Response"][2];
                                model.tags.subnatureOptionNames=[];
                                for(let j=0;j<model.tags.subnatureOptions.length;j++){
                                    model.tags.subnatureOptionNames.push(model.tags.subnatureOptions[j].SubNature)
                                }
                                return resolve(model);
                            }
                            else{
                                return reject("Something went wrong.");
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
                    console.log(err)
                    return reject("Something went wrong.");
                }
            }
            catch(e){
                console.log(e);
                return reject("Something went wrong.");
            }
        }
    })
}