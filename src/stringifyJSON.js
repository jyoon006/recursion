// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
	if(obj === null) {
		return String(null); 	
	}
	else if(obj.constructor === Boolean || obj.constructor === Number) {
		return String(obj);
	}
	else if(obj.constructor === String) {
		return '"' + obj + '"';
	}
	else if(obj.constructor === Array) {
		var arr = [];
		_.each(obj, function(item) {
			arr.push(stringifyJSON(item));
		});
		return '[' + arr.join(",") + ']';
	}
	else if(obj.constructor === Object) {
		var objArr = [];
		for(var prop in obj) {
			if(obj[prop] != null && obj[prop].constructor === Function) {
				return '{}';
			}
			objArr.push(stringifyJSON(prop) + ":" + stringifyJSON(obj[prop]));
		}
		return '{' + objArr.join(",") + '}';
	}
	
};