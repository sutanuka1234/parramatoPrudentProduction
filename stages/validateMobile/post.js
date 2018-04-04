module.exports=validateMobile;

function validateMobile(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.data.match(/\d+/g)){
                let mobileData = model.data.match(/\d+/g);
                console.log(mobileData[0]+"---");
                if(mobileData && mobileData[0].toString().length==10 && mobileData instanceof Array){
                    model.tags["mobile"]=mobileData[0];
                    model.tags.mobileValidated="validated";
                    delete model.stage;
                    return resolve(model);
                }
                else{
                    model.tags.mobileValidated="not validated";
                    model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid 10 digit mobile phone number."
                    return resolve(model);
                }
            }
            else{
                model.tags.mobileValidated="not validated";
                model.tags.mobileValidatedData="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number.";
                return reject(model);
            }
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    });
}