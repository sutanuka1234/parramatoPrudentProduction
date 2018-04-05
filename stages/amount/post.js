var common=require('./../../common.js');
const sendExternalData=common.sendExternalData;

module.exports={
    validateAmount:validateAmount
}

function validateAmount(model){
    console.log("AMOUNT POST----");
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                model.data=Math.round(model.data.match(/\d+/g)[0]);
                if(     model.data%100==0
                    &&  model.data<=parseInt(model.tags.schemeData.MaximumInvestment)
                    &&  model.data>=parseInt(model.tags.schemeData.MinimumInvestment)){
                    model.tags.amount=model.data;
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
                    return reject("Invalid Amount.");
                }
            }
            else{
                return reject("Invalid Amount.");  
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}