module.exports={
    validateSchemeType:validateSchemeType
}


function validateSchemeType(model){
	console.log("VALIDATE SCEHME TYPE")
    return new Promise(function(resolve,reject){
        try{
        	 console.log("*********************")
        	 console.log("Type " + JSON.stringify(model.tags.showOptions))
        	    let containsMatch;
        	 	for(let typeIndex; typeIndex < model.tags.showOptions; typeIndex++) {
        	 		console.log("*********************")
        	 		console.log("model.tags.showOptions[typeIndex].toLowerCase()" + model.tags.showOptions[typeIndex].toLowerCase())
        	 		console.log("*********************")
        	 		if(model.data.toLowerCase().includes(model.tags.showOptions[typeIndex].toLowerCase())){
        	 			containsMatch = true
        	 		} 
        	 	}
        	    if(containsMatch) {
        	    	console.log("containsMatch" + containsMatch)
	        	 	delete model.stage;
	        	 	return resolve(model);
        	    } else {
        	    	console.log("containsMatch" + containsMatch)
        	    	return resolve(model)
        	    }


        } catch(e){
        	console.log(e)
        	return reject(e)
        }
    })
}