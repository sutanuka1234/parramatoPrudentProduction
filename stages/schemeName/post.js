module.exports={
    validateSchemeName:validateSchemeName
}

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