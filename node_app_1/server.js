var http = require('http')

var requestListner = function(request , response){

	if (request.method == 'GET') {
		return handleGetRequest(request, response)
	} else if (request.method == 'POST'){
		return handlePostRequest(request, response);
	} else {
		return handleOther(request, response);
	}
}

function handleGetRequest(request, response) {
	console.log("Inside requestListner ");
	console.log(" request type " + request.method)
	console.log(" request url " + request.url)

	response.writeHead({"Content-Type": "plain/text"});

	switch(request.url){
		case '/':
			response.write("Hello welcome to Http Home ");
			break;
		case '/users':
			response.write("Welcome to Users page");
			break;
		case '/admin':
			response.write("Welcome to Admin page");
			break;
		default:
			response.write("404 request not found ");
			break;
	}
	response.end();
}


function handlePostRequest(request, response){
	response.writeHead({"Content-Type": "plain/text"});
	response.write("Not handleing POST request yet");
	response.end();	
}

function handleOther(request, response){
	response.writeHead({"Content-Type": "plain/text"});
	response.write("Not handleing " + request.method " request yet");
	response.end();	
}


http.createServer(requestListner).listen(3000);





