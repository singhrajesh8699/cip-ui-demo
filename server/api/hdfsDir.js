var express = require('express'),
  router = express.Router();

var hdfsDirManager = require('../hdfs/directoryOperations');
var apiResponse = require('../utils/apiResponse');
var apiErrors = require('../utils/apiErrors');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getDirectoryContent = function(req, res) {
	hdfsDirManager.getDirectoryContent(req.query.dirName, function(err, response, body) {
		if(err == null) {
			apiResponse.sendResponse(JSON.parse(body), 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var getDirectoryContentSummary = function(req, res) {
	hdfsDirManager.getDirectoryContentSummary(req.query.dirName, function(err, response, body) {
		if(err == null) {
			apiResponse.sendResponse(JSON.parse(body), 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var createDir = function(req, res) {
	hdfsDirManager.createDir(req.query.dirName, function(err, response, body) {
		if(err == null) {
			apiResponse.sendResponse(null, 200, req, res);
		}
		else{
			apiResponse.sendError(apiErrors.APPLICATION.INTERNAL_ERROR, body, 500, req, res);
		}
	});
};

var deleteDir = function(req, res) {
	hdfsDirManager.deleteDir(req.query.dirName, function(err, response, body) {
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

router.get('/hdfsdir/content', getDirectoryContent);
router.get('/hdfsdir/summary', getDirectoryContentSummary);
router.put('/hdfsdir/', createDir);
router.delete('/hdfsdir/', deleteDir);

module.exports = router;
