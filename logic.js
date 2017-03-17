var urlValidations = require('./urlValidations.js');

module.exports = {

    retrieveUrl: function (request) {
        var url = require('url');
        var destinationHost = url.parse(request.url, true).query.url;
        return destinationHost;
    },

    retrieveNumberOfCalls: function (request) {
        var url = require('url');
        var temp = url.parse(request.url, true).query.times;

        var numberOfCalls = 1;
        if (!isNaN(temp)) {
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


    httpCall: function (destinationHost, callId, callNumber) {
        var urlPath = "/?url=" + destinationHost +
            "&id=" + callId +
            "&number=" + callNumber;

        return new Promise(function (resolve, reject) {
            var http = require('http');
            var options = {
                host: 'localhost',
                port: 1980,
                path: urlPath
            };

            http.get(options, function (res) {
                res.on("data", function () {
                    resolve(res);
                });
            }).on('error', function (e) {
                reject(e.message);
            });
        });
    },

    retrieveData: function (id) {
        return new Promise(function(resolve, reject) {
        var mongoClient = require("mongodb").MongoClient;

        mongoClient.connect("mongodb://gb-mongo:WXFU43PvnFcyHV3GW6ZmJvYhr613ZBbyuhYA3azpvpUiqDJEmHxMIXWwd4XQMPcWRzMKMy8S5zhZHz0GihVXuw==@gb-mongo.documents.azure.com:10250/?ssl=true",
            function (err, db) {
                db.collection('gb-respose-times').find({guid: id}).toArray(function(err, result){
                    var endpoints = {};
                    var emeaResults = result.map(value => {
                        if(value.endpoint in endpoints){
                            endpoints[value.endpoint] += value.lapse;
                        } else {
                            endpoints[value.endpoint] = value.lapse;
                        }
                    });

                    var averageResult = [
                        {
                            endpoint: "EMEA",
                            average: endpoints.EMEA / result.length,
                        }
                    ];
                    resolve(averageResult);
                });
            });
        });

    },

    sendResponse: function (response, result, message, id) {
        if (result === 200) {
            this.retrieveData(id).then(function(result){
                response.writeHead(200, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ data: result }));
            });
        } else {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: message }));
        }
    },

}