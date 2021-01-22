const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: 'your api key',
  server: 'your server',
});

app.post("/", function(req, res){
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;
  console.log('first name :',  firstName,',  last name :', lastName,', email :',  email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

    const run = async () => {
     try{    
        const response = await client.lists.addListMember('list', {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
      });
           console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
 
  run();
});
 
app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
