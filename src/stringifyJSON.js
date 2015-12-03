// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
	//if the obj parameter passed in is null value, this will return as 'null' string value
	if(obj === null) {
		return String(null); 	
	}
	//if obj parameter is a Boolean (true of false) or is a number (any digit character) it will return string of that value
	else if(obj.constructor === Boolean || obj.constructor === Number) {
		return String(obj);
	}
	//if obj parameter is a string value, it will return the string value wrapped with extra quotation marks to show that the value that was converted is a string value
	else if(obj.constructor === String) {
		return '"' + obj + '"';
	}
	//if obj parameter is an array -
	else if(obj.constructor === Array) {
		var arr = []; //this new array created will hold all the values that gets returned from the recursive call. For example, in _.each iteration, it iterates through every value in the array. if the first item is a string, due to the recursive call, it will run stringifyJSON function again to check the constructor of the value. Because it is a string, it will push the returned string value from (if string) statement into the new array. Every if/else if statement will run for each item in the iteration.
		_.each(obj, function(item) {
			arr.push(stringifyJSON(item));
		});
		return '[' + arr.join(",") + ']'; //the arr after it pushes all item in the iteration will be joined as a string by comma in to separate each element and finally will add open and closed brackets into the front and end of string in order to have the array as a JSON string value.
	}
	else if(obj.constructor === Object) {
		var objArr = []; //if obj parameter is an object, first we create new array to hold values after we make a new string object. we iterate through the object that was passed in with for in loop. if the value in object is not null and if the value is function constructor, we return an empty string object. If the value is not a function constructor, we use recursion to get the constructor for the value. Because for in loop can get the property of object and value of object, we use recursion for both values of property and value of object. For example, property value has to be a string value, so stringifyJSON will be invoked through recursion and it will use the value returned from string statement. The value of the object will also recurse through the stringifyJSON function in order to get the value returned from whichever statement it runs through. 
		for(var prop in obj) {
			if(obj[prop] != null && obj[prop].constructor === Function) {
				return '{}';
			}
			objArr.push(stringifyJSON(prop) + ":" + stringifyJSON(obj[prop]));
		}
		
		return '{' + objArr.join(",") + '}'; //the returned array will be joined into string and will add open curly bracket and closed curly bracket to the front and end in order to make it a string object.
	}
	
};