module.exports=mobileDecoration;

function mobileDecoration(model){
    return new Promise(function(resolve, reject){   
        try{
            console.log("isAddStage")
            if(model.tags.isAddStage) {
                console.log("Add stage")
                model.stage = 'validateMobile';
            }
            if(model.tags.mobileValidated){
                let text;
                if(model.tags.mobileValidated&&model.tags.mobileValidated=="validated"){
                    delete model.tags.mobileValidated;
                    delete model.tags.mobileValidated;
                    return resolve(model);
                }
                else if(model.tags.mobileValidated&&model.tags.mobileValidated=="not validated"){
                    if(model.tags.mobileValidatedData){
                        text=model.tags.mobileValidatedData;
                    }
                    else{
                        text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
                    }
                }
                else{
                    text="Hey, that doesn't seem a correct one :( Kindly enter a valid mobile phone number."
                }
                // model.reply={
                //     text:text,
                //     type:"text",
                //     next:{}
                // }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}