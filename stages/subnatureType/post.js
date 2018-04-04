module.exports={
    validateSubnatureOptions:validateSubnatureOptions
}

var stringSimilarity = require('string-similarity');

function validateSubnatureOptions(model){
    console.log("SUBNATURE TYPE POST");
    return new Promise(function(resolve,reject){
        try{
            if(model.data.toLowerCase().includes("cancel")){
                return reject(model);  
            }
            else{
                if(model.tags.subnatureOptionNames){
                    if(model.tags.confirmSubnature){
                        if(model.data.toLowerCase().includes("yes")){
                            for(let i=0;i<model.tags.subnatureOptions.length;i++){
                                if(model.tags.subnatureMatch===model.tags.subnatureOptions[i].SubNature){
                                    model.tags.subnature=model.tags.subnatureOptions[i].SubNature;
                                    model.tags.subnatureId=model.tags.subnatureOptions[i].ID;
                                    delete model.stage;
                                }
                            }  
                        }
                        delete model.tags.subnatureMatch;
                        delete model.tags.confirmSubnature;
                    }
//                    else{
                    var match = stringSimilarity.findBestMatch(model.data,model.tags.subnatureOptionNames);
                    if(     match
                       &&   match.bestMatch
                       &&   match.bestMatch.rating
                       &&   ((match.bestMatch.rating)==1)){
                        model.tags.subnatureMatch=match.bestMatch.target;
                        for(let i=0;i<model.tags.subnatureOptions.length;i++){
                            if(model.tags.subnatureMatch===model.tags.subnatureOptions[i].SubNature){
                                model.tags.subnature=model.tags.subnatureOptions[i].SubNature;
                                model.tags.subnatureId=model.tags.subnatureOptions[i].ID;
                                delete model.stage;
                            }
                        }
                    }
                    else if (match
                       &&   match.bestMatch
                       &&   match.bestMatch.rating
                       &&   (match.bestMatch.rating>0)
                       &&   (match.bestMatch.rating<1)){
                        model.tags.subnatureMatch=match.bestMatch.target;
                        model.tags.reaffirm=match.bestMatch.target;
                    }
//                    }
                }
                return resolve(model);
            }
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }    
    })
}