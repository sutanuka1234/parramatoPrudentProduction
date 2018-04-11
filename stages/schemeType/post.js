module.exports={
    validateSchemeType:validateSchemeType
}


function validateSchemeType(model){
	console.log("VALIDATE SCEHME TYPE")
    return new Promise(function(resolve,reject){
        try{
        	 console.log("*********************")
        	 console.log("Type " + model.tags.showOptions)
        	    let containsMatch;
        	 	for(let typeIndex; typeIndex < model.tags.showOptions; typeIndex++) {
        	 		if(model.data.toLowerCase().includes(model.tags.showOptions[typeIndex].toLowerCase())){
        	 			containsMatch = true
        	 		} 
        	 	}
        	    if(containsMatch) {
	        	 	delete model.stage;
	        	 	return resolve(model);
        	    } else {
        	    	return resolve(model)
        	    }


        } catch(e){
        	console.log(e)
        	return reject(e)
        }
    })
}