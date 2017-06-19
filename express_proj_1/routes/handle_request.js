
function login(request, response) {
	var result = {
		'title':'Title from Control'
	}

	response.render('login', result);
}

module.exports.login = login;



function handle_login(request, response) {

	console.log(" request.body " + JSON.stringify(request.body))

	var user_name = request.body.user_name;
	var password = request.body.password;

	console.log(user_name)
	console.log(password)


	response.render('login');
}
module.exports.handle_login = handle_login;







