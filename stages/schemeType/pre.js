var common=require('./../../common.js');
var request=require('request');
const headers=common.headers;
const url=common.url;



module.exports={
    showSchemeType:showSchemeType
}

function showSchemeType(model){
	console.log("IN SHOW SHECEME TYPE" + JSON.stringify(model))
    return new Promise(function(resolve,reject){
        try{

        	if(model.tags.showOptions) {
        		console.log("options")
	               let reply={};
	                reply.type="quickReply";
	                reply.text="Please choose from the following scheme type"
	                reply.next={
	                    data: []
	                }
		        for(let typeIndex = 0; typeIndex < model.tags.showOptions.length; typeIndex++) {
		        	reply.next.data[typeIndex].buttons.push({
                                        text:model.tags.showOptions[typeIndex].OPTION,
                                        data:model.tags.showOptions[typeIndex].OPTION
                    })
		        }
		        model.reply = reply;
		        return resolve(model)
        	}
        	console.log("No scheme types")
        	return reject("No scheme types")

        }catch(e){

        }
    }
}

