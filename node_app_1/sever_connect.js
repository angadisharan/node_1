var http = require('http')
var connect = require('connect')

connect.use("/", function(request, response, next){
	console.log("inside /");
	// response.writeHead({"Content-Type": "plain/text"});
	// response.write("I am content from server ");
	// response.end();	
});

http.createServer(connect).listen(3001);