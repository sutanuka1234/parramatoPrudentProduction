'use strict'
module.exports={
	main:main
}

let obj = {
	start : start
}

function main(req, res){
	return new Promise(function(resolve, reject){
		console.log(req.url.split('/')[3])
		obj[req.url.split('/')[3]](req.body)
		.then((data)=>{
            console.log(JSON.stringify(data)+"-------------------===========================")
			res.send(data)
		})
		.catch((e)=>{
			console.log(e)
		})
	})
}

function start(model){
	return new Promise(function(resolve, reject){
    try{
        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;
        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
        var hoursIST = ISTTime.getHours()
        var minutesIST = ISTTime.getMinutes()
        var dayIST = ISTTime.getDay()
        console.log(dayIST)
        console.log(hoursIST)
        console.log(minutesIST)
        let greet;

        if(hoursIST < 12){
            greet = " Good Morning"
        }
        else if(hoursIST < 17){
            greet = " Good Afternoon"
        }
        else{
            greet = " Good Evening"
        }
        
        model.reply={
            type : "quickReply",
            //text : `Hi ${greet}, If you are not an existing investor click here - https://www.fundzbazar.com/signup to register. If you are an existing investor you can do the following right now!`,
             text : "Hello "+greet+" If you are not an existing investor click here - https://www.fundzbazar.com/signup to register. If you are an existing investor you can do the following right now!",
            next : {
                data : [
                    {
                        data : 'Invest Now',
                        text : 'Invest Now'
                    },
                    {
                        data: 'Start SIP',
                        text: 'Start SIP'
                    },
                    {
                        data : 'Redeem Now',
                        text : 'Redeem Now'
                    },
                    {
                        data : 'Switch Now',
                        text : 'Switch Now'
                    },
                    {
                        data : "STP Now",
                        text : 'STP Now'
                    },
                    {
                        data : 'Get account statement',
                        text : 'Get account statement'
                   },
                    {
                        data : 'Transaction Details',
                       text : 'Transaction Details'
                    },
                    {
                        data : "Nach Mandate",
                        text : 'Nach Mandate'
                    },
                    {
                        data : 'FAQs',
                        text : 'FAQs'
                    },
                    {
                        data : "Talk to customer care",
                        text : "Talk to customer care"
                    }
                ]
            }
        }
		resolve(model)
    }
    catch(e){
        console.log(e)
        return reject(e);
    }
	})
}
