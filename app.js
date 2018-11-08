const express = require('express');
const crypto = require('crypto');
const bp = require("body-parser");
var jsonParser = bp.json()
const app = express();
const port = process.env.PORT || 3005;

// Hardcode the account data in JSON
balance_data = [
  {account_num: "12345", balance: 102.57},
  {account_num: "23456", balance: -5348.34},
  {account_num: "54321", balance: 102.57}
];

// record details of the request in the log (for debugging purposes)
function log_request (request) {
  console.log('verb='+request.method);;
  console.log('url='+ request.originalUrl);
  console.log("Query: "+JSON.stringify(request.query));
  console.log("Body: "+JSON.stringify(request.body));
  console.log("Headers: "+JSON.stringify(request.headers));
}

// A simple home page for people who stumble across this site
app.get('/', (request, response) => {
  response.send('Welcome to the balance checking app you can get on <a href="balance">balance</a> or do a POST on <a href="lodgement">lodgement</a>.');
  log_request (request);
})

// Handle POST requests with STT job status notification
app.post('/lodgement', jsonParser, (request, response) => {
  log_request (request);
  response.type('text/plain');

  if (!request.body) {
    var err_text = 'Invalid POST request with no body';
    console.log(err_text);
    return response.status(400).send(err_text);
  }

  if (!request.body.hasOwnProperty("amount")) {
    var err_text = 'Invalid /lodgement POST request with no amount specified';
    console.log(err_text);
    return response.status(400).send(err_text);
  }

  if (!request.body.hasOwnProperty("account_num")) {
    var err_text = 'Invalid /lodgement POST request with no account number';
    console.log(err_text);
    return response.status(400).send(err_text);
  }

  account_detail = balance_data.find(function (acc_detail) {
    if (acc_detail.account_num === request.body.account_num)
      return true;
    else
      return false;
  });
  if (!account_detail) {
    // return error not a valid accouunt number
    var err_text = request.body.account_num + ' is not a valid account_num';
    console.log(err_text);
    return response.status(404).send(err_text);

  } else {
    // increment and return account balance
    account_detail.balance += request.body.amount;
    console.log('Balance of account '+account_detail.account_num+' changed to '+account_detail.balance.toString());
    return response.send(account_detail.balance.toString());
  } 
})

// Deal with the initial request checking if this is a valid STT callback URL
app.get('/balance', (request, response) => {
  log_request (request);

  if (request.query.hasOwnProperty("account_num")) {
    account_detail = balance_data.find(function (acc_detail) {
      if (acc_detail.account_num === request.query.account_num)
        return true;
      else
        return false;
    });
    if (!account_detail) {
      // return error not a valid accouunt number
      var err_text = request.query.account_num + ' is not a valid account_num';
      console.log(err_text);
      return response.status(404).send(err_text);
  
    } else {
      // return account balance
      return response.send(account_detail.balance.toString());
    }
  }
  else
  {
    var err_text = 'Invalid GET request for /balance with no account_num specified';
    console.log(err_text);
    return response.status(400).send(err_text);
  }

})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
})
