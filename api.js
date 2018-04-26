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

function getAMC(session, joinAccId, callback){
	var obj = {
		method 	: 'POST',
		headers	: headers,
		url 	: url+'GetAMC?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	request(obj, callback)
}

// getAMC('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', (err, http, response)=>{
// 	console.log(response)
// })

function getScheme(session, joinAccId, fundsType, amcId, schemeOption, subNature, callback){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Purchase&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
	}
	request(obj, callback)
}

// getScheme('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '1', '400040', '1', '5', (err, http, response)=>{
// 	console.log(response)
// })

function getFolio(session, joinAccId, schemeCode, amcId, callback){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId
	}
	request(obj, callback)
}

// getFolio('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '8408', '400040', (err, http, response)=>{
// 	console.log(response)
// })

function insertBuyCart(session, joinAccId, schemeCode, schemeName, amcId, dividendOption, amount, folioNo, callback){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+schemeName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&IsAgreeTerms=1&IsEKYCTermCondition=1'
	}
	request(obj, callback)
}

// insertBuyCart('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '8408', 'Axis Asset Management Company Ltd', '400040', '0', '5000', '0', (err, http, response)=>{
// 	console.log(response)
// })

function bankMandate(session, joinAccId, schemeCode, mandateId, amount, callback){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'MakePaymentUsingMandate?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'MandateID='+mandateId+'&Amount='+amount+'&IsThirdPartyBankTerms=1'
	}
	request(obj, callback)
}

module.exports = {
	panMobile 	: panMobile,
	otp 		: otp,
	getAMC 		: getAMC,
	getScheme  	: getScheme,
	getFolio 	: getFolio,
	insertBuyCart : insertBuyCart,
	bankMandate : bankMandate
}