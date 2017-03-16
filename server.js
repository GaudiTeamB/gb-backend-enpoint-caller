var port = 8081;
var express = require('express');
var logic = require('./logic');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 

app.get('/', function (request, response) {

   var destinationHost = logic.retrieveUrl(request);
   var numberOfCalls = logic.retrieveNumberOfCalls(request);

    if(destinationHost === undefined || !logic.isValidUrl(destinationHost || numberOfCalls < 1)) {
        logic.sendResponse(response, 404, "Invalid URL: " + destinationHost)
    }
    else {
        logic.sendResponse(response, 200, "Ok")
    }
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
  console.log('POST method called');
});

app.listen(port);
console.log('Magic happens on port ' + port);