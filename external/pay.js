module.exports={
	main:main
}

function main(req, res){
		console.log("pay")
		console.log(req.query.session)
		res.send(`<form target='NewFile' name='s1_2' id='s1_2' action='https://www.prudentcorporate.com/cbapi/MakePayment' method='post'>
						            <input type='hidden' value='192.168.0.102' name='IPAddress'>
						            <input type='hidden' value='`+req.query.session+`' name='SessionId'>
						            <input type='hidden' value='`+req.query.bankId+`' name='BankId'>
						            <input type='hidden' value='`+req.query.type+`' name='InvestmentType'>
						            <input type='hidden' value='`+req.query.joinAccId+`' name='JoinAccId'>
						            <input type='hidden' value='`+req.query.schemeCode+`' name='SchemeCode'>
						            <input type='hidden' value='1' name='IsThirdPartyBankTerms'>
						            <input type='hidden' value='Prudent' name='UserName'>
						            <input type='hidden' value='Prudent@123' name='Password'>
						            <script type='text/javascript' language='javascript'>
						                    window.open('post.htm', 'NewFile', 'width=500, height=600, left=370, top=80, resizable=no, scrollbars=yes');
						                    document.getElementById('s1_2').submit();
						            </script>
						            <script language='javascript' >
						            </script>
						</form>`);
}
