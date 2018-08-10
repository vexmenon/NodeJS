
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


var myServer = http.createServer(function(req,res){
    var parsedCurrentUrl = url.parse(req.url,true);
    var pathOfCurrentUrl = parsedCurrentUrl.pathname;
    var trimmedPath = pathOfCurrentUrl.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedCurrentUrl.query;
    var method = req.method.toLocaleLowerCase;
    var decoder = new StringDecoder('utf-8');
    var headers = req.headers;
    var buffer = '';
    var lowerCasePath = trimmedPath.toLocaleLowerCase();

    req.on('data', function(data) {
      buffer += decoder.write(data);
    });

    req.on('end', function() {
      buffer += decoder.end();
    
      var selectedHandler = typeof(myRoutes[lowerCasePath]) !== 'undefined' ? myRoutes[lowerCasePath] : routeHandler.notFound;
      var data = {
        'trimmedPath' : lowerCasePath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      selectedHandler(data,function(statusCode,payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode:200;
            payload = typeof(payload) == 'object'? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("Returning this response: ",statusCode,payloadString);
      });


    });
    
    
    
});

myServer.listen(8000,function(){
console.log('server is listening on port '+8000);
});

var routeHandler = {};

routeHandler.hello = function(data,callback){
    callback(200,{'successResponse':'Hey there. Thanks for the ping !..Happy coding'});
};

routeHandler.notFound = function(data,callback){
 callback(404);
};


var myRoutes = {
    'hello':routeHandler.hello
}

