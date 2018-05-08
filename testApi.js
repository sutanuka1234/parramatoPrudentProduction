var request = require('request')

var headers = {
    UserName    : "Prudent",
    Password    : "Prudent@123"
}
var url = 'https://www.prudentcorporate.com/cbapi/'



function bankNach(session,joinAccId,schemeCode,bankId){
	var obj = {
		method 	: 'POST',
		headers : headers,
		url 	: url+'MakePayment?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&BankId='+bankId+'&InvestmentType=PURCHASE&IsThirdPartyBankTerms=1&UserName=Prudent&Password=Prudent@123'
	}
	console.log(url+'MakePayment?IPAddress=192.168.0.102&SessionId='+session+'&JoinAccId='+joinAccId+'&SchemeCode='+schemeCode+'&BankId='+bankId+'&InvestmentType=PURCHASE&IsThirdPartyBankTerms=1&UserName=Prudent&Password=Prudent@123')
	return runRequest(obj)
}


function runRequest(obj){
	return new Promise(function(resolve, reject){
		console.log("reqested")
		console.log(obj)
		request(obj, (error,response,body)=>{
			console.log("response")
			console.log(error)
			if(error){
				return reject(error);
			}
			return resolve({response:response,body:body})
		})
	})
}


bankNach('7C772321713D21713D21713D21713D21713D21713D21713D7C77235E6D3A','334','1131','316').then(data=>{console.log(data.body)}).catch(e=>{console.log(e)})
