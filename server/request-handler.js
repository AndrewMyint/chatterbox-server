/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var _ = require('underscore');

var objectId = 0;

var messages = {
  results: [
    {}
  ]
};

var handleRequest = function (request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  var headers = defaultCorsHeaders;

  if (request.method === 'OPTIONS') {
    headers['Content-Type'] = 'text/json';

    response.writeHead(200, headers);

    response.end();
  } else if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      headers['Content-Type'] = 'text/json';

      response.writeHead(200, headers);

      // We should respond with the messages.
      response.end(JSON.stringify(messages));
    } else {
      headers['Content-Type'] = 'text/plain';

      response.writeHead(404, headers);
      response.end('This webpage doesn\'t exist');
    }
  } else if (request.method === 'POST') {
    var requestBody = '';
    var responseObject;

    request.on('data', function(data) {
      requestBody += data;

      var newData = JSON.parse(data);

      objectId += 1;

      responseObject = {
        objectId: objectId,
        createdAt: new Date()
      };

      _.extend(newData, responseObject);

      messages.results.unshift(newData);

      if (requestBody.length > 1e7) {
        headers['Content-Type'] = 'text/plain';

        response.writeHead(413, headers);

        response.end('Request Entity Too Large');
      }
    });

    request.on('end', function() {
      headers['Content-Type'] = 'text/json';

      response.writeHead(201, headers);

      response.end(JSON.stringify(responseObject));
    });
  } else {
    response.writeHead(405, {'Content-Type': 'text/plain'});
    response.end('Request method not existed');
  }
};

exports.requestHandler = handleRequest;

// // The outgoing status.
// var statusCode = 200;

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

// // See the note above about CORS headers.
// var headers = defaultCorsHeaders;

// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.
// headers['Content-Type'] = 'text/html';

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.
// response.writeHead(statusCode, headers);

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
// response.end('<h1>test<h1>');

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// console.log('Serving request type ' + request.method + ' for url ' + request.url);
