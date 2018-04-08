var common=require('./../../common.js');
var request=require('request');
var HashMap = require('hashmap');
const headers=common.headers;
const url=common.url;

module.exports={
    getAmc:getAmc
}

function getAmc(model){
    return new Promise(function(resolve, reject){
        try{
            if(model.tags.AMCNames){
                if(model.tags.match){
                    console.log("MATCH EXISTS")
                    model.reply={
                        type:"quickReply",
                        text:"Did you mean "+model.tags.match +" Mutual Fund",
                        next:{
                                "data": [
                                    {
                                        "text": "yes",
                                        "data": "yes"
                                    },
                                    {
                                        "text": "no",
                                        "data": "no"
                                    }
                                ]
                        }
                    }
//                    delete model.tags.match;
                    model.tags.amcConfirmation=true;
                }
                else{
                    console.log("MATCH DOES NOT EXIST")
                    model.reply={
                        type:"text",
                        text:"Please type in amc again.",
                        next:{}
                    }
                    if(model.tags.amcConfirmation){
                        delete model.tags.amcConfirmation;
                    }
                }
                return resolve(model);
            }
            else{
                console.log("******************************************************")
                console.log("******************************************************")
                console.log("model.tags.JoinAccId" + model.tags.JoinAccId)
                console.log("******************************************************")
                console.log("******************************************************")
                var getAmcReq={
                    method  : 'POST',
                    url     : url+"GetAMC?IPAddress=192.168.0.102&SessionId="+model.tags.sessionId+"&JoinAccId="+model.tags.JoinAccId,
                    headers : headers,
                    body    : JSON.stringify({})
                }
                request(getAmcReq,(err,http,body)=>{
                    if(err){
                        console.log("get amc" + err)
                        return reject("failed");
                    }
                    else{
                        try{
                            console.log("get Amc ==========" + body)
                            if(body){
                                try{
                                    body= JSON.parse(body);
                                    if( body.Response
                                      &&body.Response[0]){
                                        if(body.Response[0].result){
                                            if(body.Response[0].result==="FAIL"){
                                                let reply={
                                                    text    : body.Response[0].result.reject_reason,
                                                    type    : "text",
                                                    next    :{}
                                                };
                                                model.reply=reply;
                                                return resolve(model);
                                            }
                                            else if(body.Response[0].result==="BADREQUEST"){
                                                let reply={
                                                    text    : "Something went wrong while getting the AMC's.",
                                                    type    : "text",
                                                    next    :{}
                                                };
                                                model.reply=reply;
                                                return resolve(model);
                                            }
                                        }
                                        else if(body["Response"].length===3){
                                            let modelData = {
                                               amcs : body['Response'][0],
                                               options :body['Response'][1],
                                               subnatures :body['Response'][2]
                                            }

                                            createAmcMap(modelData)
                                            .then(addOptions)
                                            .then(addSubNature)
                                            .then((final)=>{
                                               console.log("FINAL" + JSON.stringify(final.map))
                                               model.tags.map = final.map

                                                model.tags.AMCNames= body["Response"][0]
                                                let amcNamesArray = []
                                                for(let i=0;i<model.tags.AMCNames.length;i++){
                                                    amcNamesArray.push(model.tags.AMCNames[i].AMCName.replace(" Mutual Fund","").trim());
                                                }
                                                model.tags.amcNamesArray=amcNamesArray;
                                                return resolve(model);
                                            })
                                            .catch((e)=>{
                                              return reject("Something went wrong.");
                                              console.log("*****"+ e)
                                            })


                                        }
                                        else{
                                            return reject("Something went wrong.");
                                        }
                                    }
                                    else{
                                        return reject("Something went wrong.");
                                    }
                                }
                                catch(e){
                                    console.log(e);
                                    return reject("Something went wrong.");
                                }
                            }
                            else{
                                console.log(err)
                                return reject("Something went wrong.");
                            }
                        }
                        catch(e){
                            console.log(e);
                            return reject("Something went wrong.");
                        }
                    }
                })
            }
        }
        catch(e){
            console.log(e)
            return reject("Something went wrong.");
        }
    })
}

function createAmcMap(model) {
  return new Promise(function(resolve, reject) {
      var map = new HashMap();

      let amcs = model.amcs;
      console.log("got amcs")
      for(let index = 0; index <amcs.length; index++) {
        //console.log("********************" + index)
          if(map.get(amcs[index].ID)) {
             //console.log("EXISTS  UPDATE" + JSON.stringify(map.get(amcs[index].ID, null, 3)))
          } else {
             //console.log("NEW ADD 1" + index)
             let object ={}
             object.amcId = amcs[index].ID;
             object.amcName = object.AMCName
             map.set(amcs[index].ID, object);
          }

      }
      model.map = map
      return resolve(model)

  });
} 

function addOptions(model) {
  return new Promise(function(resolve, reject) {

      let options = model.options;
      let map = model.map
      console.log("got options")
      for(let index = 0; index <options.length; index++) {
          //console.log("********************" + index)
          if(map.get(options[index].AMCCode)) {
            //console.log("EXISTS  UPDATE OPTIONS")
              let object = map.get(options[index].AMCCode)
              if(!object.options) {
                 console.log("************CCCCCCCCCCCCCCCCCCCCCCCCCCCCCRRRRRRRRRRRRRRRRRRRRRRRRRRR**************************")
                console.log("**************************************")
                  object.options= []
              }
              if(!object.options) {
               
                console.log("-=========***" + JSON.stringify(object))
                let options = []
                options.push(options[index])
                object.options = options;
              } else {
                 console.log("**************************************")
                console.log("**************************************")
                 console.log(JSON.stringify(object.options) + "-=========***" + JSON.stringify(options[index]))
                 console.log("**************************************")
                  console.log("**************************************")
                   console.log("**************************************")
               //console.log("sub exits")
                if(options[index] ) {
                  object.options.push(options[index])
                }
              }
          } else {
             console.log("NEW ADD 2")
             // let object ={}
             

             // object.amcId = options[index].ID;
             // object.OPTION = object.OPTION
             // map.set(options[index], object);
          }

      }
      model.map = map
      return resolve(model)
  });
}

function addSubNature(model) {
  return new Promise(function(resolve, reject) {

      let subnatures = model.subnatures;
      let map = model.map
      console.log("got subnatures")
      for(let index = 0; index <subnatures.length; index++) {
          //console.log("********************" + index)
          if(map.get(subnatures[index].AMCCode)) {
             //console.log("EXISTS  UPDATE subnatures" + JSON.stringify(map.get(subnatures[index].AMCCode, null, 3)))
              let object = map.get(subnatures[index].AMCCode)
              if(!object.subnatures) {
                 console.log("************CCCCCCCCCCCCCCCCCCCCCCCCCCCCCRRRRRRRRRRRRRRRRRRRRRRRRRRR**************************")
                console.log("**************************************")
                  object.subnatures= []
              }
              if(!object.subnatures) {
                // console.log("sub new")
                 object.subnatures =[]
                 //console.log("-=========subnatures" + JSON.stringify(object))
                 let subnatures = []
                 subnatures.push(subnatures[index])
                 object.subnatures = subnatures
              } else {
               // console.log("sub exits")
                if(subnatures[index])
                  object.subnatures.push(subnatures[index])
              }
              map.set(subnatures[index].AMCCode, object);
          } else {
            // console.log("NEW ADD 3" +subnatures[index].AMCCode )
             // let object ={}
             

             // object.amcId = subnatures[index].ID;
             // object.OPTION = object.OPTION
             // map.set(subnatures[index], object);
          }

      }
      model.map = map
      return resolve(model)

  });
}
