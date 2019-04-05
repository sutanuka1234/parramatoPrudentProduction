require("bot-middleware-jubi").createFrontend({
    root:"https://development.jubi.ai",
    socketDomain: "wss://development.jubi.ai",
    socketPath: '/prudent-uat/socket',
    staticDirectory:__dirname+"/static",
    projectId:"ClonePrudentProduction_432543815345",
    passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
    firebaseWebConfig:{
        apiKey: "AIzaSyAWRgLmcIz4EZCrq_B1BVIk8a_RFmKHYeo",
        authDomain: "prudent-uat.firebaseapp.com",
        databaseURL: "https://prudent-uat.firebaseio.com",
        projectId: "prudent-uat",
        storageBucket: "",
        messagingSenderId: "1062565330737"
    },
    iconPath:"/icon.png"
 })