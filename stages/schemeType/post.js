module.exports={
    validateSchemeType:validateSchemeType
}


function validateSchemeType(model){
	console.log("VALIDATE SCEHME TYPE")
    return new Promise(function(resolve,reject){
        try{
        	 console.log("*********************")
        	 console.log("Type " + JSON.stringify(model.tags.showOptions))
        	    let containsMatch=false;
        	    for(let options of model.tags.showOptions){
        	 		console.log("*********************")
        	 		console.log("model.tags.showOptions[typeIndex].toLowerCase()" + options.OPTION.toLowerCase())
        	 		console.log("*********************")
        	 		if(model.data.toLowerCase().includes(options.OPTION.toLowerCase())){
        	 			containsMatch = true
        	 		} 
        	 	}
        	    if(containsMatch===true) {
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