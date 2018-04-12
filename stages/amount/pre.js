module.exports={
    amountDecoration:amountDecoration
}

function amountDecoration(model){
    console.log("AMOUNT PRE----");
    return new Promise(function(resolve,reject){
        try{
             model.reply={
                 text:"How much would you like to invest? We accept minimum amount "+model.tags.schemeData.MinimumInvestment+".",
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