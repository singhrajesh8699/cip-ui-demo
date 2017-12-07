'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    EventLog = mongoose.models.EventLog;

/*=============================================>>>>>
= Event info field names =
===============================================>>>>>*/

var events = {
	TEST_EVENT                    	: 1,     // A test event

    INITIATE_USER_REGISTRATION    	: 1000,     // User initiates registration request
    COMPLETE_USER_REGISTRATION    	: 1001,     // User completes registration request
    CHECK_USER_REGISTRATION       	: 1002,     // User checks registration request
    USER_LOGIN_REQUEST            	: 1010,     // User logs-in
    USER_LOGOUT_REQUEST           	: 1011,     // User logs out

	ADMIN_LOGIN                   	: 4000,     // Admin logs in
    ADMIN_LOGOUT					: 4001		// Admin logs out
};


/*= End of Event info field names =*/
/*=============================================<<<<<*/


/*=============================================>>>>>
= Public methods =
===============================================>>>>>*/

var logEvent = function(contextId, actorType, actorId, eventCategory, statusCode, statusMessage, data) {
	var logEntry = new EventLog();

	logEntry.context_id = contextId;
	logEntry.actor = actorType;
	logEntry.actor_id = actorId;
	logEntry.event_category = eventCategory;
	logEntry.status_code = statusCode;
	logEntry.status_message = statusMessage;
	logEntry.event_info = data;

	logEntry.save(function(err, log) {
		if(!err) {
			console.log("log saved successfully!");
		}
		else{
			console.log("Failed to make the log entry!");
		}
	});
};

/*= End of Public methods =*/
/*=============================================<<<<<*/

module.exports = {
	EVENTS: events,
	logEvent: logEvent
};
