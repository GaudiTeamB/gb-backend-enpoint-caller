var urlValidations = require('./urlValidations.js');

module.exports = {
sendErrorResponse: function(response, result, message){
        response.writeHead(result, {"Content-Type": "application/json"});

        var errorResponse = {
            error : message
        };

        response.end(JSON.stringify(errorResponse));
},

retrieveUrl: function(request){
    var url = require('url');
    var destinationHost = url.parse(request.url, true).query.url;
    return destinationHost;
},

retrieveNumberOfCalls: function(request){
    var url = require('url');
    var temp = url.parse(request.url, true).query.times;

    var numberOfCalls = 1;
    if(!isNaN(temp))
    {
        numberOfCalls = Number(temp);
    }

    return numberOfCalls;
},

isValidUrl: function (destinationUrl) {
    var url = require('url');
    var urlParsed = url.parse(destinationUrl, true);

    // TODO: isValidHost is not the proper check for this field. Custom check needed.
    var isValid = (urlParsed.href && urlValidations.isValidHost(urlParsed.href)) || 
                  (urlValidations.isValidHost(urlParsed.host) &&
                  urlValidations.isValidProtocol(urlParsed.protocol));

     return isValid;
},


httpCall: function(destinationHost, callId, callNumber) {
    var urlPath = "\?url=" + destinationHost + 
                  "&id=" + callId + 
                  "&number="+callNumer;
                  
    return new Promise(function (resolve, reject) {
        var http = require('http');
        var options = {
                    host: 'localhost',
                    port: 1980,
                    path: urlPath
                };

        http.get(options, function(res) {
            res.on("data", function() {
                resolve(res);
            });
        }).on('error', function(e) {
            reject(e.message);
        });
    });
}

}