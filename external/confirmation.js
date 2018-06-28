module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		console.log(JSON.stringify(req.body,null,3))
		res.sendStatus(200);
}