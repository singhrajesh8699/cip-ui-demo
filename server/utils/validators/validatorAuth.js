'use strict';

var apiErrors = require('../apiErrors'),
	apiResponse = require('../apiResponse'),
	generalValidator = require('../generalValidator');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

/**
 * Validate POST parameters for sign-up API
 */
var validateLocalSignup = function(req, res, next) {

	if(!generalValidator.valueExists(req.body)) {
		return apiResponse.sendError(apiErrors.USER.NO_PARAMETERS_RECEIVED,
								null, 400, req, res);
	}

	if(!generalValidator.stringValueExists(req.body.name) ) {
		return apiResponse.sendError(apiErrors.USER.NO_NAME_RECEIVED,
								null, 400, req, res);
	}

	if(!generalValidator.validateEmailSyntax(req.body.email)) {
		return apiResponse.sendError(apiErrors.USER.INVALID_EMAIL_RECEIVED,
								null, 400, req, res);
	}

	if(!generalValidator.stringValueExists(req.body.password)) {
		return apiResponse.sendError(apiErrors.USER.NO_PASSWORD_RECEIVED,
								null, 400, req, res);
	}

	next();
};


/**
 * Validate POST parameters for login API
 */
var validateLocalLogin = function(req, res, next) {

	if(!generalValidator.valueExists(req.body)) {
		return apiResponse.sendError(apiErrors.USER.NO_PARAMETERS_RECEIVED,
								null, 400, req, res);
	}

	if(!generalValidator.validateEmailSyntax(req.body.email)) {
		return apiResponse.sendError(apiErrors.USER.INVALID_EMAIL_RECEIVED,
								null, 400, req, res);
	}

	if(!generalValidator.stringValueExists(req.body.password)) {
		return apiResponse.sendError(apiErrors.USER.NO_PASSWORD_RECEIVED,
								null, 400, req, res);
	}

	next();
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

module.exports = {
	validateLocalSignup: validateLocalSignup,
	validateLocalLogin: validateLocalLogin
}
