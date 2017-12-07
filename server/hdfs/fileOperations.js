'use strict';

var path = require('path'),
	url = require('url'),
	request = require('request'),
	WEBHDFS = require('webhdfs');

var hdfsConfig = require('../config/hdfs');
var hdfsActions = require('../utils/hdfsActions');

var clientConfig = {};
clientConfig.user = hdfsConfig.DO_AS;
clientConfig.host = hdfsConfig.HOST;
clientConfig.port = hdfsConfig.PORT;
clientConfig.path = hdfsConfig.BASE_DIR;

var hdfs = WEBHDFS.createClient(clientConfig);

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getFileDetails = function(fileName, callback) {
	if(fileName[0] === '/') {
		fileName = fileName.substring(1, fileName.length);
	}
	var reqURL = hdfsConfig.COMPLETE_BASE_URL + fileName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.FILE_DETAILS);

	var options = {
		method: "GET",
		url: reqURL
	};

	request(options, callback);
};

var createFile = function(fileName, callback) {
	if(fileName[0] === '/') {
		fileName = fileName.substring(1, fileName.length);
	}
	var reqURL = hdfsConfig.COMPLETE_BASE_URL + fileName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.CREATE_FILE);

	var options = {
		method: "PUT",
		url: reqURL,
		followAllRedirects: true
	};

	request(options, callback);
};

var readFile = function(filePath, callback) {
	var remoteFileStream = hdfs.createReadStream(filePath);

	var finalData = [];
	remoteFileStream.on('error', function onError (err) {
	  callback(err, null);
	});

	remoteFileStream.on('data', function onChunk (chunk) {
	  finalData.push(chunk);
	});

	remoteFileStream.on('finish', function onFinish () {
		callback(null, Buffer.concat(finalData));
	});
}

var writeToFile = function(filePath, sourceFile, callback) {

	var localFileStream = fs.createReadStream(sourceFile);
	var remoteFileStream = hdfs.createWriteStream(filePath);

	localFileStream.pipe(remoteFileStream);

	remoteFileStream.on('error', function onError (err) {
	  callback(err, null);
	});

	remoteFileStream.on('finish', function onFinish () {
	  callback(null, null);
	});
};

var writeFTPToFile = function(filePath, dataStream, callback) {

	var remoteFileStream = hdfs.createWriteStream(filePath);

	datastream.pipe(remoteFileStream);

	remoteFileStream.on('error', function onError (err) {
	  callback(err, null);
	});

	remoteFileStream.on('finish', function onFinish () {
	  callback(null, null);
	});
};

var deleteFile = function(fileName, callback) {
	if(fileName[0] === '/') {
		fileName = fileName.substring(1, fileName.length);
	}
	var reqURL = hdfsConfig.COMPLETE_BASE_URL + fileName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.DELETE);

	var options = {
		method: "DELETE",
		url: reqURL,
		followAllRedirects: true
	};

	request(options, callback);
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= Private methods =
===============================================>>>>>*/



/*= End of Private methods =*/
/*=============================================<<<<<*/

module.exports = {
	getFileDetails: getFileDetails,
	createFile: createFile,
	readFile: readFile,
	writeToFile: writeToFile,
	deleteFile: deleteFile,
	writeFTPToFile: writeFTPToFile
};
