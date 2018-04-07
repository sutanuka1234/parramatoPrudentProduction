var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const url=common.url;

module.exports={
    getAmc:getAmc
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
                        try{
                            console.log("get Amc ==========" + body)
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
                                                    next    :{}
                                                };
                                                model.reply=reply;
                                                return resolve(model);
                                            }
                                            else if(body.Response[0].result==="BADREQUEST"){
                                                let reply={
                                                    text    : "Something went wrong while getting the AMC's.",
                                                    type    : "text",
                                                    next    :{}
                                                };
                                                model.reply=reply;
                                                return resolve(model);
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
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    })
}