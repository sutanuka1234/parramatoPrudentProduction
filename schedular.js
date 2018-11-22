var api = require("./api.js");
var data= require('../data.js').get();


setInterval(()=>{
	resetFunds();
},24*60*60*1000)



function resetFunds(){
	api.getSchemes("10.10.10.10")
	.then((body)=>{
		let elements = JSON.parse(body["body"]);
		let resp={}
		for(let element of elements){
			resp[element["SchemeName"]+" "+element["SubNature"]+element["OPTION"]]={
				amcCode:element["AMC_CODE"],
				amcName:element["FUNDNAME"],
				schemeCode:element["SCHEMECODE"],
				subNatureCode:element["SubNatureCode"],
				optionCode:element["OPT_CODE"],
				option:element["OPTION"]
			}
		}
		data.set(resp);
	})
}



