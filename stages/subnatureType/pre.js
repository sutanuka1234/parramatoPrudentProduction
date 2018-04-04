module.exports={
    getSubnatureOptions:getSubnatureOptions
}

function getSubnatureOptions(model){
    console.log("SUBNATURE TYPE PRE");
    return new Promise(function(resolve,reject){
        try{
            if(model.tags.reaffirm){
                model.reply={
                    text:"Did you mean "+model.tags.reaffirm,
                    type:"button",
                    next:{
                        data:[{
                                data:"yes",
                                text:"Yes"
                            },
                             {
                                data:"no",
                                text:"No"
                            }]
                    }
                }
                model.tags.confirmSubnature=true;
                delete model.tags.reaffirm;
            }
            else{
                if(model.tags.subnatureOptions){
                    if(!model.tags.subnatureCards){
                        let reply={};
                        reply.type="generic";
                        reply.text="Please choose from the following sub-natures."
                        reply.next={
                            data: []
                        }

                        let loop=model.tags.subnatureOptions.length/3;

                        let min=0;
                        let max=3

                        for(let i=0;i<Math.ceil(loop);i++){
                            reply.next.data.push({
                                title   :"Select from the following Sub-natures.",
                                text    :"",
                                buttons :[]
                            })
                            for(let j=min;j<max;j++){
                                if(     model.tags.subnatureOptions[j]
                                   &&   model.tags.subnatureOptions[j].SubNature){
                                    reply.next.data[i].buttons.push({
                                        text:model.tags.subnatureOptions[j].SubNature,
                                        data:model.tags.subnatureOptions[j  ].SubNature
                                    })
                                }
                            }
                            min=max;
                            max=max+3;
                        }
                        model.tags.subnatureCards=reply;
                        model.reply=reply;
                    }
                    else{
                        model.reply=model.tags.subnatureCards;
                    }
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    })
}