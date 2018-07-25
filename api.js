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


function resendOtp(session){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ReSend?IPAddress=192.168.0.102&SessionId='+session
	}
	return runRequest(obj)
}


function otp(session, otp){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmOTP?IPAddress=192.168.0.102&SessionId='+session+'&OTPCode='+otp
	}
	return runRequest(obj)
}

function agreement(session, joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetAMC?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
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



function getScheme(session, joinAccId, fundsType, amcId, schemeOption, subNature,investmentType,folioNo,schemeCode,switchBool,STPBool){
	if(STPBool){
		var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=STP&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature+'&SchemeCode='+schemeCode+'&FolioNo='+folioNo
			}
	}
	else{
		if(switchBool){
			var obj = {
					method 	: 'POST',
					headers : headers,
					url 	: url+'GetScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Switch&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature+'&SchemeCode='+schemeCode+'&FolioNo='+folioNo
				}
		}
		else {
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
		}		
	}

	return runRequest(obj)
}


function getFolio(session, joinAccId, schemeCode, amcId,investmentType,switchBool,folio,STPBool){
	if(STPBool){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=STP&FolioNo='+folio
		}
	}
	else{
		if(switchBool){
			var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetFolioNo?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=Switch'
			}
		}
		else if(investmentType){
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
	}
	return runRequest(obj)
}



function getMandate(session,joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GETMANDATE?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}






 function insertBuyCartStp(session, joinAccId, dividendOption, folioNo, euin, schemeCodeFrom,schemeCodeTo,STPFrequency,STPWeek,STPMonth,installments,initAmount,amount){	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSTPBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+
		'&DivOpt='+dividendOption+
		'&FolioNo='+folioNo+
		'&EUIN='+euin+
		'&SchemeCodeFrom='+schemeCodeFrom+
		'&SchemeCodeTo='+schemeCodeTo+
		'&STPFrequency='+STPFrequency+
		'&STPWeek='+STPWeek+
		'&STPMonth='+STPMonth+
		'&Installment='+installments+
		'&STPInvestmentAmt='+amount+
		'&InitialInvestmentAmt='+initAmount+
		'&LastInstallmentFlag=Y&IsAgreeTerms=1&IsEKYCTermCondition=1'
	}
	return runRequest(obj)
}

function insertBuyCartSip(session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, day,installments, refNo,ekyc){
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSIPBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc+'&SIPDay='+day+'&NoofInstallment='+installments+'&ReferenceNO='+refNo
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



function insertBuyCart(session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, additional,tranId,ekyc){
	if(additional){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertAdditionalInvestmentBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&DivOpt='+dividendOption+'&TranID='+tranId+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc
		}
	}
	else{
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc
		}
	}
	return runRequest(obj)
}

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


function getRedemptionSchemes(session, joinAccId){

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetRedemptionScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function insertBuyCartRedeem(session, joinAccId, schemeCode, amcName, amount, folioNo,unitOrAmount){

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertRedemptionBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&Amount='+amount+'&FolioNo='+folioNo+'&RedemptionType='+unitOrAmount
	}
	return runRequest(obj)
}

function insertBuyCartSwitch(session, joinAccId, schemeCodeFrom,schemeCodeTo, switchType, amount, folioNo,dividendOption,euin,ekyc){

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSwitchBuyCart?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&DivOpt='+dividendOption+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc+'&Investment='+amount+'&SwitchType='+switchType+'&SwitchFromScheme='+schemeCodeFrom+'&SwitchToScheme='+schemeCodeTo
	}
	return runRequest(obj)
}

function confirmRedemption(session,tranId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmRedemptionTransaction?IPAddress=192.168.0.102&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}

function confirmSwitch(session,tranId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSwitchTransaction?IPAddress=192.168.0.102&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}

function confirmSTP(session,tranId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSTPTransaction?IPAddress=192.168.0.102&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}


function getSwitchScheme(session,joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetSwitchScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function getSTPScheme(session,joinAccId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetSTPScheme?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}





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
	panMobile 						: panMobile,
	resendOtp 						: resendOtp,
	otp 							: otp,
	getScheme 						: getScheme,
	agreement						: agreement,
	getFolio 						: getFolio,
	insertBuyCart 					: insertBuyCart,
	insertBuyCartSip				: insertBuyCartSip,
	confirmSip 						: confirmSip,
	getMandate 						: getMandate,
	bankMandate 					: bankMandate,
	getExistingSchemes				: getExistingSchemes,
	getRedemptionSchemes			: getRedemptionSchemes,
	insertBuyCartRedeem				: insertBuyCartRedeem,
	confirmRedemption 				: confirmRedemption,
	getSwitchScheme 				: getSwitchScheme,
	getSTPScheme 					: getSTPScheme,
	insertBuyCartSwitch 			: insertBuyCartSwitch,
	insertBuyCartStp				: insertBuyCartStp,
	confirmSwitch 					: confirmSwitch,
	confirmSTP 						: confirmSTP
}

