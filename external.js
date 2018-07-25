var request=require('request');

module.exports = sendExternalData

function sendExternalData(data){
    return new Promise(function(resolve,reject){
        try{
            request({
                uri     :'http://localhost:8080/JUBI2prC24_PrudentProduction/external/send',
                json    :data,
                method  :'POST'   
            },(err,req,body)=>{
                if(err){   
                    // console.log(err)
                    return reject("Something went wrong.");
                }
                else{
                    // console.log(body);
                    return resolve(body);
                }
            })      
        }
        catch(e){
            // console.log(e)
            return reject("Something went wrong.")
        }
    });
}
