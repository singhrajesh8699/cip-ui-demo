/**
 * The apiResponse is a helper utility for sending response to user
 *
 * @author DroidBoyJr
 * created on 2016-08-23
 */

var mongoose = require('mongoose'),
	async = require('async');

var config = require("../config/config.js");

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

/**
 * Send simple response with mentioned response status code
 * @param  {JSON Object/Array} data       - Data to be returned
 * @param  {int} status                   - Http status code to be returned
 * @param  {HttpResponse} res             - NodeJS response object
 */
var sendResponse = function(data, status, req, res) {
  	var response = {
						  				status: {
											message: "success",
											statusCode: 0
										},
                    payload: data
                 };

  	addVerifiedHeaders(req, response);

  	res.status(status).json(response);
};

/**
 * Send response of requested paginated data
 * @param  {Array} data       - Data to be returned
 * @param  {int} pageNumber   - Current page number
 * @param  {int} start        - Starting record index number
 * @param  {int} total        - Total records for query considering all pages
 * @param  {int} status       - Http status code to be returneds
 * @param  {HttpResponse} res - NodeJS response object
 */
var sendPaginatedResponse = function(data, pageNumber, start, count, total, status, req, res) {
	var response = {
	  				status: {
						message: "success",
						statusCode: 0
					},
					payload: data,
                    meta: {}};

	if(typeof pageNumber === 'number'){
		response.meta.page_number = pageNumber;
	}

	if(typeof start === 'number'){
		response.meta.start = start;
	}

	if(typeof count === 'number'){
		response.meta.count = count;
	}

	console.log((typeof total).toString());

	if(typeof total === 'number'){
		response.meta.total = total;
	}

  	addVerifiedHeaders(req, response);

  	res.status(status).json(response);
};

/**
 * Return error to user
 * @param  {Object} error     - ApiError object
 * @param  {int} status       - Http status code to be returneds
 * @param  {HttpResponse} res - NodeJS response object
 */
var sendError = function(error, data, status, req, res) {
	var response = {
										success: false,
	                	status: error,
	                	payload: data
	              };

	addVerifiedHeaders(req, response);

  	res.status(status).json(response);
};

/*= End of Public methods =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var addVerifiedHeaders = function(req, response) {
	if(req.user_id) {
		response.verified = true;
		response.authenticated = true;
		response.expiresAt = req.expires_at;
		response.sid = req.headers[config.X_AUTHORIZATION_HEADER];
	}
	else{

	}
}

/*= End of Private methods =*/
/*=============================================<<<<<*/


module.exports = {
  sendResponse: sendResponse,
  sendPaginatedResponse: sendPaginatedResponse,
  sendError: sendError
};
