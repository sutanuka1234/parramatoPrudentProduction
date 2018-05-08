// var request = require('request')

// var headers = {
//     UserName    : "Prudent",
//     Password    : "Prudent@123"
// }
// var url = 'https://www.prudentcorporate.com/cbapi/MakePayment'



// function bankNach(session,joinAccId,schemeCode,bankId){
// 	var obj = {
// 		method 	: 'POST',
// 		headers : headers,
// 		url 	: url,
// 		body	:`<form target='NewFile' name='s1_2' id='s1_2' action='` + url + `' method='post'>
// 					<input type='hidden' value='192.168.0.102' name='IPAddress'>
// 			                <input type='hidden' value='` + session + `' name='SessionId'>
// 			                <input type='hidden' value='` + bankId + `' name='BankId'>
// 			                <input type='hidden' value='PURCHASE' name='InvestmentType'>
// 			                <input type='hidden' value='` + joinAccId + `' name='JoinAccId'>
// 			                <input type='hidden' value='` + schemeCode + `' name='SchemeCode'>
// 			                <input type='hidden' value='1' name='IsThirdPartyBankTerms'>
// 			                <input type='hidden' value='Prudent' name='UserName'>
// 			                <input type='hidden' value='Prudent@123' name='Password'>
// 			                <script type='text/javascript' language='javascript'>
// 			                        window.open('post.htm', 'NewFile', 'width=500, height=600, left=370, top=80, resizable=no, scrollbars=yes');
// 			                        document.getElementById('s1_2').submit();
// 			                </script>
// 			                <script language='javascript' >
// 			                </script>
// 					</form>`
// 	}
// 	console.log(url)
// 	return runRequest(obj)
// }

// function runRequest(obj){
// 	return new Promise(function(resolve, reject){
// 		console.log("reqested")
// 		console.log(obj)
// 		request(obj, (error,response,body)=>{
// 			console.log("response")
// 			console.log(error)
// 			if(error){
// 				return reject(error);
// 			}
// 			return resolve({response:response,body:body})
// 		})
// 	})
// }


// bankNach('7C772321713D21713D21713D21713D21713D21713D21713D7C77235E6D3A','334','1131','316').then(data=>{console.log(data.body)}).catch(e=>{console.log(e)})
