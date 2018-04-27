var request = require('request')

var headers = {
    UserName    : "Prudent",
    Password    : "Prudent@123"
}
var url = 'https://www.prudentcorporate.com/cbapi/'
var data = require('./words.json')

function panMobile(mobile, pan){
	var obj = {
			method  : 'POST',
	        headers : headers,
	        url     : url+'AuthenticatePANMobile?IPAddress=192.168.0.102&PanNo='+pan+'&MobileNo='+mobile
		}
	
	return runRequest(obj)
}

// panMobile('9998367321', 'CPRPP3661J').then(data=>{console.log(data)}).catch(err=>console.log(err))

function otp(session, otp){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmOTP?IPAddress=192.168.0.102&SessionId='+session+'&OTPCode='+otp
	}
	return runRequest(obj)
}

// otp('7C772321713D21713D21713D21713D21713D21713D21713D7C7723266B7C', '123456').then(data=>{console.log(data)}).catch(err=>console.log(err))

// function getAMC(session, joinAccId, callback){
// 	var obj = {
// 		method 	: 'POST',
// 		headers	: headers,
// 		url 	: url+'GetAMC?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
// 	}
// 	request(obj, callback)
// }

// getAMC('7C772321713D21713D21713D21713D21713D21713D21713D7C77237C7723', '334', (err, http, response)=>{
// 	console.log(response)
// })

// function getScheme(session, joinAccId, fundsType, amcId, schemeOption, subNature, callback){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Purchase&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
// 	}
// 	request(obj, callback)
// }

// getScheme('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '1', '400040', '1', '5', (err, http, response)=>{
// 	console.log(response)
// })

// function getFolio(session, joinAccId, schemeCode, amcId, callback){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId
// 	}
	
// 	return runRequest(obj)
// }

// // getFolio('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '8408', '400040', (err, http, response)=>{
// // 	console.log(response)
// // })

// function insertBuyCart(session, joinAccId, schemeCode, schemeName, amcId, dividendOption, amount, folioNo, callback){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url+'InsertBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+schemeName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&IsAgreeTerms=1&IsEKYCTermCondition=1'
// 	}
	
	
// 	return runRequest(obj)
// }

// // insertBuyCart('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '8408', 'Axis Asset Management Company Ltd', '400040', '0', '5000', '0', (err, http, response)=>{
// // 	console.log(response)
// // })

// function bankMandate(session, joinAccId, schemeCode, mandateId, amount, callback){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url+'MakePaymentUsingMandate?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'MandateID='+mandateId+'&Amount='+amount+'&IsThirdPartyBankTerms=1'
// 	}
	
// 	return runRequest(obj)
// }

function runRequest(obj){
	return new Promise(function(resolve, reject){
		request(obj, (error,response,body)=>{
			if(error){
				return reject(error);
			}
			return resolve({response:response,body:body})
		})
	})
}

module.exports = {
	panMobile 	: panMobile,
	otp 		: otp
	// getFolio 	: getFolio,
	// insertBuyCart : insertBuyCart,
	// bankMandate : bankMandate
}
