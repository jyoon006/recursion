// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className
){
  // your code here
var result = [];
 function hasClass(el) {
  if(el.classList && el.classList.contains(className)) {
		result.push(el);
	}
	
	_.each(el.childNodes, function(node) {
		hasClass(node);
	});
 }
 hasClass(document.body);
 return result;
};
