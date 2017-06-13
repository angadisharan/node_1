var my_demo_prototype = function(){
	this.first_name = ""
	this.last_name = ""
	this.score = 100
}

var temp_user1 = new my_demo_prototype()
temp_user1.first_name = "John"
console.log(JSON.stringify(temp_user1, " ", 4));


var temp_user2 = new my_demo_prototype()
temp_user2.first_name = "Mahi"
console.log(JSON.stringify(temp_user2, " ", 4));
