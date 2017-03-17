var port = 8081;
var express = require('express');
var logic = require('./logic');
var uuid = require('react-native-uuid');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 

app.get('/', function (request, response) {
    
   var destinationHost = logic.retrieveUrl(request);
   var numberOfCalls = logic.retrieveNumberOfCalls(request);
   var callId = uuid.v4();

    if(destinationHost === undefined || !logic.isValidUrl(destinationHost || numberOfCalls < 1)) {
        logic.sendErrorResponse(response, 404, "Invalid URL: " + destinationHost)
    }
    else {
        for(var i = 0; i < numberOfCalls; i++)
        {
            logic.httpCall(detinationHost, callId, i)
                .then(function (res){
                    if( i === (numberOfCalls - 1))
                    {
                        logic.sendResponse(response, 200, "Ok")
                    }
                }).catch(function (error) {
                    logic.sendResponse(error, 500, "Error");
                });
        }
    }
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
  console.log('POST method called');
});

app.listen(port);
console.log('Magic happens on port ' + port);