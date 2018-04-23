var request = require('request')

var headers = {
    UserName    : "Prudent",
    Password    : "Prudent@123"
}
var url = 'https://www.prudentcorporate.com/cbapi/'

function panMobile(mobile, pan, callback){
	var obj = {
		method  : 'POST',
        headers : headers,
        url     : url+'AuthenticatePANMobile?IPAddress=192.168.0.102&PanNo='+pan+'&MobileNo='+mobile
	}
	request(obj, callback)
}

// panMobile('9998367321', 'CPRPP3661J', (err, http, response)=>{
// 	response = JSON.parse(response)
// 	console.log(response.Response)
// })

function otp(session, otp, callback){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmOTP?IPAddress=192.168.0.102&SessionId='+session+'&OTPCode='+otp
	}
	request(obj, callback)
}

// otp('7C772321713D21713D21713D21713D21713D21713D21713D7C77237C7723', '123456', (err, http, response)=>{
// 	console.log(response)
// })

module.exports = {
	panMobile 	: panMobile,
	otp 		: otp
}