require("bot-middleware-jubi").createAdapter("intent",{
    operationFileNames:{
        validate:"post",
        decorate:"pre"
    },
    adapterDirectory:__dirname+"/adapter"
})