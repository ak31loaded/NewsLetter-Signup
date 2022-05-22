const express=require("express");
const app =express();
const request=require("request");
const bp=require("body-parser");
var reques = require('superagent');
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signin.html");
});


var mailchimpInstance   = 'INSTANCE',
    listUniqueId        = 'LIST ID',
    mailchimpApiKey     = 'API KEY';

app.post('/', function (req, res) {
    reques
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
         'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.firstName,
            'LNAME': req.body.lastName
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname+'/success.html');
              } else {
                res.sendFile(__dirname+'/failure.html');
              }
          });
});
app.post('/failure',function(req,res){
    res.redirect("/");
});





app.listen(process.env.PORT||3000,function()
{
    console.log("Started");
});
