module.exports={
    validateFolio:validateFolio
};

function validateFolio(model){
    console.log("FOLIO POST");
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
                console.log(JSON.stringify(model.tags.foliosArray)+"//");
                if(model.tags.foliosArray.includes(parseInt(model.data.match(/\d+/g)[0]))){
                    model.tags.folioSelected=model.data.match(/\d+/g)[0]
                    delete model.stage;    
                }
                return resolve(model);
            }
            else if(model.data.toLowerCase().includes("new folio")){
                model.tags.folioSelected="New Folio";
                delete model.stage;
                return resolve(model);
            }
            else{
                return reject(model);
            }
            
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}