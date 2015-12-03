// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className
){
  // your code here
var result = [];  //created empty array to hold any element having same className inputted into function
	
//when hasClass function is invoked, if the element has classList node and if the classList array contains the name of className input, it will push that element into the result's array, if not it will run _.each iteration. 
 function hasClass(el) {
  if(el.classList && el.classList.contains(className)) {
		result.push(el);
	}
	
	//this will iterate through childNodes array in document.body, and for every childNode, it recurse using the same function call to check if it has classList array and if the classList array contains the className, if not it will run _.each function again until it finds the className or until it finishes iteration through all childNodes.
	_.each(el.childNodes, function(node) {
		hasClass(node);
	});
 }
 hasClass(document.body); //invoking inner hasClass function with document.body as parameter in order to find all the nodes inside document.body. Body section of html is usually the section where html tags are written 
 return result;
};
