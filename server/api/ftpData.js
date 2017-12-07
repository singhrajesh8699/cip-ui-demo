'use strict';

var express = require('express'),
  router = express.Router(),
  _ = require("lodash"),
	async = require('async'),
  apiResponse = require('../utils/apiResponse'),
  apiErrors = require('../utils/apiErrors'),
  config = require('../config/config'),
	path = require('path'),
	JSFtp = require("jsftp");

var hdfsFileManager = require('../hdfs/fileOperations');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var checkConnection = function(req, res) {
	var Ftp = new JSFtp(req.body.ftpConfig);
	Ftp.auth(username, password, function(err, response) {
		if(err){
			return apiResponse.sendError(apiErrors.FTP.AUTH_FAILED, null, 401, req, res);
		}
		apiResponse.sendResponse(null, 200, req, res);
	});
};

var getContentList = function(req, res) {
	var Ftp = new JSFtp(req.body.ftpConfig);
	Ftp.ls(req.query.filePath, function(err, data) {
		if(err){
			return apiResponse.sendError(apiErrors.FTP.REQUEST_FAILED, null, 500, req, res);
		}
		apiResponse.sendResponse(data, 200, req, res);
	});
};

var pushFileToHDFS = function(req, res) {
	var Ftp = new JSFtp(req.body.ftpConfig);

	var data = ""; // Will store the contents of the file

	var ftpFile = req.body.ftpFile;
	var fileName = path.baseName(ftpFile);

  Ftp.get(ftpFile, function(err, socket) {
    if (err) {
			return apiResponse.sendError(apiErrors.FTP.GET_FILE_FAILED, null, 500, req, res);
		}

    socket.on("data", function(d) { data += d.toString(); })

		socket.on("close", function(hadErr) {
      if (hadErr) {
        apiResponse.sendError(apiErrors.FTP.GET_FILE_FAILED, null, 500, req, res);
			}
			else{
				hdfsFileManager.writeFTPtoFile(fileName, data, function(err, response) {
					if(err){
						return apiResponse.sendError(apiErrors.FTP.REQUEST_FAILED, null, 500, req, res);
					}
					apiResponse.sendResponse(null, 200, req, res);
				});
			}
    });

    socket.resume();
  });
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

router.post('/ftp/connect', checkConnection);
router.get('/ftp/content', getContentList);
router.post('/ftp/tohdfs', pushFileToHDFS);

module.exports = router;
