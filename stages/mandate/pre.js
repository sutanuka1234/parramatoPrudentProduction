module.exports={
    showMandate:showMandate
}

function showMandate(model){
    return new Promise(function(resolve,reject){
        try{
            if(     model.tags.mandateDetails
              &&   !model.tags.mandateCards){
                let reply={
                    type:"generic",
                    text:"You can choose from the following mandates.",
                    next:{
                        data:[]
                    }
                }
                for(let i=0;i<model.tags.mandateDetails.length;i++){
                    if(model.tags.mandateDetails[i]){
                        reply.next.data.push({
                            title   :model.tags.mandateDetails[i].BankAccount,
                            text    :model.tags.mandateDetails[i].MandateID,
                            buttons :[
                                {
                                    text:"Use this",
                                    data:model.tags.mandateDetails[i].MandateID
                                }
                            ]
                        })
                        model.tags.mandateIds.push(model.tags.mandateDetails[i].MandateID);
                    }
                }
                model.tags.mandateCards=reply;
                model.reply=reply;
            }
            else{
                model.reply=model.tags.mandateCards;
            }
            return resolve(model);
        }catch(e){
            console.log(e);
            return reject("Something went wrong.")
        }
    })
}