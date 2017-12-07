/**
 * Middleware for validating payload checksum
 *
 * @author DroidBoyJr
 * created on 2016-08-29
 */

var config = require('../config/config');
var apiErrors = require('./apiErrors');
var jwt = require('jsonwebtoken');
var sha256 = require('sha256');
var apiResponse = require('./apiResponse');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var validateIVTokenString = function(req, res, next) {
	try {
		var checksumInHeader = getChecksumIfExistsOrThrow(req, res);

		// Get single string from all the values appended
		var payloadValues = getpayloadValues(req.body);

		// Generate SHA256 from the values appended String
		var payloadValuesSHA = sha256(payloadValues);


		// Uncomment followinng code while testing to generate
		// a json webtoken to be sent in 'payload_checksum' header
		var isoDate = new Date().toISOString();
		var inputToEncrypt = {mac: payloadValuesSHA, ts: isoDate};
		var tokenObject = {kty: "oct", k: inputToEncrypt};

		// Decode payload checksum header JWT
		var decodedTokenInHeader = jwt.verify(checksumInHeader, config.TOKEN_SECRET);

		// If checksum in header and checksum calculated from payload doesn't match
		// return 400 with invalid payload checksum error
		if(null == decodedTokenInHeader || payloadValuesSHA !== decodedTokenInHeader.k.mac) {
			return apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD_CHECKSUM,
	                            	null, 400, req, res);
		}

		var timeStampInHeader = new Date(decodedTokenInHeader.k.ts);
		var timeSinceRequest = (new Date().getTime()) - timeStampInHeader.getTime();

        // Check if the request is TimedOut
    if(timeSinceRequest > config.REQUEST_TIMEOUT) {
			return apiResponse.sendError(apiErrors.APPLICATION.REQUEST_TIMEOUT,
	                            	null, 408, req, res);
		}

		// If everything works out, call the next function to process request
		next();
	}catch(ex) {
		if(ex.name === 'JsonWebTokenError') {
			apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD_CHECKSUM,
	                            	null, 400, req, res);
		}
		console.log(ex);
	}
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/

var getChecksumIfExistsOrThrow = function(req, res) {
	if (!req.headers[config.PAYLOAD_CHECKSUM_HEADER_NAME]) {
        apiResponse.sendError(apiErrors.APPLICATION.INVALID_PAYLOAD_CHECKSUM,
                            	null, 400, req, res);
		throw new Error(apiErrors.APPLICATION.INVALID_PAYLOAD_CHECKSUM);
    }
	return req.headers[config.PAYLOAD_CHECKSUM_HEADER_NAME];
};

var getpayloadValues = function(payload) {
	var keySet = Object.keys(payload);
	keySet.sort();

	var valuesString = '';
	keySet.forEach(function(currentItem) {
		valuesString += payload[currentItem];
	});

	return valuesString;
};
/*= End of Private methods =*/
/*=============================================<<<<<*/


module.exports = {
    validateIVTokenString: validateIVTokenString
}
