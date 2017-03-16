module.exports = {
isValidProtocol: function(protocol) {
    var isValid = true;

    if(protocol)
    {
        var validProtocols = [
            "http:",
            "https:"
        ];

        isValid = validProtocols.includes(protocol);
    }

    return isValid;    
},

isValidHost: function(host) {
    var isValid = true;
    // Dicovering if a host name is a valid DNS is not trivial...
    //var hostRegex = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]+(\.[a-zA-Z0-9]+)+/g
    //var hostRegex =/^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i
    //var hostRegex = /(www\.)?([-a-zA-Z0-9@:%._\+~#=]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?/g
    var hostRegex = /((\w+):\/\/)?(([\w@][\w.:@]+))\/?[\w\.?=%&=\-@/$,]{2,6}/g

    if(host && hostRegex.exec(host))
    {
        isValid = true;
    }
    else
    {
        isValid = false;
    }

    return isValid;
},

}