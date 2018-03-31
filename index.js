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
        res.json(model).status(200)})
    .catch((e)=>{res.status(203).json({message:e})})
})
   
function filter(request){
    return new Promise(function(resolve, reject){
        switch(request.params.type){
            
                
            case "validateMobile"   :   
                                        post.validateMobile(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "mobileDecoration":
                                        pre.mobileDecoration(request.body)
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
                
            case "insertBuyCart"    :
                                        insertBuyCart(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });  
                
            default                 :   
                                        return reject("No service at this domain.");
                break;
        }
    });
}

function insertBuyCart(model){
     return new Promise(function(resolve,reject){
        try{
            if(model.tags.schemeData.DividendOption==="B"){
                if(model.tags.divOps=="Reinvest"){
                    model.tags.divOpt=1
                }
                else if(model.tags.divOps=="Payout"){
                    model.tags.divOpt=2
                }
            }
            
            console.log("https://www.prudentcorporate.com/cbapi/InsertBuyCart?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&SubNature="+model.tags.subnatureId+"&SchemeName="+model.tags.schemeData.SchemeName+"&DividentOption="+model.tags.schemeData.DividendOption+"&AMCId="+model.tags.amcId+"&DivOpt="+model.tags.divOpt+"&Amount="+model.tags.amount+"&FolioNo="+model.tags.folioSelected+"&TransactionType=2")
            
            request({
                uri     :"https://www.prudentcorporate.com/cbapi/InsertBuyCart?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&SchemeCode="+model.tags.schemeData.SCHEMECODE+"&SubNature="+model.tags.subnatureId+"&SchemeName="+model.tags.schemeData.SchemeName+"&DividentOption="+model.tags.schemeData.DividendOption+"&AMCId="+model.tags.amcId+"&DivOpt="+model.tags.divOpt+"&Amount="+model.tags.amount+"&FolioNo="+model.tags.folioSelected+"&TransactionType=2",
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
                        console.log(body);
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
                        console.log(e);
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

function postValidateAmount(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.validateAmountFlag){
                if(model.tags.validateAmountFlag){
                    if(model.tags.validateAmountFlag=="validated"){
                        delete model.tags.validateAmountFlag;
                        console.log(model.tags.schemeData.DividendOption+"----------------")
                    }
                    else if(model.tags.validateAmountFlag=="not validated"){
                        model.reply={
                            text:model.tags.validatedAmountMessage,
                            type:"text",
                            next:{}
                        }  
                    }
                }
            }
            else{
                model.reply={
                    text:"Please enter an amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.",
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
    })
}

function validateAmount(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
                    model.tags.validateAmountFlag="not validated";
                    model.tags.validatedAmountMessage="Please enter a valid amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.";   
                }
            }
            else{
                model.tags.validatedAmount="not validated";
                model.tags.validatedAmountMessage="Please enter an amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.";
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}

function showFolio(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    return new Promise(function(resolve,reject){
        try{
            let reply={};
            reply.type="generic";
            reply.text="You can choose from the following folios."
            reply.next={
                data:[]  
            };
            model.tags.foliosArray=[];
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
            return reject("Something went wrong.")
        }
    })
}

function validateSchemeName(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
            if(!model.tags.madeSchemeRequest){
                obj = {
                    Growth   : 1,
                    Dividend : 2,
                    Bonus    : 3
                }
                object
                request({
                    uri     :"https://www.prudentcorporate.com/cbapi/GetScheme?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId+"&FundsType="+model.tags.fundsType+"&InvestmentType=Purchase&AMCId="+model.tags.amcId+"&SchemeOption="+obj[model.tags.SchemeType]+"&SubNature=1",
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
                                    return reject("Something went wrong."); 
                                }
                                else{
                                    model.tags.madeSchemeRequest=true;
                                    model.tags.schemeDetails=body.Response[0];
                                    model.tags.folioDetails=body.Response[1];
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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

//function validateMobile(model){
//    return new Promise(function(resolve, reject){
//        try{
//            if(model.data.match(/\d+/g)){
//                let mobileData = model.data.match(/\d+/g);
//                console.log(mobileData[0]+"---");
//                
//                if(mobileData && mobileData[0].toString().length==10 && mobileData instanceof Array){
//                    model.tags["mobile"]=mobileData[0];
//                    model.tags.mobileValidated="validated";
//                    delete model.stage;
//                    return resolve(model);
//                }
//                else{
//                    model.tags.mobileValidated="not validated";
//                    model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid 10 digit mobile phone number."
//                    return resolve(model);
//                }
//            }
//            else{
//                model.tags.mobileValidated="not validated";
//                model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number.";
//                return resolve(model);
//            }
//        }
//        catch(e){
//            console.log(e)
//            return reject("Something went wrong.");
//        }
//    });
//}

function validatePan(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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

//function mobileDecoration(model){
//    return new Promise(function(resolve, reject){   
//        try{
//            if(model.tags.mobileValidated){
//                let text;
//                if(model.tags.mobileValidated&&model.tags.mobileValidated=="validated"){
//                    delete model.tags.mobileValidated;
//                    delete model.tags.mobileValidated;
//                    return resolve(model);
//                }
//                else if(model.tags.mobileValidated&&model.tags.mobileValidated=="not validated"){
//                    if(model.tags.mobileValidatedData){
//                        text=model.tags.mobileValidatedData;
//                    }
//                    else{
//                        text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
//                    }
//                }
//                else{
//                    text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
//                }
//                model.reply={
//                    text:text,
//                    type:"text",
//                    next:{}
//                }
//            }
//            return resolve(model);
//        }
//        catch(e){
//            console.log(e);
//            return reject("Something went wrong.");
//        }
//    });
//}

function postValidatePan(model){
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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
    console.log(JSON.stringify(model)+'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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