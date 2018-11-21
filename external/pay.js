
let session = require('../session.js')
module.exports={
	main:main
}

// function main(req, res){
// 		console.log("pay")
// 		let data=session[req.query.u]
// 		res.send(`<form target='_self' name='s1_2' id='s1_2' action='https://www.prudentcorporate.com/cbapi/MakePayment' method='post'>
// 						            <input type='hidden' value='192.168.0.102' name='IPAddress'>
// 						            <input type='hidden' value='`+data["session"]+`' name='SessionId'>
// 						            <input type='hidden' value='`+data["bankId"]+`' name='BankId'>
// 						            <input type='hidden' value='`+data["typeInv"]+`' name='InvestmentType'>
// 						            <input type='hidden' value='`+data["joinAccId"]+`' name='JoinAccId'>
// 						            <input type='hidden' value='`+data["schemeCode"]+`' name='SchemeCode'>
// 						            <input type='hidden' value='1' name='IsThirdPartyBankTerms'>
// 						            <input type='hidden' value='Prudent' name='UserName'>
// 						            <input type='hidden' value='Prudent@123' name='Password'>
// 						            <script type='text/javascript' language='javascript'>
// 						                    window.open('post.htm', 'NewFile', 'width=500, height=600, left=370, top=80, resizable=no, scrollbars=yes');
// 						                    document.getElementById('s1_2').submit();
// 						            </script>
// 						            <script language='javascript' >
// 						            </script>
// 						</form>`);
// }

function main(req, res){
		console.log("pay")
		try{
			let data=session[req.query.u]
			res.send(`

				<script type="text/javascript">
				(function(){
					console.log('calling')
					setTimeout(()=>{
							var ip=''
							
							openPopupPage(ip,'`+data["session"]+`','`+data["bankId"]+`','`+data["typeInv"]+`','`+data["joinAccId"]+`','`+data["schemeCode"]+`','1','Prudent','Prudent@123');
						
					},100)
				})();

				
				function openPopupPage(IPAddress, SessionId, BankId, InvestmentType, JoinAccId, SchemeCode, IsThirdPartyBankTerms, UserName, Password) {
				        var params = { 'IPAddress': IPAddress, 'SessionId': SessionId, 'BankId': BankId, 'InvestmentType': InvestmentType, 'JoinAccId': JoinAccId, 'SchemeCode': SchemeCode, 'IsThirdPartyBankTerms': IsThirdPartyBankTerms, 'UserName': UserName, 'Password': Password };
				        var form = document.createElement("form");
				        form.setAttribute("method", "post");
				        form.setAttribute("action", "https://prudentcorporate.com/CBAPI/MakePayment");
				        form.setAttribute("target", "_self");
				        for (var i in params) {
				            if (params.hasOwnProperty(i)) {
				                var input = document.createElement('input');
				                input.type = 'hidden';
				                input.name = i;
				                input.value = params[i];
				                form.appendChild(input);
				            }
				        }
				        document.body.appendChild(form);
				        form.submit();
				        return false;
				    }
				</script>`);
		}
		catch(e){
			res.send("Failed, Please try again.")
		}
}