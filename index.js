require("bot-middleware-jubi").Server({
    root:"https://development.jubi.ai",
    socketDomain: "wss://development.jubi.ai",
    socketPath: '/prudent-uat/socket',
    socketLocalPath: '/socket',
    httpPort:8125,
    cluster:false,
    dbUri: 'mongodb://jubi:jubi@uatmongo.parramato.com:27017/prudentDb',
    staticDirectory:__dirname+"/static",
    adapterPath:"/adapter",
    adapterDirectory:__dirname+"/adapter",
    projectId:"ClonePrudentProduction_432543815345",
    // dashbotKey:"VxtYPVW6168LIiXwqpIku9wE",
    directMultiplier:1,
    fallbackMultiplier:0.8,
    passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
    timeoutSeconds:60,
    fcmServerKey:"AAAA92XUPzE:APA91bEZbt6BSf9GNeG7SHUbpkNMcOVk8kPct6NINxuKn2ukZ-GLQjBTJbORT_OTutiR6yXxECVRE05GO0taz5SrqRW1t-llitQO2rxI6LYUnPb7wSQtL1Pq0CO--vn_kxXMgWxK4II-",
    firebaseWebConfig:{
        apiKey: "AIzaSyAWRgLmcIz4EZCrq_B1BVIk8a_RFmKHYeo",
        authDomain: "prudent-uat.firebaseapp.com",
        databaseURL: "https://prudent-uat.firebaseio.com",
        projectId: "prudent-uat",
        storageBucket: "",
        messagingSenderId: "1062565330737"
    }
},()=>{
    //TO DO AFTER INITIALIZATION
})