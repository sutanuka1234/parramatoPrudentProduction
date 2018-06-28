module.exports={
	main:main
}

function main(req, res){
		console.log("confirmation")
		console.log(JSON.stringify(req,null,3))
		res.sendStatus(200);
}