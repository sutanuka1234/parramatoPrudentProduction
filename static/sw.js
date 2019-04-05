
        importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

        if (workbox) {
            console.log("Yay! Workbox is loaded 🎉");
        } else {
            console.log("Boo! Workbox didn't load 😬");
        }

        const matchFunction = ({url, event}) => {
            if(url && url.href&&url.href.includes("socket")&&url.host!="cdnjs.cloudflare.com"){
                return false;
            }
            return true;
        };
        workbox.routing.registerRoute(
            matchFunction,
            workbox.strategies.networkFirst()
        );


    
        self.addEventListener("push", e => {
            const data = e.data.json();
            console.log("Push Recieved...");
            self.registration.showNotification(data.title, {
                body: data.text,
                icon: "https://development.jubi.ai/icon.png"
            });
        });

        self.addEventListener('notificationclick', function(event) {
          event.notification.close();
          event.waitUntil(
            clients.openWindow("https://development.jubi.ai")
          );
        })

    