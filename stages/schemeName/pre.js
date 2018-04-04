var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const url=common.url;

module.exports={
    showSchemes:showSchemes
}

function showSchemes(model){
    return new Promise(function(resolve,reject){
        try{
            if(!model.tags.fundsType){
                if(model.tags.schemeCategory==="Suggested Funds"){
                    model.tags.fundsType=1;
                }
                else if(model.tags.schemeCategory==="All Funds"){
                    model.tags.fundsType=2;
                }
                else if(model.tags.schemeCategory==="NFO"||model.tags.schemeCategory==="FMP"){
                    model.tags.fundsType=3;
                }
            }
            if(!model.tags.schemeOption){
                if(model.tags.schemeType==="Growth"){
                    model.tags.schemeOption=1;
                }
                else if(model.tags.schemeType==="Dividend"){
                    model.tags.schemeOption=2;
                }
                else if(model.tags.schemeType==="Bonus"){
                    model.tags.schemeOption=3;
                }
            }
            if(!model.tags.madeSchemeRequest){
                request({
                    uri     :"https://www.prudentcorporate.com/cbapi/GetScheme?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&FundsType="+model.tags.fundsType+"&InvestmentType=Purchase&AMCId="+model.tags.amcId+"&SchemeOption="+model.tags.schemeOption+"&SubNature="+model.tags.subnatureId,
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
                            body=JSON.parse(body);
                            if(body.Response){
                                if(body.Response[0].result){
                                    console.log(JSON.stringify(body.Response[0])+"--------");
                                    return reject("Something went wrong."); 
                                }
                                else{
                                    model.tags.madeSchemeRequest=true;
                                    model.tags.schemeDetails=body.Response[0];
                                    //model.tags.folioDetails=body.Response[1];
                                    let reply={};
                                    reply.type="generic";
                                    reply.text="You can choose from the following Schemes."
                                    reply.next={
                                        data:[]  
                                    };
                                    model.tags.schemeCodes=[]
                                    for(let i=0;i<10;i++){
                                        if(model.tags.schemeDetails[i]){
                                            reply.next.data.push({
                                                title   :model.tags.schemeDetails[i].SchemeName,
                                                text    :"",
                                                buttons :[
                                                    {
                                                        text:"Use this",
                                                        data:model.tags.schemeDetails[i].SCHEMECODE
                                                    }
                                                ]
                                            })
                                            model.tags.schemeCodes.push(model.tags.schemeDetails[i].SCHEMECODE);
                                        }
                                    }
                                    model.tags.schemeCards=reply;
                                    model.reply=reply;
                                    return resolve(model);
                                }
                            }
                        }
                        catch(e){
                            console.log(e);
                            return reject("Something went wrong. Catch");
                        }
                    }
                })
            }
            else{
                model.reply=model.tags.schemeCards;
                return resolve(model);
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}