var request=require('request');

const headers={
    UserName    : "Prudent",
    Password    : "Prudent@123"
}

const url="https://www.prudentcorporate.com/cbapi/";

function sendExternalData(data){
    console.log("send external")
    return new Promise(function(resolve,reject){
        try{
            let projectId;
            if(data.sender&&data.sender.split("|").length===3){
                projectId=data.sender.split("|")[1]
                request({
                    uri     :'http://bot.meetaina.com/backend/'+projectId+'/external/send',
                    json    :data,
                    method  :'POST'   
                },(err,req,body)=>{
                    if(err){   
                        console.log(err)
                        return reject("Something went wrong.");
                    }
                    else{
                        console.log(body);
                        return resolve(body);
                    }
                })		
            }
            else{
                return reject("Something went wrong.");    
            }
        }catch(e){
            console.log(e)
            return reject("Something went wrong.")
        }
    });
}

module.exports={
    headers         :headers,
    url             :url,
    sendExternalData:sendExternalData
}