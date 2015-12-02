// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
	// your code goes here


	function findTypeOfConstructor(first, last) {
		return function (str) {
			return str[0] === first && str[str.length - 1] === last;
		};
	}

	var isString = function (str) {
		try {
			eval(str);
		} catch (e) {
			if (e instanceof SyntaxError) {
				throw new SyntaxError('Invalid JSON Input');
			}
		}
		return findTypeOfConstructor('"', '"')(str);
	};
	var isObject = findTypeOfConstructor('{', '}');
	var isArray = findTypeOfConstructor('[', ']');
	var isNumber = function (str) {
		return Number(str) + '' === str;
	};
	var removeExtraChar = function (str) {
		return str.substr(1).slice(0, str.length - 2);
	};


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
				} else if (currentChar === char && doubleQuoteClosed && closedCurlybracket && closedBracket) {
					result.push(currentStr.trim());
					currentStr = '';
				} else {
					currentStr += currentChar;
				}

			}
			
			if (currentStr !== "") {
				result.push(currentStr.trim());
			}

			return result;
		};

	};

	var splitByColon = splitBy(':');
	var splitByComma = splitBy(',');

	var parseStrings = function (str) {
		str = str.trim();
		if (isArray(str)) {
			return splitByComma(removeExtraChar(str)).map(parseStrings);
		} else if (isObject(str)) {
			var newObj = {};
			var splittedByComma = splitByComma(removeExtraChar(str));

			splittedByComma.forEach(function (values) {
				var splittedByColon = splitByColon(values);
				newObj[parseStrings(splittedByColon[0])] = parseStrings(splittedByColon[1]);
			});
			return newObj;
		} else if (isNumber(str)) {
			return Number(str);
		} else if (isString(str)) {
			return removeExtraChar(str).replace(/([\\]{1})([\\\"]{1})/g, '$2');
		} else if (str === 'true') {
			return true;
		} else if (str === "false") {
			return false;
		} else if (str === "null") {
			return null;
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