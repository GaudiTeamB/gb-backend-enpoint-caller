var urlValidations = require('./urlValidations.js');

module.exports = {
sendResponse: function(response, result, message){
        response.writeHead(200, {"Content-Type": "application/json"});

        var averegeCalculation = {
                                     data : [
                                            {endpoint: 'EMEA', average: 2500},
                                            {endpoint: 'AMER', average: 3600},
                                            {endpoint: 'ASIA', average: 5500},
                                     ],
                                };

        response.end(JSON.stringify(averegeCalculation));
},

addTrace: function (start, status) {
    var end = new Date();
    // TODO: Store in mongo EndTime
    console.log("End Time: " + end);
    var lapse = end - start;
    // TODO: Store in mongo Status
    console.log("Status Response: "+ status +" Time Lapse = " +lapse + "ms");
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


httpCall: function(destinationHost) {
    return new Promise(function (resolve, reject) {
        var http = require('http');
        var options = {
                    host: destinationHost,
                    port: 80,
                    path: '/'
                };

        http.get(options, function(res) {
            res.on("data", function() {
                resolve(res.statusCode);
            });
        }).on('error', function(e) {
            reject(e.message);
        });
    });
}

}