'use strict'
var request = require('request')

var headers = {
    UserName    : "Prudent",
    Password    : "Prudent@123"
}
var url = 'https://www.prudentcorporate.com/cbapi/'

function panMobile(mobile, pan){
	var obj = {
		method  : 'POST',
        headers : headers,
        url     : url+'AuthenticatePANMobile?IPAddress=192.168.0.102&PanNo='+pan+'&MobileNo='+mobile
	}
	return runRequest(obj)
}

// panMobile('9998367321', 'CPRPP3661J').then(data=>{console.log(data)}).catch(err=>console.log(err))

function resendOtp(session){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ReSend?IPAddress=192.168.0.102&SessionId='+session
	}
	return runRequest(obj)
}

// resendOtp('7C772321713D21713D21713D21713D21713D21713D21713D2F612A266B7C').then(data=>{console.log(data.body)}).catch(err=>console.log(err))

function otp(session, otp){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmOTP?IPAddress=192.168.0.102&SessionId='+session+'&OTPCode='+otp
	}
	return runRequest(obj)
}



function getExistingSchemes(session, joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetAdditionalInvestScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

// otp('7C772321713D21713D21713D21713D21713D21713D21713D7C77232F612A', '123456').then(data=>{console.log(data)}).catch(err=>console.log(err))

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

function getScheme(session, joinAccId, fundsType, amcId, schemeOption, subNature,investmentType){
	if(investmentType){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=SIP&SIPType=N&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
		}
	}
	else{
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Purchase&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
		}
	}
	return runRequest(obj)
}

// getScheme('7C772321713D21713D21713D21713D21713D21713D21713D5E6D3A7C7723', '334', '1', '400040', '1', '5').then(data=>{console.log(data.body)}).catch(err=>console.log(err))

function getFolio(session, joinAccId, schemeCode, amcId,investmentType){
	if(investmentType){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=SIP'
		}
	}
	else{
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId
		}
	}
	return runRequest(obj)
}

// getFolio('7C772321713D21713D21713D21713D21713D21713D21713D7C772321713D', '334', '8408', '400040').then(data=>{console.log(data)}).catch(err=>console.log(err))

function getMandate(session,joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GETMANDATE?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function insertBuyCartSip(session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, day,installments, refNo){
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSIPBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition=1&SIPDay='+day+'&NoofInstallment='+installments+'&ReferenceNO='+refNo
	}
	return runRequest(obj)
}

function confirmSip(session,tranId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSIPTransaction?IPAddress=192.168.0.102&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}




function insertBuyCart(session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, additional,tranId){
	if(additional){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertAdditionalInvestmentBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&DivOpt='+dividendOption+'&TranID='+tranId+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition=1'
		}
	}
	else{
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition=1'
		}
	}
	return runRequest(obj)
}


// insertBuyCart('7C772321713D21713D21713D21713D21713D21713D21713D7C77233F6326', '334', '931', 'Franklin Templeton Asset Management (India) Private Limited', '400012', '0', '5000', '0', 'E020391').then(data=>{console.log(data.body)}).catch(err=>console.log(err))

function bankMandate(session, joinAccId, schemeCode, mandateId, amount, additional){

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'MakePaymentUsingMandate?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&MandateID='+mandateId+'&Amount='+amount+'&IsThirdPartyBankTerms=1'
	}
	if(additional){
		obj.url=obj.url+"&InvestmentType=ADDITIONALPURCHASE"
	}
	return runRequest(obj)
}
// function bankNach(session,joinAccId,schemeCode,bankId){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url+'MakePayment?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&BankId='+bankId+'&InvestmentType=PURCHASE&IsThirdPartyBankTerms=1&UserName=Prudent&Password=Prudent@123'
// 	}
// 	console.log(url+'MakePayment?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&BankId='+bankId+'&InvestmentType=PURCHASE&IsThirdPartyBankTerms=1&UserName=Prudent&Password=Prudent@123')
// 	return runRequest(obj)
// }

// bankNach('7C772321713D21713D21713D21713D21713D21713D21713D7C77235E6D3A','334','1131','316').then(data=>{console.log(data.body)}).catch(e=>{console.log(e)})
// https://www.prudentcorporate.com/cbapi/MakePayment?IPAddress=192.168.0.102&SessionId=&JoinAccId=334&SchemeCode=1131&BankId=316&InvestmentType=PURCHASE&IsThirdPartyBankTerms=1
// bankMandate('7C772321713D21713D21713D21713D21713D21713D21713D3F63263F6326', '334', '8408', '73-NFB0000073-100000', '10000').then(data=>{console.log(data.body)}).catch(e=>{console.log(e)})

function runRequest(obj){
	return new Promise(function(resolve, reject){
		console.log("reqested")
		console.log(obj)
		request(obj, (error,response,body)=>{
			if(error){
				console.log("error")
				console.log(error)
				return reject(error);
			}
			return resolve({response:response,body:body})
		})
	})
}

module.exports = {
	panMobile 	: panMobile,
	resendOtp 	: resendOtp,
	otp 		: otp,
	getScheme 	: getScheme,
	getFolio 	: getFolio,
	insertBuyCart : insertBuyCart,
	insertBuyCartSip:insertBuyCartSip,
	confirmSip:confirmSip,
	getMandate : getMandate,
	bankMandate : bankMandate,
	getExistingSchemes:getExistingSchemes
}
