module.exports={
    validateSchemeType:validateSchemeType
}


function validateSchemeType(model){
	console.log("VALIDATE SCEHME TYPE")
    return new Promise(function(resolve,reject){
        try{
        	 console.log("*********************")
        	 console.log("Type " + JSON.stringify(model.tags.showOptions))
        	    
        	    for(let options of model.tags.showOptions){
        	 		console.log("*********************")
        	 		console.log("model.tags.showOptions[typeIndex].toLowerCase()" + options.OPTION.toLowerCase())
        	 		console.log("*********************")
        	 		if(model.data.toLowerCase().includes(options.OPTION.toLowerCase())){
        	 			model.tags.schemeOption = options.OPT_CODE
		        	 	delete model.stage;
		        	 	return resolve(model);
        	 		} 
        	 	}

    	    	console.log("containsMatch no match")
    	    	return resolve(model)
        	    


        } catch(e){
        	console.log(e)
        	return reject(e)
        }
    })
}