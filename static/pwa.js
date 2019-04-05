
    if("serviceWorker" in navigator){
        try{
            send();

        }
        catch(e){
            console.log(e);
        }
    }


    

    async function send() {
        const register = await navigator.serviceWorker.register("sw.js", {
            scope: "/"
        });

    }



  // Initialize Firebase
      const config = {
        apiKey: "AIzaSyAWRgLmcIz4EZCrq_B1BVIk8a_RFmKHYeo",
        authDomain: "prudent-uat.firebaseapp.com",
        databaseURL: "https://prudent-uat.firebaseio.com",
        projectId: "prudent-uat",
        storageBucket: "",
        messagingSenderId: "1062565330737"
      };

        runFirebase()
        .then(runSubscription)
        .catch(err => console.error(err));

      function runFirebase(){
        return new Promise(async (resolve,reject)=>{
            try{
                firebase.initializeApp(config);
                const messaging = firebase.messaging();
                await messaging.requestPermission()
                messaging.onMessage(function(payload){
                    console.log("onMessage: ",payload)
                });
                let token = await messaging.getToken()
                // console.log(token)
                return resolve(token)
            }
            catch(e){
                console.log(e)
                return reject(e)
            }
        })
          
    }

    function runSubscription(firebaseToken){
        if(window.subscriptionForWebId.getWebId()){
            console.log("Subscribed")
            subscribeForPushNotification(window.subscriptionForWebId.getWebId(),firebaseToken);
        }
        else{
            setTimeout(()=>{
                    runSubscription(window.subscriptionForWebId.getWebId(),firebaseToken)
            },2000);
        }
    }

    

    async function subscribeForPushNotification(webId,firebaseToken){

        let data={
            id:webId,
            socketId:window.socketId,
            firebaseToken:firebaseToken
        }
        await fetch('https://development.jubi.ai/subscribeForPush', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            },
            mode:"no-cors",
            credentials: 'omit'  
        });
    }


    


    