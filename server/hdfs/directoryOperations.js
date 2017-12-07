'use strict';

var path = require('path'),
	request = require('request');

var hdfsConfig = require('../config/hdfs');
var hdfsActions = require('../utils/hdfsActions');

/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var getDirectoryContent = function(dirName, callback) {
	if(dirName[0] === '/') {
		dirName = dirName.substring(1, dirName.length);
	}

	var reqURL = hdfsConfig.COMPLETE_BASE_URL + dirName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.DIR_CONTENT);

	var options = {
		method: "GET",
		url: reqURL
	};

	request(options, callback);
};

var getDirectoryContentSummary = function(dirName, callback) {
	if(dirName[0] === '/') {
		dirName = dirName.substring(1, dirName.length);
	}

	var reqURL = hdfsConfig.COMPLETE_BASE_URL + dirName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.DIR_CONTENT_SUMMARY);

	var options = {
		method: "GET",
		url: reqURL
	};

	request(options, callback);
};

var createDir = function(dirName, callback) {
	if(dirName[0] === '/') {
		dirName = dirName.substring(1, dirName.length);
	}

	var reqURL = hdfsConfig.COMPLETE_BASE_URL + dirName;
	reqURL += "?" + hdfsConfig.getBaseParamsForRequest(hdfsActions.MAKE_DIRECTORY);

	var options = {
		method: "PUT",
		url: reqURL,
		followAllRedirects: true
	};
	console.log(reqURL);
	request(options, callback);
};

var deleteDir = function(dirName, callback) {
	if(dirName[0] === '/') {
		dirName = dirName.substring(1, dirName.length);
	}
	var reqURL = hdfsConfig.COMPLETE_BASE_URL + dirName;
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
	getDirectoryContent: getDirectoryContent,
	getDirectoryContentSummary: getDirectoryContentSummary,
	createDir: createDir,
	deleteDir: deleteDir
};
