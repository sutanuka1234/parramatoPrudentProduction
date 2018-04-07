module.exports={
    vaildateSelectedAmc:vaildateSelectedAmc
}

var stringSimilarity = require('string-similarity');

function vaildateSelectedAmc(model){
    return new Promise(function(resolve,reject){
        try{
            var match = stringSimilarity.findBestMatch(model.data.replace("invest",""), model.tags.amcNamesArray);
            if(model.tags.amcConfirmation){
                console.log("POST CONFIRMATION")
                if(model.data.toLowerCase().includes("yes")){
                    for(let i=0;i<model.tags.AMCNames.length;i++){
                        if(model.tags.match+" Mutual Fund"===model.tags.AMCNames[i].AMCName){
                            model.tags.amcName=model.tags.match+" Mutual Fund";
                            model.tags.amcId=model.tags.AMCNames[i].ID
                            console.log("get subnatures for amc")
                              console.log("**************************************")
                              console.log("**************************************")
                               console.log("**************************************")                           
                            console.log("SUBNATURE" + JSON.stringify(final.map["_data"][model.tags.AMCNames[i].ID][1].subnatures))
                         console.log("**************************************")
                          console.log("**************************************")
                           console.log("**************************************")
                            model.tags.subnatureOptions=final.map["_data"][model.tags.AMCNames[i].ID][1].subnatures;
                            model.tags.subnatureOptionNames=[];
                            for(let j=0;j<model.tags.subnatureOptions.length;j++){
                                model.tags.subnatureOptionNames.push(model.tags.subnatureOptions[j].SubNature)
                            }

                            delete model.stage;
                            break;
                        }
                    }
                }
                else if(model.data.toLowerCase().includes("no")){
                    if( match
                       &&match.bestMatch
                       &&match.bestMatch.rating
                       &&((match.bestMatch.rating)>0.2)){
                        model.tags.match=match.bestMatch.target;
                    }
                    else{
                        if(model.tags.match){
                            delete model.tags.match;
                        }
                    }
                    return resolve(model);//to be removed and tested
                }
                else{
                    if( match
                       &&match.bestMatch
                       &&match.bestMatch.rating
                       &&((match.bestMatch.rating)>0.2)){
                        model.tags.match=match.bestMatch.target;
                    }
                    else{
                        if(model.tags.match){
                            delete model.tags.match;
                        }
                    }
                }
                delete model.tags.amcConfirmation;
            }
            else{
                console.log("SEARCH FOR MATCH")
                if(     match
                   &&   match.bestMatch
                   &&   match.bestMatch.rating
                   &&   ((match.bestMatch.rating)>0.2)){
                    model.tags.match=match.bestMatch.target;
                }
                else{
                    if(model.tags.match){
                        delete model.tags.match;
                    }
                }
            }
            return resolve(model);
        }
        catch(e){
            console.log(e);
            return reject("Something went wrong.");
        }
    });
}