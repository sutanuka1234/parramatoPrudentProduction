module.exports={
    validateHoldingPattern:validateHoldingPattern
};

function validateHoldingPattern(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                if(model.tags.JoinAccIds.includes(model.data.match(/\d+/g)[0])){
                    model.tags.JoinAccId = model.data.match(/\d+/g)[0]
                    delete model.stage;
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