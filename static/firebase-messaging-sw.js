
        importScripts("https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js")
        importScripts("https://www.gstatic.com/firebasejs/5.7.2/firebase-messaging.js")

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
            .catch(err => console.error(err));

          function runFirebase(){
            return new Promise(async (resolve,reject)=>{
                try{
                    firebase.initializeApp(config);
                    const messaging = firebase.messaging();
                    messaging.setBackgroundMessageHandler(function(payload) {
                      var notificationTitle = 'Got a new Message';
                      var notificationOptions = {
                        body: 'Click to open',
                        icon: 'https://newparramato.herokuapp.com/icon.png'
                      };

                      return self.registration.showNotification(notificationTitle,
                        notificationOptions);
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

    
    