module.exports={
    validateAmount:validateAmount
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
//                        delete model.stage;model stage to be added
                    }
                    else{
                        if(model.tags.schemeData.DividendOption==="Y"){
                            model.tags.divOpt=1;  
                        }
                        else if(model.tags.schemeData.DividendOption==="N"){
                            model.tags.divOpt=2;
                        }
                        else if(model.tags.schemeData.DividendOption==="Z"){
                            model.tags.divOpt=0;
                        }
                    }
                    delete model.stage;
                    return resolve(model);
                }
                else{
                    let reply={
                        type    :"text",
                        text    :"Please enter a valid amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.",
                        sender  :model.sender,
                        language:"en"
                    }; 
                    sendExternalData(reply)
                    .then((data)=>{
                        return reject("Invalid Amount.");
                    })
                    .catch((e)=>{
                        console.log(e);
                        return reject("Something went wrong.");
                    })  
                }
            }
            else{
                let reply={
                        type    :"text",
                        text    :"Please enter an amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.",
                        sender  :model.sender,
                        language:"en"
                    }; 
                sendExternalData(reply)
                .then((data)=>{
                    return reject("Invalid Amount.");
                })
                .catch((e)=>{
                    console.log(e);
                    return reject("Something went wrong.");
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