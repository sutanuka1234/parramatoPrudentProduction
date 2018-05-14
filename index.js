var request = require('request');
var stringSimilarity = require('string-similarity');
 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

const headers={
    UserName    : "Prudent",
    Password    : "Prudent@123"
}

app.listen(process.env.PORT||80,()=>{
    console.log("Server is listening.")
})




app.get('/external/pay', (req,res)=>{
    require('./external/pay.js').main(req, res)
})


app.post('/external/confirmation', (req,res)=>{
    require('./external/confirmation').main(req, res)
})


app.post('/:folder/:type/:stage', (req,res)=>{
    require('./'+req.params.folder+'/'+req.params.type).main(req, res)
})
