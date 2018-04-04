module.exports={
    createHoldingPatternResponse:createHoldingPatternResponse
};

function createHoldingPatternResponse(model){
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.holdingPattern){
                model.tags.JoinAccIds=[];
                let reply={};
                reply.type="generic";
                reply.text="You can choose from the following holding patterns."
                reply.next={
                    data:[]
                }
                for(let i=0;i<5;i++){
                    if(model.tags.holdingPattern[i]){
                        reply.next.data.push({
                            title   :model.tags.holdingPattern[i].JoinHolderName,
                            text    :"",
                            buttons :[
                                {
                                    text:"Use this",
                                    data:model.tags.holdingPattern[i].JoinAccId
                                }
                            ]
                        })
                        model.tags.JoinAccIds.push(model.tags.holdingPattern[i].JoinAccId);
                    }
                }
                model.reply=reply;
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.")
        }
    })
}