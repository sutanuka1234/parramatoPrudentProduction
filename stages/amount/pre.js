module.exports={
    amountDecoration:amountDecoration
}

function amountDecoration(model){
    console.log("AMOUNT PRE----");
    return new Promise(function(resolve,reject){
        try{
             model.reply={
                 text:"We accept amount between "+model.tags.schemeData.MinimumInvestment+" and "+model.tags.schemeData.MaximumInvestment+" in multiples of 100.",
                 type:"text",
                 next:{}
             }   
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}