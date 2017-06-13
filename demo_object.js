var my_first_object = {
	first_name : "John",
	last_name : "Deo",
	address : {
		landmark: "Near B Bar",
		house_no : "420"
	}
}


var my_second_obj = my_first_object

console.log(JSON.stringify(my_first_object, ' ', 4));

my_second_obj.first_name = "Mahi"

console.log(JSON.stringify(my_first_object, ' ', 4));




// [

// 	{ "_id":1, "first_name": "Mallu"}
// 	, {"_id":2 "first_name": "Ram"}
// 	, { "_id":3 "first_name": "Sita"}
// ]

