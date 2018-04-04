module.exports={
    validateMobile:validateMobile   
};

function validateMobile(model){
    return new Promise(function(resolve, reject){
        try{
            if(     model.data.match(/\d+/g)
               &&   model.data.match(/\d+/g) instanceof Array
               &&   model.data.match(/\d+/g)[0]
               &&   model.data.match(/\d+/g)[0].toString().length==10
              ){
                model.tags["mobile"]=model.data.match(/\d+/g)[0];
                delete model.stage;
                return resolve(model);
            }
            return reject(model);
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    });
}