'use strict'
var request = require('request')

var headers = {
    UserName    : "Prudent",
    Password    : "Prudent@123"
}
var url = 'https://www.prudentcorporate.com/cbapi/'

function panMobile(ip,mobile, pan){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method  : 'POST',
        headers : headers,
        url     : url+'AuthenticatePANMobile?IPAddress='+ip+'&PanNo='+pan+'&MobileNo='+mobile
	}
	return runRequest(obj)
}


function resendOtp(ip,session){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ReSend?IPAddress='+ip+'&SessionId='+session
	}
	return runRequest(obj)
}


function otp(ip,session, otp){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmOTP?IPAddress='+ip+'&SessionId='+session+'&OTPCode='+otp
	}
	return runRequest(obj)
}



function getExistingSchemes(ip,session, joinAccId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetAdditionalInvestScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}



function getScheme(ip,session, joinAccId, fundsType, amcId, schemeOption, subNature,investmentType,folioNo,schemeCode,switchBool,STPBool){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	if(STPBool){
		var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=STP&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature+'&SchemeCode='+schemeCode+'&FolioNo='+folioNo
			}
	}
	else{
		if(switchBool){
			var obj = {
					method 	: 'POST',
					headers : headers,
					url 	: url+'GetScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Switch&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature+'&SchemeCode='+schemeCode+'&FolioNo='+folioNo
				}
		}
		else {
			if(investmentType){
				var obj = {
					method 	: 'POST',
					headers : headers,
					url 	: url+'GetScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=SIP&SIPType=N&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
				}
			}
			else{
				var obj = {
					method 	: 'POST',
					headers : headers,
					url 	: url+'GetScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&FundsType='+fundsType+'&InvestmentType=Purchase&AMCId='+amcId+'&SchemeOption='+schemeOption+'&SubNature='+subNature
				}
			}
		}		
	}

	return runRequest(obj)
}


function getFolio(ip,session, joinAccId, schemeCode, amcId,investmentType,switchBool,folio,STPBool){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	if(STPBool){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'GetFolioNo?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=STP&FolioNo='+folio
		}
	}
	else{
		if(switchBool){
			var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetFolioNo?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=Switch'
			}
		}
		else if(investmentType){
			var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetFolioNo?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId+'&InvestmentType=SIP'
			}
		}
		else{
			var obj = {
				method 	: 'POST',
				headers : headers,
				url 	: url+'GetFolioNo?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&AMCId='+amcId
			}
		}		
	}
	return runRequest(obj)
}



function getMandate(ip,session,joinAccId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GETMANDATE?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}






 function insertBuyCartStp(ip,session, joinAccId, dividendOption, folioNo, euin, schemeCodeFrom,schemeCodeTo,STPFrequency,STPWeek,STPMonth,installments,initAmount,amount){	
	
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	if(!STPWeek){
		STPWeek=0
	}
	if(!STPMonth){
		STPMonth=0
	}
	if(!installments){
		installments=""
	}
	if(!initAmount){
		initAmount=0
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSTPBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+
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

function insertBuyCartSip(ip,session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, day,installments, refNo,ekyc){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	if(folioNo.includes("olio")){
		folioNo="0"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSIPBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc+'&SIPDay='+day+'&NoofInstallment='+installments+'&ReferenceNO='+refNo
	}
	return runRequest(obj)
}

function confirmSip(ip,session,tranId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSIPTransaction?IPAddress='+ip+'&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}



function insertBuyCart(ip,session, joinAccId, schemeCode, amcName, amcId, dividendOption, amount, folioNo, euin, additional,tranId,ekyc){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	if(folioNo.includes("olio")){
		folioNo="0"
	}

	if(additional){
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertAdditionalInvestmentBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&DivOpt='+dividendOption+'&TranID='+tranId+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc
		}
	}
	else{
		var obj = {
			method 	: 'POST',
			headers : headers,
			url 	: url+'InsertBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&AMCId='+amcId+'&DivOpt='+dividendOption+'&Amount='+amount+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc
		}
	}
	return runRequest(obj)
}

function bankMandate(ip,session, joinAccId, schemeCode, mandateId, amount, additional){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'MakePaymentUsingMandate?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&MandateID='+mandateId+'&Amount='+amount+'&IsThirdPartyBankTerms=1'
	}
	if(additional){
		obj.url=obj.url+"&InvestmentType=ADDITIONALPURCHASE"
	}
	return runRequest(obj)
}


function getRedemptionSchemes(ip,session, joinAccId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetRedemptionScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function insertBuyCartRedeem(ip,session, joinAccId, schemeCode, amcName, amount, folioNo,unitOrAmount){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertRedemptionBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&SchemeName='+amcName+'&Amount='+amount+'&FolioNo='+folioNo+'&RedemptionType='+unitOrAmount
	}
	return runRequest(obj)
}

function insertBuyCartSwitch(ip,session, joinAccId, schemeCodeFrom,schemeCodeTo, switchType, amount, folioNo,dividendOption,euin,ekyc){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	

	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'InsertSwitchBuyCart?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId+'&DivOpt='+dividendOption+'&FolioNo='+folioNo+'&EUIN='+euin+'&IsAgreeTerms=1&IsEKYCTermCondition='+ekyc+'&Investment='+amount+'&SwitchType='+switchType+'&SwitchFromScheme='+schemeCodeFrom+'&SwitchToScheme='+schemeCodeTo
	}
	return runRequest(obj)
}

function confirmRedemption(ip,session,tranId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmRedemptionTransaction?IPAddress='+ip+'&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}

function confirmSwitch(ip,session,tranId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSwitchTransaction?IPAddress='+ip+'&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}

function confirmSTP(ip,session,tranId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'ConfirmSTPTransaction?IPAddress='+ip+'&SessionId='+session+'&TranReferenceID='+tranId
	}
	return runRequest(obj)
}


function getSwitchScheme(ip,session,joinAccId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetSwitchScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function getSTPScheme(ip,session,joinAccId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetSTPScheme?IPAddress='+ip+'&SessionId='+session+'&JoinAccId='+joinAccId
	}
	return runRequest(obj)
}

function getSchemes(ip){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'SchemeMasterGet?IPAddress='+ip
	}
	return runRequest(obj)
}


function getClientAllFolio(ip,session){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
		var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'GetClientAllFolio?IPAddress='+ip+'&SessionId='+session
	}
	return runRequest(obj)
}


function getAccountStatement(ip, session, folio, amcId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method  : 'POST',
		headers : headers,
		url 	: url+"GetAccountStatement?IPAddress="+ip+"&SessionId="+session+"&FolioNo="+folio+"&AMCCode="+amcId
	}
	return runRequest(obj)
}

function getTransactionDetails(ip,session,txId){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+"TransactionDetailsGet?IPAddress="+ip+"&SessionId="+session+"&TranReferenceID="+txId
	}
	return runRequest(obj)
}

function getMandateDetails(ip,session){
	if(!ip||ip==undefined||ip=="localhost"){
		ip="10.10.10.10"
	}
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+"MandateDetailsGet?IPAddress="+ip+"&SessionId="+session
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
			console.log(body)
			return resolve({response:response,body:body})
		})
	})
}

module.exports = {
	panMobile 						: panMobile,
	resendOtp 						: resendOtp,
	otp 							: otp,
	getScheme 						: getScheme,
	getSchemes 						: getSchemes,
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
	confirmSTP 						: confirmSTP,
	getClientAllFolio 				: getClientAllFolio,
	getAccountStatement 			: getAccountStatement,
	getTransactionDetails 			: getTransactionDetails,
	getMandateDetails 				: getMandateDetails
}

