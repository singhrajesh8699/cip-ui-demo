/**
 * Middleware for header validation, session validation checks and API keys check
 *
 * @author DroidBoyJr
 * created on 2016-08-23
 */

var mongoose = require('mongoose');

var apiResponse = require('../utils/apiResponse.js');
var apiErrors = require('../utils/apiErrors.js');
var jwt = require('jwt-simple');
var config = require('../config/config.js');


/**
 * Authorize admin API key and session token
 */
var adminAuthorization = function(req, res, next) {

  // Check session token header exists
  if (!req.headers[config.X_AUTHORIZATION_HEADER]) {
    return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
                                  401, req, res);
  }

  var token = req.headers[config.X_AUTHORIZATION_HEADER].split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  // Validate user role from token
  if(payload.sub.role !== config.USER_ROLE.ADMIN) {
    return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
                                  401, req, res);
  }

  req.user_id = payload.sub.id;
  req.user_role = payload.sub.role;

  req.expires_at = new Date(user.exp).getTime();

  next();
};

/**
 * Authorize user API key and session token
 */
var authorizationCheck = function(req, res, next) {

	console.log(req.headers);
  // Check session token header exists
  if (!req.headers[config.X_AUTHORIZATION_HEADER]) {
    return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
                                  401, req, res);
  };

  var token = req.headers[config.X_AUTHORIZATION_HEADER].split(" ")[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  // Validate user role from token
  // if(payload.sub.role !== config.USER_ROLE.USER) {
  //   return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
  //                                 401, req, res);
  // }


  req.user_id = payload.sub.id;
  // req.user_role = payload.sub.role;
  //
	req.tenant_id = payload.sub.tenant_id;
	console.log("tenant requesting " + req.tenant_id);

  req.expires_at = new Date(payload.exp).getTime();

  next();
};

/**
 * Authorize any logged in user type with respective API key and session token.
 */
var loggedInUserAuthorization = function(req, res, next) {

  // Check session token header exists
  if (!req.headers[config.X_AUTHORIZATION_HEADER]) {
    return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
                                  401, req, res);
  };

  var token = req.headers[config.X_AUTHORIZATION_HEADER].split(" ")[1];
  var user = jwt.decode(token, config.TOKEN_SECRET);

  // Check correct API key is recieved in header respective to user role
  if(user.role !== config.USER_ROLE.USER && user.role === config.USER_ROLE.ADMIN) {
    return apiResponse.sendError(apiErrors.APPLICATION.UNAUTHORIZED_REQUEST, null,
                                  401, req, res);
  }

  req.user_id = user.sub.id;
  req.user_role = user.sub.role;
	req.tenant_id = user.sub.tenant_id;

  req.expires_at = new Date(user.exp).getTime();

  next();
}

/**
 * Get user role from request
 */
var getUserRole = function(req, res, next) {
  if (!req.headers[config.X_AUTHORIZATION_HEADER]) {
      req.user_role = config.USER_ROLE.GUEST
  }
  else{
    var token = req.headers[config.X_AUTHORIZATION_HEADER].split(" ")[1];
    var user = jwt.decode(token, config.TOKEN_SECRET);
    req.user_id = user.sub.id;
    req.user_role = user.sub.role;
  }
};

var validateAPIKey = function(req, res, next) {
    // if (!req.headers[config.API_KEY_HEADER_NAME]
    //     || req.headers[config.API_KEY_HEADER_NAME] !== config.API_KEY) {
    //     return apiResponse.sendError(apiErrors.APPLICATION.INVALID_API_KEY,
    //                         null, 401, req, res);
    // }
    next();
}

module.exports = {
    adminAuthorization: adminAuthorization,
    authorizationCheck: authorizationCheck,
    loggedInUserAuthorization: loggedInUserAuthorization,
    getUserRole: getUserRole,
    validateAPIKey: validateAPIKey
}
