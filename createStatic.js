require("bot-middleware-jubi").createFrontend({
    root:"https://prudentparramato/",
    socketDomain: "wss://prudentparramato/",
    socketPath: '/prudentparramato//socket',
    staticDirectory:__dirname+"/static",
    projectId:"parramatoPrudentProduction_571731615155",
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