
var my_callback  = function(){
	console.log("Done with work .......");

}

var my_waiting = function(){
	console.log("Inside callback waiting .......");

	setTimeout(my_callback, 4000);

}

my_waiting();





