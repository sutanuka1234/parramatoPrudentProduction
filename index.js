var request = require('request');
var stringSimilarity = require('string-similarity');
 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var post=require('./postDistributor.js');
var pre=require('./preDistributor.js');

app.use(jsonParser);
app.use(urlencodedParser);

const headers={
    UserName    : "Prudent",
    Password    : "Prudent@123"
}

const url="https://www.prudentcorporate.com/cbapi/";

app.listen(process.env.PORT||80,()=>{
    console.log("Server is listening.")
})

app.get("/", (req, res) =>{


var HashMap = require('hashmap');

let data = {
  "Response": [
    [
      {
        "ID": 400040,
        "AMCName": "Axis Mutual Fund"
      },
      {
        "ID": 400005,
        "AMCName": "Baroda Pioneer Mutual Fund"
      },
      {
        "ID": 400004,
        "AMCName": "Birla Sun Life Mutual Fund"
      },
      {
        "ID": 400001,
        "AMCName": "BNP Paribas Mutual Fund"
      },
      {
        "ID": 400034,
        "AMCName": "BOI AXA Mutual Fund"
      },
      {
        "ID": 400006,
        "AMCName": "Canara Robeco Mutual Fund"
      },
      {
        "ID": 400044,
        "AMCName": "DHFL Pramerica Mutual Fund"
      },
      {
        "ID": 400009,
        "AMCName": "DSP BlackRock Mutual Fund"
      },
      {
        "ID": 400012,
        "AMCName": "Franklin Templeton Mutual Fund"
      },
      {
        "ID": 400013,
        "AMCName": "HDFC Mutual Fund"
      },
      {
        "ID": 400015,
        "AMCName": "ICICI Prudential Mutual Fund"
      },
      {
        "ID": 400043,
        "AMCName": "IDBI Mutual Fund"
      },
      {
        "ID": 400028,
        "AMCName": "IDFC Mutual Fund"
      },
      {
        "ID": 400021,
        "AMCName": "Invesco Mutual Fund"
      },
      {
        "ID": 400019,
        "AMCName": "Kotak Mahindra Mutual Fund"
      },
      {
        "ID": 400007,
        "AMCName": "L\u0026T Mutual Fund"
      },
      {
        "ID": 400020,
        "AMCName": "LIC Mutual Fund"
      },
      {
        "ID": 400054,
        "AMCName": "Mahindra Mutual Fund"
      },
      {
        "ID": 400033,
        "AMCName": "Mirae Asset Mutual Fund"
      },
      {
        "ID": 400042,
        "AMCName": "Motilal Oswal Mutual Fund"
      },
      {
        "ID": 400023,
        "AMCName": "Principal Mutual Fund"
      },
      {
        "ID": 400025,
        "AMCName": "Reliance Nippon Mutual Fund"
      },
      {
        "ID": 400027,
        "AMCName": "SBI Mutual Fund"
      },
      {
        "ID": 400029,
        "AMCName": "Sundaram Mutual Fund"
      },
      {
        "ID": 400030,
        "AMCName": "Tata Mutual Fund"
      },
      {
        "ID": 400032,
        "AMCName": "UTI Mutual Fund"
      }
    ],
    [
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400028
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400028
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400028
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400005
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400005
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400005
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400014
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400014
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400014
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400025
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400025
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400025
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400054
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400054
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400054
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400034
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400034
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400034
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400009
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400009
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400009
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400020
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400020
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400020
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400043
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400043
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400043
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400006
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400006
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400006
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400029
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400029
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400029
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400023
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400023
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400023
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400040
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400040
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400040
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400001
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400001
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400001
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400032
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400032
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400032
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400012
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400012
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400012
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400004
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400004
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400004
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400021
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400021
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400021
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400015
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400015
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400015
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400044
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400044
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400044
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400030
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400030
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400030
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400007
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400007
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400007
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400033
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400033
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400033
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400027
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400027
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400027
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400019
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400019
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400019
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400013
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400013
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400013
      },
      {
        "OPT_CODE": 1,
        "OPTION": "Growth",
        "AMCCode": 400042
      },
      {
        "OPT_CODE": 2,
        "OPTION": "Dividend",
        "AMCCode": 400042
      },
      {
        "OPT_CODE": 3,
        "OPTION": "Bonus",
        "AMCCode": 400042
      }
    ],
    [
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400001
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400004
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400007
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400013
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400015
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400019
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400021
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400023
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400025
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400027
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400028
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400032
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400040
      },
      {
        "ID": 1,
        "SubNature": "Hybrid  -Arbitrage",
        "AMCCode": 400044
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400001
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400004
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400005
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400006
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400007
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400009
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400012
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400013
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400015
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400019
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400020
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400023
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400025
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400027
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400028
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400029
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400030
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400032
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400033
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400034
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400040
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400042
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400043
      },
      {
        "ID": 2,
        "SubNature": "Equity-Balance",
        "AMCCode": 400044
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400004
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400006
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400013
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400015
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400019
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400021
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400025
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400027
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400040
      },
      {
        "ID": 3,
        "SubNature": "Commodity-Commodity",
        "AMCCode": 400043
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400001
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400004
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400005
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400006
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400007
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400009
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400012
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400013
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400014
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400015
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400019
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400021
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400023
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400025
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400027
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400028
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400029
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400030
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400032
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400033
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400042
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400043
      },
      {
        "ID": 4,
        "SubNature": "Equity-Diversified",
        "AMCCode": 400044
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400001
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400004
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400005
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400006
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400007
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400009
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400012
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400013
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400014
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400015
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400019
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400020
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400021
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400023
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400025
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400027
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400028
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400029
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400030
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400032
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400033
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400034
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400040
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400042
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400043
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400044
      },
      {
        "ID": 5,
        "SubNature": "Equity-ELSS",
        "AMCCode": 400054
      },
      {
        "ID": 6,
        "SubNature": "Commodity-Gold ETFs",
        "AMCCode": 400021
      },
      {
        "ID": 7,
        "SubNature": "Equity-Equity ETFs",
        "AMCCode": 400021
      },
      {
        "ID": 9,
        "SubNature": "Debt-FOF - Debt",
        "AMCCode": 400004
      },
      {
        "ID": 9,
        "SubNature": "Debt-FOF - Debt",
        "AMCCode": 400015
      },
      {
        "ID": 9,
        "SubNature": "Debt-FOF - Debt",
        "AMCCode": 400023
      },
      {
        "ID": 9,
        "SubNature": "Debt-FOF - Debt",
        "AMCCode": 400028
      },
      {
        "ID": 10,
        "SubNature": "Equity-FOF - Equity",
        "AMCCode": 400004
      },
      {
        "ID": 10,
        "SubNature": "Equity-FOF - Equity",
        "AMCCode": 400009
      },
      {
        "ID": 10,
        "SubNature": "Equity-FOF - Equity",
        "AMCCode": 400015
      },
      {
        "ID": 10,
        "SubNature": "Equity-FOF - Equity",
        "AMCCode": 400019
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400004
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400009
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400012
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400014
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400019
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400021
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400023
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400029
      },
      {
        "ID": 11,
        "SubNature": "Equity-FOF - Overseas",
        "AMCCode": 400044
      },
      {
        "ID": 12,
        "SubNature": "Hybrid  -FOF - Hybrid",
        "AMCCode": 400012
      },
      {
        "ID": 12,
        "SubNature": "Hybrid  -FOF - Hybrid",
        "AMCCode": 400014
      },
      {
        "ID": 12,
        "SubNature": "Hybrid  -FOF - Hybrid",
        "AMCCode": 400023
      },
      {
        "ID": 12,
        "SubNature": "Hybrid  -FOF - Hybrid",
        "AMCCode": 400028
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400001
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400004
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400005
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400006
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400007
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400009
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400012
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400013
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400014
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400015
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400019
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400020
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400021
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400023
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400025
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400027
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400028
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400029
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400030
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400032
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400033
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400040
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400043
      },
      {
        "ID": 13,
        "SubNature": "Debt-Income/Gilt",
        "AMCCode": 400044
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400004
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400012
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400015
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400019
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400021
      },
      {
        "ID": 14,
        "SubNature": "Equity-Global",
        "AMCCode": 400025
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400004
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400012
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400013
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400015
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400020
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400023
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400025
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400027
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400028
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400030
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400032
      },
      {
        "ID": 16,
        "SubNature": "Equity-Index",
        "AMCCode": 400043
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400004
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400006
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400007
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400009
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400012
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400013
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400014
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400015
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400019
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400020
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400021
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400027
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400028
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400029
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400030
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400032
      },
      {
        "ID": 17,
        "SubNature": "Equity-Infra",
        "AMCCode": 400034
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400001
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400004
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400005
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400006
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400007
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400009
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400012
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400013
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400014
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400015
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400019
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400020
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400021
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400023
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400025
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400027
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400028
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400029
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400030
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400032
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400034
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400040
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400042
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400043
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400044
      },
      {
        "ID": 18,
        "SubNature": "Equity-Large Cap",
        "AMCCode": 400054
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400004
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400005
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400006
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400007
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400009
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400012
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400013
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400014
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400015
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400019
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400020
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400021
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400023
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400025
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400027
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400028
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400029
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400030
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400032
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400033
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400034
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400040
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400043
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400044
      },
      {
        "ID": 19,
        "SubNature": "Debt-Liquid",
        "AMCCode": 400054
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400001
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400004
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400005
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400006
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400007
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400009
      },
      {
        "ID": 20,
        "SubNature": "Hybrid-MIP",
        "AMCCode": 400012
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400013
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400014
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400015
      },
      {
        "ID": 20,
        "SubNature": "Hybrid-MIP",
        "AMCCode": 400019
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400020
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400021
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400025
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400027
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400028
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400029
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400030
      },
      {
        "ID": 20,
        "SubNature": "Hybrid-MIP",
        "AMCCode": 400032
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400034
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400040
      },
      {
        "ID": 20,
        "SubNature": "Hybrid  -MIP",
        "AMCCode": 400043
      },
      {
        "ID": 20,
        "SubNature": "Hybrid-MIP",
        "AMCCode": 400044
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400001
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400004
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400005
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400006
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400007
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400009
      },
      {
        "ID": 21,
         "SubNature":"Debt-Other Debt",
        "AMCCode": 400012
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400013
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400014
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400015
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400019
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400020
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400021
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400023
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400025
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400027
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400028
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400029
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400030
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400032
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400033
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400034
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400040
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400042
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400043
      },
      {
        "ID": 21,
        "SubNature": "Debt-Other Debt",
        "AMCCode": 400044
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400004
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400005
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400009
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400012
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400015
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400020
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400021
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400025
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400027
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400029
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400030
      },
      {
        "ID": 23,
        "SubNature": "Equity-Sector",
        "AMCCode": 400032
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400001
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400004
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400005
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400006
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400007
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400009
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400012
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400013
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400014
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400015
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400019
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400020
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400021
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400023
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400025
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400027
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400028
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400029
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400030
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400032
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400040
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400042
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400043
      },
      {
        "ID": 24,
        "SubNature": "Equity-Small \u0026 Mid Cap",
        "AMCCode": 400044
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400001
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400004
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400005
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400006
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400007
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400009
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400012
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400013
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400014
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400015
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400019
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400021
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400023
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400025
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400027
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400028
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400029
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400030
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400032
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400034
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400040
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400043
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400044
      },
      {
        "ID": 25,
        "SubNature": "Debt-Short/Medium Term",
        "AMCCode": 400054
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400006
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400013
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400027
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400032
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400034
      },
      {
        "ID": 26,
        "SubNature": "Hybrid-Asset",
        "AMCCode": 400040
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400004
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400007
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400009
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400013
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400015
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400019
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400023
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400025
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400027
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400044
      },
      {
        "ID": 27,
        "SubNature": "Equity-Equity - Savings / Income",
        "AMCCode": 400054
      }
    ]
  ]
}

let amcs = data['Response'][0];
let options = data['Response'][1];
let subnatures = data['Response'][2]

// console.log("sa" + JSON.stringify(data['Response'][2], null, 3))


let model = {
   amcs : data['Response'][0],
   options :data['Response'][1],
   subnatures :data['Response'][2]
}

createAmcMap(model)
.then(addOptions)
.then(addSubNature)
.then((final)=>{
   console.log("FINAL" + JSON.stringify(final.map))
   res.json(final.map)
})
.catch((e)=>{
  console.log("*****"+ e)
})

function createAmcMap(model) {
  return new Promise(function(resolve, reject) {
      var map = new HashMap();

      let amcs = model.amcs;
      console.log("got amcs")
      for(let index = 0; index <amcs.length; index++) {
        console.log("********************" + index)
          if(map.get(amcs[index].ID)) {
             //console.log("EXISTS  UPDATE" + JSON.stringify(map.get(amcs[index].ID, null, 3)))
          } else {
             console.log("NEW ADD 1" + index)
             let object ={}
             object.amcId = amcs[index].ID;
             object.amcName = object.AMCName
             map.set(amcs[index].ID, object);
          }

      }
      model.map = map
      return resolve(model)

  });
} 

function addOptions(model) {
  return new Promise(function(resolve, reject) {

      let options = model.options;
      let map = model.map
      console.log("got options")
      for(let index = 0; index <options.length; index++) {
          console.log("********************" + index)
          if(map.get(options[index].AMCCode)) {
            console.log("EXISTS  UPDATE OPTIONS")
              let object = map.get(options[index].AMCCode)
             object.OPT_CODE = options[index].OPT_CODE;
             object.OPTION = options[index].OPTION;
             object.AMCCode = options[index].AMCCode;
             map.set(options[index].AMCCode, object);
          } else {
             console.log("NEW ADD 2")
             // let object ={}
             

             // object.amcId = options[index].ID;
             // object.OPTION = object.OPTION
             // map.set(options[index], object);
          }

      }
      model.map = map
      return resolve(model)
  });
}

function addSubNature(model) {
  return new Promise(function(resolve, reject) {

      let subnatures = model.subnatures;
      let map = model.map
      console.log("got subnatures")
      for(let index = 0; index <subnatures.length; index++) {
          console.log("********************" + index)
          if(map.get(subnatures[index].AMCCode)) {
             //console.log("EXISTS  UPDATE subnatures" + JSON.stringify(map.get(subnatures[index].AMCCode, null, 3)))
              let object = map.get(subnatures[index].AMCCode)
              if(!object.subnatures) {
                 console.log("sub new")
                 let subnatures = []
                 subnatures.push(subnatures[index])
                 object.subnatures = subnatures
              } else {
                console.log("sub exits")
                object.subnatures.push(subnatures[index])
              }
              map.set(subnatures[index].AMCCode, object);
          } else {
             console.log("NEW ADD 3" +subnatures[index].AMCCode )
             // let object ={}
             

             // object.amcId = subnatures[index].ID;
             // object.OPTION = object.OPTION
             // map.set(subnatures[index], object);
          }

      }
      model.map = map
      return resolve(model)

  });
}



  
})
app.post('/:type',(req, res)=>{
    filter(req)
    .then((model)=>{
//        console.log("final response"+JSON.stringify(model))
        res.status(200).json(model)})
    .catch((e)=>{res.status(203).json({error:e})})
})

function filter(request){
    return new Promise(function(resolve, reject){
        switch(request.params.type){
            
            case "validateMobile"   :   
                                        post.validateMobile(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject(e)
                                        });
                break;
                
            case "validatePan"      :
                                        post.validatePan(request.body)
                                        .then(post.validatePanMobileByApi)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                                        
                break;
            
            case "validateOTP"      :   
                                        if(request.body.data.toLowerCase().includes("resend")&&request.body.tags.sessionId){
                                            console.log("IN RESEND PART");
                                            post.resendOTP(request.body)
                                            .then((model)=>{return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.")
                                            })
                                        }
                                        else{
                                            console.log("VALIDATING OTP")
                                            post.getOTP(request.body)
                                            .then(post.validateOTP)
                                            .then((model)=>{
                                                return resolve(model)})
                                            .catch((e)=>{
                                                console.log(e);
                                                return reject("Something went wrong.");
                                            })
                                        }
                break;
                
            case "createHoldingPatternResponse":
                                        pre.createHoldingPatternResponse(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "validateHoldingPattern":
                                        post.validateHoldingPattern(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "getAmc" :
                                        pre.getAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
            break;
                
            case "validateAmcName" :
                                        post.vaildateSelectedAmc(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;          
                
            case "getSubnatureOptions":
                                        pre.getSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "validateSubnatureOptions":
                                        post.validateSubnatureOptions(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showSchemes"      :
                                        pre.showSchemes(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
            
            case "validateSchemeName":
                                        post.validateSchemeName(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.")
                                        });
                break;
                
            case "showFolio"        :
                                        pre.showFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateFolio"    :
                                        post.validateFolio(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "validateAmount"   :   
                                        post.validateAmount(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            case "amountDecoration":
                                        pre.amountDecoration(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });  
                break;
                
            case "validateAgreement":
                                        post.validateAgreement(request.body)
                                        .then(post.insertBuyCart)
                                        .then((model)=>{
                                            return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        }); 
                break;
                
            case "showMandate"      :
                                        pre.showMandate(request.body)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        }); 
                break;
                
            case "validateMandate"  :
                                        post.validateMandate(request.body)
                                        .then(post.makePaymentUsingMandate)
                                        .then((model)=>{return resolve(model)})
                                        .catch((e)=>{
                                            console.log(e);
                                            return reject("Something went wrong.");
                                        });
                break;
                
            default                 :   
                                        return reject("No service at this domain.");
                break;
        }
    });
}

// function showFolio(model){
//     return new Promise(function(resolve,reject){
//         try{
//             let reply={};
//             reply.type="generic";
//             reply.text="You can choose from the following folios."
//             reply.next={
//                 data:[]  
//             };
//             model.tags.foliosArray=[];
//             for(let i=0;i<model.tags.folioDetails.length;i++){
//                 console.log(JSON.stringify(model.tags.folioDetails[i])+"-----")
//                 if(model.tags.folioDetails[i]){
//                     reply.next.data.push({
//                         title   :model.tags.folioDetails[i].FolioNo,
//                         text    :"",
//                         buttons :[
//                             {
//                                 text:"Use this",
//                                 data:model.tags.folioDetails[i].FolioNo
//                             }
//                         ]
//                     })
//                     model.tags.foliosArray.push(parseInt(model.tags.folioDetails[i].FolioNo));
//                 }
//             }
//             model.reply=reply;
//             console.log(JSON.stringify(model.reply)+"FOLIOS")
//             return resolve(model);
//         }
//         catch(e){
//             console.log(e);
//             return reject("Something went wrong. Folio")
//         }
//     })
// }