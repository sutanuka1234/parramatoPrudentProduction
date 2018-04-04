module.exports={
    vaildateSelectedAmc:vaildateSelectedAmc
}

function vaildateSelectedAmc(model){
    console.log("UPDATED GET AMC POST")
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
                    return resolve(model);
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