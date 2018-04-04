var common=require('./../../common.js');
const sendExternalData=common.sendExternalData;

module.exports={
    validateFolio:validateFolio
};

function validateFolio(model){
    console.log("FOLIO POST");
    return new Promise(function(resolve,reject){
        try{
            if(model.data.match(/\d+/g)){
//                console.log(JSON.stringify(model.tags.foliosArray)+"//");
                if(model.tags.foliosArray.includes(parseInt(model.data.match(/\d+/g)[0]))){
                    model.tags.folioSelected=model.data.match(/\d+/g)[0]
                    delete model.stage;    
                }
            }
            else if(model.data.toLowerCase().includes("new folio")){
                model.tags.folioSelected="New Folio";
                delete model.stage;
            }
            else{
                let reply=model.tags.folioCards;
                reply.sender=model.sender;
                reply.language="en";
                sendExternalData(reply)
                .then((data)=>{
                    return reject("Invalid Folio.");
                })
                .catch((e)=>{
                    console.log(e);
                    return reject("Something went wrong.");
                })
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}