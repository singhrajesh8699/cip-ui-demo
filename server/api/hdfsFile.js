var express = require('express'),
  router = express.Router();

var hdfsFileManager = require('../hdfs/fileOperations');
var apiResponse = require('../utils/apiResponse');
var apiErrors = require('../utils/apiErrors');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var readFile = function(req, res) {
	hdfsFileManager.readFile(req.query.fileName, function(err, body) {
		if(err == null) {
			apiResponse.sendResponse(body.toString(), 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var getFileDetails = function(req, res) {
	hdfsFileManager.getFileDetails(req.query.fileName, function(err, response, body) {
		if(err == null) {
			apiResponse.sendResponse(JSON.parse(body), 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var createFile = function(req, res) {

	hdfsFileManager.createFile(req.query.fileName, function(err, response, body) {
		console.log(response.statusCode);
		if(err == null) {
			apiResponse.sendResponse(null, 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var deleteFile = function(req, res) {
	hdfsFileManager.deleteFile(req.query.fileName, function(err, response, body) {
		if(err == null) {
			apiResponse.sendResponse(null, 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

router.get('/hdfsfile/', readFile);
router.get('/hdfsfile/details', getFileDetails);
router.put('/hdfsfile/', createFile);
router.delete('/hdfsfile/', deleteFile);

module.exports = router;
