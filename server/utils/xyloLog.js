'use strict';

var mongoose = require('mongoose'),
		async = require('async'),
		User = mongoose.models.User,
		XyloLog = mongoose.models.XyloLog;

const LOG_TAGS = {DATASET : 'dataset',
									ATTRIBUTE: 'attrib'};

var datasetCreated = function(setName, userId) {
	console.log('searching user ' + userId);
	User.findById(userId, function(err, user) {
		console.log('searching user error ' + err);
		if(user) {
			var description = "'" + setName + "' dataset created.";
			const log = new XyloLog({description: description,
																user: user.getMinorDetails,
																tag: LOG_TAGS.DATASET});
			log.save(function(err, doc){ console.log(doc); });
		}
	});

};


var datasetAppended = function(fileName, setName, userId) {

	User.findById(userId, function(err, user) {
		if(user) {
			var description = "'" + fileName + "' appended to dataset '" + setName + "'.";
			const log = new XyloLog({description: description,
																user: user.getMinorDetails,
																tag: LOG_TAGS.DATASET});
			log.save(function(err, doc){ console.log(doc); });
		}
	});

};

var whiteSpaceTrimmed = function(colName, setName, userId) {
	User.findById(userId, function(err, user) {
		if(user) {
			var description = "White spaces trimmed from column '" + colName + "' in '" + setName + "'.";
			const log = new XyloLog({description: description,
																user: user.getMinorDetails,
																tag: LOG_TAGS.ATTRIBUTE});
			log.save(function(err, doc){ console.log(doc); });
		}
	});

};

var attributeSplit = function(name, setName, userId) {
	User.findById(userId, function(err, user) {
		if(user) {
			var description = "Split '" + name + "' attribute from dataset '" + setName + "'.";
			const log = new XyloLog({description: description,
																user: user.getMinorDetails,
																tag: LOG_TAGS.ATTRIBUTE});
			log.save(function(err, doc){ console.log(doc); });
		}
	});

};

var mergedColumns = function(attribs, setName, userId) {
	console.log(userId);
	User.findById(userId, function(err, user) {
		if(user) {
			console.log();
			var description = "Merged columns '" + attribs.join() + "' from dataset '" + setName + "'.";
			const log = new XyloLog({description: description,
																user: user.getMinorDetails,
																tag: LOG_TAGS.ATTRIBUTE});
			log.save(function(err, doc){ console.log(doc); });
		}
	});

};

module.exports = {
	datasetCreated: datasetCreated,
	datasetAppended: datasetAppended,
	whiteSpaceTrimmed: whiteSpaceTrimmed,
	attributeSplit: attributeSplit,
	mergedColumns: mergedColumns
}
