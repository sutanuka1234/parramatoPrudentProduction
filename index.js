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
                
            case "validateSubnatureOptions":
                                        validateSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showSchemes"      :
                                        showSchemes(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
            
            case "validateSchemeName":
                                        validateSchemeName(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showFolio"        :
                                        showFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateFolio"    :
                                        validateFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
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

function validateFolio(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                console.log(model.data+"USER SAID")
                console.log(JSON.stringify(model.tags.foliosArray)+"//");
                if(model.tags.foliosArray.includes(parseInt(model.data.match(/\d+/g)[0]))){
                    model.tags.folioSelected=model.data.match(/\d+/g)[0]
                    delete model.stage;     
                }
            }
            else if(model.data.toLowerCase().includes("new folio")){
                model.tags.folioSelected="New Folio";
                delete model.stage;
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}


function showFolio(model){
    return new Promise(function(resolve, reject){
        var getFolioReq={
            method  : 'POST',
            url     : url+"GetFolioNo?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&AMCId="+model.tags.amcId,
            headers : headers,
            body    : JSON.stringify({})
        }
        
        console.log(getFolioReq.url+"GET FOLIO URL")
        
        request(getFolioReq,(err,http,body)=>{
            if(err){
                console.log(err+"ERROR")
//                console.log("get folio" + err)
                console.log("ERROORRR 1")
                return reject("failed");
            }
            else{
//              if(body){
                try{    
                console.log("get folio " + body)
                body=JSON.parse(body);
                model.tags.folioDetails= body["Response"];
                model.tags.foliosArray=[];
//                console.log("@@#####----------Folio-------------"+ body["Response"][0])
                    
                    let reply={};
                    reply.type="generic";
                    reply.text="You can choose from the following folios."
                    reply.next={
                        data:[]  
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
                    console.log(JSON.stringify(model.reply)+"FOLIOS")
                    return resolve(model);
                }
                catch(e){
                    console.log(e);
                    return reject("Something went wrong. Folio")
                }
//              }
//              else{
//                  console.log("ERROORRR 2")
//                return reject("failed")
//              }
            }
        })
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

function validateSchemeName(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                if(model.tags.schemeCodes.includes(parseInt(model.data.match(/\d+/g)[0]))){
                    for(let i=0;i<model.tags.schemeDetails.length;i++){
                        if(parseInt(model.tags.schemeDetails[i].SCHEMECODE)===parseInt(model.data.match(/\d+/g)[0])){
                            model.tags.schemeData=model.tags.schemeDetails[i];
                            console.log(JSON.stringify(model.tags.schemeData)+"++++++")
                            delete model.stage;
                            break;
                        }
                    }
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.")
        };
    })
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
//                            console.log(body);
                            body=JSON.parse(body);
                            if(body.Response){
                                if(body.Response[0].result){
                                    console.log(JSON.stringify(body.Response[0])+"--------")
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
                                    model.tags.schemeCodes = []
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
                let reply={};
                reply.type="generic";
                reply.text="You can choose from the following Schemes."
                reply.next={
                        data: []
                }
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
                model.reply=reply;
                return resolve(model);
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function validateSubnatureOptions(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.subnatureOptionNames){
                if(model.tags.confirmSubnature){
                    if(model.data.toLowerCase().includes("yes")){
                        for(let i=0;i<model.tags.subnatureOptions.length;i++){
                            if(model.tags.subnatureMatch===model.tags.subnatureOptions[i].SubNature){
                                model.tags.subnature=model.tags.subnatureOptions[i].SubNature;
                                model.tags.subnatureId=model.tags.subnatureOptions[i].ID;
                                delete model.stage;
                            }
                        }  
                    }
                    delete model.tags.subnatureMatch;
                    delete model.tags.confirmSubnature;
                }
                else{
                    var match = stringSimilarity.findBestMatch(model.data, model.tags.subnatureOptionNames);
                    if( match
                       &&match.bestMatch
                       &&match.bestMatch.rating
                       &&((match.bestMatch.rating)==1)){
                        model.tags.subnatureMatch=match.bestMatch.target;
                        for(let i=0;i<model.tags.subnatureOptions.length;i++){
                            if(model.tags.subnatureMatch===model.tags.subnatureOptions[i].SubNature){
                                model.tags.subnature=model.tags.subnatureOptions[i].SubNature;
                                model.tags.subnatureId=model.tags.subnatureOptions[i].ID;
                                delete model.stage;
                            }
                        }
                    }
                    else if(match
                       &&match.bestMatch
                       &&match.bestMatch.rating
                       &&(match.bestMatch.rating>0)
                       &&(match.bestMatch.rating<1)){
                        model.tags.subnatureMatch=match.bestMatch.target;
                        model.tags.reaffirm=match.bestMatch.target;
                    }
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function getSubnatureOptions(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.reaffirm){
                model.reply={
                    text:"Did you mean "+model.tags.reaffirm,
                    type:"button",
                    next:{
                        data:[{
                                data:"yes",
                                text:"Yes"
                            },
                             {
                                data:"no",
                                text:"No"
                            }]
                    }
                }
                model.tags.confirmSubnature=true;
                delete model.tags.reaffirm;
            }
            else{
                if(model.tags.subnatureOptions){
                    let reply={};
                    reply.type="generic";
                    reply.text="Please choose from the following sub-natures."
                    reply.next={
                        data: []
                    }

                    let loop=model.tags.subnatureOptions.length/3;

                    let min=0;
                    let max=3

                    for(let i=0;i<Math.ceil(loop);i++){
                        reply.next.data.push({
                            title   :"Select from the following Sub-natures.",
                            text    :"",
                            buttons :[]
                        })
                        for(let j=min;j<max;j++){
                            if(     model.tags.subnatureOptions[j]
                               &&   model.tags.subnatureOptions[j].SubNature){
                                reply.next.data[i].buttons.push({
                                    text:model.tags.subnatureOptions[j].SubNature,
                                    data:model.tags.subnatureOptions[j  ].SubNature
                                })
                            }
                        }
                        min=max;
                        max=max+3;
                    }
                    model.reply=reply;
                }
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
            var match = stringSimilarity.findBestMatch(model.data.replace("invest",""), model.tags.amcNamesArray);
            if(model.tags.amcConfirmation){
                console.log("POST CONFIRMATION")
                
                if(model.data.toLowerCase().includes("yes")){
                    for(let i=0;i<model.tags.AMCNames.length;i++){
//                        console.log(model.tags.match+" Mutual Fund"+"---------------"+model.tags.AMCNames[i].AMCName);
                        if(model.tags.match+" Mutual Fund"===model.tags.AMCNames[i].AMCName){
                            model.tags.amcName=model.tags.match+" Mutual Fund";
                            model.tags.amcId=model.tags.AMCNames[i].ID
                            delete model.stage;
//                            console.log(JSON.stringify(model.tags)+"TAGS")
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
                else{
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
                delete model.tags.amcConfirmation;
            }
            else{
//                var match = stringSimilarity.findBestMatch(model.data.replace("invest",""), model.tags.amcNamesArray);
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
                        model.tags.subnatureOptionNames=[];
                        for(let j=0;j<model.tags.subnatureOptions.length;j++){
                            model.tags.subnatureOptionNames.push(model.tags.subnatureOptions[j].SubNature)
                        }
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