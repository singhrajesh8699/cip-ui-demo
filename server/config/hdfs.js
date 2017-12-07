'use strict';

var config = {
	"HOST" : "45.33.93.168",
	"PORT" : 50070,
	"BASE_DIR" : "/webhdfs/v1/",
	"USER_NAME" : "root",
	"DO_AS" : "root"
};


config['COMPLETE_BASE_URL'] = "http://" + config.HOST + ":" + config.PORT + config.BASE_DIR;

config['getBaseParamsForRequest'] = function(reqType) {
	return "user.name=" + config.USER_NAME
			+ "&doas=" + config.DO_AS
			+ "&op=" + reqType;
};

module.exports = config;
