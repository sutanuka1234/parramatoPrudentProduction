let fs = require('fs')
var api = require("./api.js");
function resetFunds(){

		api.getSchemes("10.10.10.10")
		.then((body)=>{
			let elements = JSON.parse(body["body"]);
			elements=elements["Response"]
			let resp={}
			for(let element of elements){
				

				resp[element["SchemeName"]+" "+element["OPTION"]]={
					amcCode:element["AMC_CODE"],
					amcName:element["FUNDNAME"],
					schemeCode:element["SCHEMECODE"],
					subNatureCode:element["SubNatureCode"],
					subNatureName:element["SubNature"],
					optionCode:element["OPT_CODE"],
					option:element["OPTION"]
				}
				if(element["SCHEMECODE"]=="41737"||element["SCHEMECODE"]=="36002"){
					console.log(element["SchemeName"]+" "+element["SubNature"]+element["OPTION"])
					console.log(resp[element["SchemeName"]+" "+element["SubNature"]+element["OPTION"]])
				}
			}
	     	fs.writeFile(`${__dirname}/data.js`, "module.exports="+JSON.stringify(resp,null,3),async function (err)  {  
	                if (err) throw err;
	                console.log("Scheme update...")
	     	})
		})
	}

console.log("reset funds")
resetFunds();