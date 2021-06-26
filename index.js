const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

const server = http.createServer(function (req,res){
  // Get the URL and parse it
  let parseUrl = url.parse(req.url, true);
   
  // Get de path
  let path = parseUrl.pathname;
  let trimedPath = path.replace(/^\/+|\/+$/g,'');
  
  // Get the query string as an object
  let queryStringObject = parseUrl.query;

  // Get the HTTP Method
  let method = req.method.toLowerCase();

  // Get the headers as an object
  let headers = req.headers;

  // Get the payload, if any
  let decoder = new StringDecoder('uft-8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer +=  decoder.end();
    
    // Choose the handler this request should got to. if one is not
    let chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object ot send to the handler;
    let data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chooseHandler(data, function(statusCode, payload) {
      // Use the status code called back by the handler, or default
     statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

     // Use the payload called back by the handler, or default to
     payload = typeof(payload) == object ? payload : {};

     // Convert the payload to a string
     let payloadString = JSON.stringfy(payload);

 
      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    
      // Log de request path
      console.log('Request received on path: /', trimedPath);
      console.log(statudCode,' -- Request method: ', method);
    });
  });
});

// Start the server
server.listen(config.port, function() {
  console.log(`${config.envName}: server is running on localhost:${config.port} ...`);
});

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  //
  callback(406, {'name': 'sample handler'});
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Define a request router
let router = {
  'sample': handlers.sample
}
