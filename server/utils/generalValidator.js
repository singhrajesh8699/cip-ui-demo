'use strict';

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/


var valueExists = function(obj) {
	return obj && obj !== 'null' && obj !== 'undefined';
}

var stringValueExists = function(value) {
	if(valueExists(value)) {
		if(typeof value === 'string') {
			return value.trim() !== '';
		}
	}
	return false;
}

var intValueExists = function(value) {
	if(valueExists(value)) {
		return typeof value === 'number';
	}
	return false;
}

var booleanValueExists = function(value) {
	if(valueExists(value)) {
		return typeof value === 'boolean';
	}
	return false;
}

var validateEmailSyntax = function(email) {
	if(stringValueExists(email)) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	return false;
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

module.exports = {
	stringValueExists: stringValueExists,
	intValueExists: intValueExists,
	booleanValueExists: booleanValueExists,
	validateEmailSyntax: validateEmailSyntax,
	valueExists: valueExists
}
