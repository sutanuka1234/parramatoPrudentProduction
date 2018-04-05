module.exports={
    validateMandate:validateMandate
}

function validateMandate(model){
    return new Promise(function(resolve,reject){
        try{
            console.log(model.data+"USER SAID AT MANDATE")
            if(     model.data.match('/NFB\d{7}')
              &&    model.data.match('/NFB\d{7}')[0]
              &&    model.data.match('/NFB\d{7}')[0].toString().length===10
              &&    model.tags.TGEditMndID.includes(model.data.match('/NFB\d{7}')[0])){
                console.log(model.data.match('/NFB\d{7}')[0]+"TGEditMndID");
                let mandateIdTemp=model.data.match('/NFB\d{7}')[0];
                for(let i=0;i<model.tags.mandateDetails.length;i++){
                    if(model.tags.mandateDetails[i].TGEditMndID===mandateIdTemp){
                        model.tags.selectedMandate=model.tags.mandateDetails[i];
                        delete model.stage;
                        return resolve(model);
                    }
                }
            }
            else{
                return reject("Select valid mandate.");
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}