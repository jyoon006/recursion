// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
	// your code goes here

	//determines the constructor of JSON string input by checking first and last value in the string
	var checkJSONconstructor = function (str) {
		var first = str[0];
		var last = str[str.length - 1];

		if (first === '"' && last === '"') {
			return 'stringConstructor';
		} else if (first === '{' && last === '}') {
			return 'objectConstructor';
		} else if (first === '[' && last === ']') {
			return 'arrayConstructor';
		} else if (Number(str) + '' === str) {
			return 'numberConstructor';
		}
	};
	//removes extra quotation mark in strings, removes brackets in array after it determines the inputted JSON string is an array in order to split the string inside array, and removes object brackets surrounding the JSON string in order to split the string inside the object
	var removeExtraChar = function (str) {
		return str.substr(1).slice(0, str.length - 2);
	};
	//this splits the input JSON string according to the character. Because this function is ran after removing the extra quotation, object bracket, or array bracket, it splits according to the string inside of the constructors. loops through string and checks to see if following statements are met.
	var splitBy = function (char) {
		return function (str) {
			var result = [];
			var currentStr = '';
			var openCurlyBracket = 0;
			var closedCurlybracket = true;
			var openBracket = 0;
			var closedBracket = true;
			var doubleQuoteClosed = true;


			for (var i = 0; i < str.length; i++) {
				var currentChar = str[i];

				if (currentChar === '{') {
					openCurlyBracket++;
					closedCurlybracket = false;
					currentStr += currentChar;
				} else if (currentChar === '}') {
					openCurlyBracket--;
					currentStr += currentChar;
					if (openCurlyBracket === 0) {
						closedCurlybracket = true;
					}
				} else if (currentChar === '[') {
					openBracket++;
					closedBracket = false;
					currentStr += currentChar;
				} else if (currentChar === ']') {
					openBracket--;
					currentStr += currentChar;
					if (openBracket === 0) {
						closedBracket = true;
					}
				} else if (currentChar === '"') {
					doubleQuoteClosed = !doubleQuoteClosed;
					currentStr += currentChar;
					//if the iteration is at the character (: or ,) it checks to see if quotation, curly bracket, and bracket has been closed. if this is true, it pushes to result's array and current string result is reset and iterates until string is finished. 
				} else if (currentChar === char && doubleQuoteClosed && closedCurlybracket && closedBracket) {
					result.push(currentStr.trim());
					currentStr = '';
				} else {
					currentStr += currentChar;
				}

			}
			//if there were no other character (: or ,) met, it pushes the current string result into an array. For example if the JSON string were '{"a": "b", "c": "d"}', and character we were splitting was by comma, the top statement will add "a": "b" to array because the quotation marks are closed when character comma is reached. But after it pushes the current string and resets to empty string, the iteration still continues but it will not run the top statement due to not having character of comma present, so after the loop is done, and if the current string is not empty it will push rest of iteration into the result's array which will be "c": "d".
			if (currentStr !== "") {
				result.push(currentStr.trim());
			}

			return result;
		};

	};
	//variable holder for invoking splitBy function. Because if we were to use these variables, and due to being a function variable holder, we can simply invoke the variable with string as parameter to curry.
	var splitByComma = splitBy(",");
	var splitByColon = splitBy(":");

	var parseStrings = function (jsonStr) {

		jsonStr = jsonStr.trim(); //removes all unecessary spaces.
		
		//if the JSON is object, we first split by commas so that we can keep same object values together. After we split into comma, we run iteration through the splitted array and for each values, we split by colon to split the  value of property and key value. Once we split the array into property and key value, we can use recursive call to parseStrings function in-order to see what type of constructor the value is. Once the value runs through recursive call and the value is returned according to the constructor, we can use these values to set up in new object by using property values to equal to key values of the returned value.
		if (checkJSONconstructor(jsonStr) === 'objectConstructor') {
			var newObj = {};
			var splittedByComma = splitByComma(removeExtraChar(jsonStr));
			splittedByComma.forEach(function (item) {
				var splittedByColon = splitByColon(item);
				newObj[parseStrings(splittedByColon[0])] = parseStrings(splittedByColon[1]);
			});
			return newObj;
		}
		//if JSON is an array, we can use splitByComma to split the values inside the array by commas. Since array's do not contain colon, unless an object is within the array value, we do not need to run splitByColon function. Once we iterate through the split by comma array, we can recursively call the function using map to transform the value depending on their constructor and returning that value.
		else if (checkJSONconstructor(jsonStr) === 'arrayConstructor') {
			return splitByComma(removeExtraChar(jsonStr)).map(parseStrings);
		}
		//if JSON is a string, it first tests if eval() function fails, incase an invalid string is inputted. If eval() function fails, it will throw synthax error. if not it removes the extra quotation surrounding the string and replaces any unecessar backslash character from JSON string.
		else if (checkJSONconstructor(jsonStr) === 'stringConstructor') {
			try {
				eval(jsonStr);
			} catch (e) {
				if (e instanceof SyntaxError) {
					throw new SyntaxError('Invalid JSON Input');
				}
			}
			return removeExtraChar(jsonStr).replace(/([\\]{1})([\\\"]{1})/g, '$2');
		} else if (checkJSONconstructor(jsonStr) === 'numberConstructor') {
			return Number(jsonStr);
		} else if (jsonStr === 'true') {
			return true;
		} else if (jsonStr === 'false') {
			return false;
		} else if (jsonStr === 'null') {
			return null;
		} else if (jsonStr === 'undefined') {
			return undefined;
		}
		//if the JSON inputted is invalid eval() it will throw an error. In case of '["foo", "bar"' , since it's missing the ending bracket of an array, it is not a valid JSOn and throw an error. This test will only protect and throw error if the JSON string is invalid from beginning, whereas top test will throw an error, after the recursive call, and the string is an invalid JSON string, for example '["foo", "bar\\"]'. This JSON will first run through array constructor, but as soon as it iterates and checks to see if the string within the array is valid JSON, it will throw an error due to backslash character at the second value.
		try {
			eval(jsonStr);
		} catch (e) {
			if (e instanceof SyntaxError) {
				throw new SyntaxError('Invalid JSON Input');
			}
		}

	};
	return parseStrings(json);
};

parseableStrings = [
  // basic stuff
  '[]',
  '{"foo": ""}',
  '{}',
  '{"foo": "bar"}',
  '["one", "two"]',
  '{"a": "b", "c": "d"}',
  '[null,false,true]',
  '{"foo": true, "bar": false, "baz": null}',
  '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  '{"boolean, true": true, "boolean, false": false, "null": null }',

  // basic nesting
  '{"a":{"b":"c"}}',
  '{"a":["b", "c"]}',
  '[{"a":"b"}, {"c":"d"}]',
  '{"a":[],"c": {}, "b": true}',
  '[[[["foo"]]]]',

  // escaping
  '["\\\\\\"\\"a\\""]',
  '["and you can\'t escape thi\s"]',

  // everything all at once
  '{"CoreletAPIVersion":2,"CoreletType":"standalone",' +
    '"documentation":"A corelet that provides the capability to upload' +
    ' a folderâ€™s contents into a userâ€™s locker.","functions":[' +
    '{"documentation":"Displays a dialog box that allows user to ' +
    'select a folder on the local system.","name":' +
    '"ShowBrowseDialog","parameters":[{"documentation":"The ' +
    'callback function for results.","name":"callback","required":' +
    'true,"type":"callback"}]},{"documentation":"Uploads all mp3 files' +
    ' in the folder provided.","name":"UploadFolder","parameters":' +
    '[{"documentation":"The path to upload mp3 files from."' +
    ',"name":"path","required":true,"type":"string"},{"documentation":' +
    ' "The callback function for progress.","name":"callback",' +
    '"required":true,"type":"callback"}]},{"documentation":"Returns' +
    ' the server name to the current locker service.",' +
    '"name":"GetLockerService","parameters":[]},{"documentation":' +
    '"Changes the name of the locker service.","name":"SetLockerSer' +
    'vice","parameters":[{"documentation":"The value of the locker' +
    ' service to set active.","name":"LockerService","required":true' +
    ',"type":"string"}]},{"documentation":"Downloads locker files to' +
    ' the suggested folder.","name":"DownloadFile","parameters":[{"' +
    'documentation":"The origin path of the locker file.",' +
    '"name":"path","required":true,"type":"string"},{"documentation"' +
    ':"The Window destination path of the locker file.",' +
    '"name":"destination","required":true,"type":"integer"},{"docum' +
    'entation":"The callback function for progress.","name":' +
    '"callback","required":true,"type":"callback"}]}],' +
    '"name":"LockerUploader","version":{"major":0,' +
    '"micro":1,"minor":0},"versionString":"0.0.1"}',
  '{ "firstName": "John", "lastName" : "Smith", "age" : ' +
    '25, "address" : { "streetAddress": "21 2nd Street", ' +
    '"city" : "New York", "state" : "NY", "postalCode" : ' +
    ' "10021" }, "phoneNumber": [ { "type" : "home", ' +
    '"number": "212 555-1234" }, { "type" : "fax", ' +
    '"number": "646 555-4567" } ] }',
  '{\r\n' +
    '          "glossary": {\n' +
    '              "title": "example glossary",\n\r' +
    '      \t\t"GlossDiv": {\r\n' +
    '                  "title": "S",\r\n' +
    '      \t\t\t"GlossList": {\r\n' +
    '                      "GlossEntry": {\r\n' +
    '                          "ID": "SGML",\r\n' +
    '      \t\t\t\t\t"SortAs": "SGML",\r\n' +
    '      \t\t\t\t\t"GlossTerm": "Standard Generalized ' +
    'Markup Language",\r\n' +
    '      \t\t\t\t\t"Acronym": "SGML",\r\n' +
    '      \t\t\t\t\t"Abbrev": "ISO 8879:1986",\r\n' +
    '      \t\t\t\t\t"GlossDef": {\r\n' +
    '                              "para": "A meta-markup language,' +
    ' used to create markup languages such as DocBook.",\r\n' +
    '      \t\t\t\t\t\t"GlossSeeAlso": ["GML", "XML"]\r\n' +
    '                          },\r\n' +
    '      \t\t\t\t\t"GlossSee": "markup"\r\n' +
    '                      }\r\n' +
    '                  }\r\n' +
    '              }\r\n' +
    '          }\r\n' +
    '      }\r\n'
];

_.each(parseableStrings, function(item) {
	console.log(parseJSON(item));
	console.log(JSON.parse(item));
	
});