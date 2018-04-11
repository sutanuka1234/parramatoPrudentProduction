var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const url=common.url;

module.exports={
    showFolio:showFolio
}

function showFolio(model){
    console.log("FOLIO PRE")
    return new Promise(function(resolve, reject){
        if(!model.tags.folioRequestMade){
            var getFolioReq={
                method  : 'POST',
                url     : url+"GetFolioNo?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&AMCId="+model.tags.amcId,
                headers : headers,
                body    : JSON.stringify({})
            }
            request(getFolioReq,(err,http,body)=>{
                if(err){
                    console.log(err+"ERROR");
                    return reject("failed");
                }
                else{
                    try{    
                        console.log("get folio " + body)
                        body=JSON.parse(body);
                        if(     body.Response
                           &&   body.Response[0]
                           &&   body.Response[0].result
                          ){
                            console.log(body.Response[0].result);
                            return reject(model);
                        }
                        else{
                            model.tags.folioDetails= body["Response"];
                            model.tags.foliosArray=[];
                            let reply={
                                type:"generic",
                                text:"Choose from the following folios.",
                                next:{
                                    data:[]  
                                }
                            };

                            for(let i=0;i<model.tags.folioDetails.length;i++){
                                console.log(JSON.stringify(model.tags.folioDetails[i])+"-----")
                                if(model.tags.folioDetails[i]){
                                    reply.next.data.push({
                                        title   :model.tags.folioDetails[i].FolioNo,
                                        text    :"",
                                        buttons :[
                                            {
                                                text:"Use this",
                                                data:model.tags.folioDetails[i].FolioNo
                                            }
                                        ]
                                    })
                                    model.tags.foliosArray.push(parseInt(model.tags.folioDetails[i].FolioNo));
                                }
                            }
                            model.reply=reply;
                            model.tags.folioRequestMade=true;
                            model.tags.folioCards=reply;
                            console.log(JSON.stringify(model.reply)+"FOLIOS")
                            return resolve(model);
                        }
                    }
                    catch(e){
                        console.log(e);
                        return reject("Something went wrong.")
                    }
                }
            })
        }
        else{
            console.log("FOLIO REQUEST MADE")
            model.relpy=model.tags.folioCards;
            return resolve(model);
        }
    })
}