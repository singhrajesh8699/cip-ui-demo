'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
	"Company Name": String,
	"Country": String,
	"DUNS No": Number,
	"Annual Sales": String,
	"Industry": String,
	"SIC Code": String,
	"Website": String,
	"Contact Job Title": String,
	"Gender": String,
	"Personal Linkedin Link ": String,
	"Contact First Name": String,
	"Contact Last Name": String,
	"No of PCs": Number,
	"No of Servers": Number,
	"No of Colur Printers": Number,
	"Major Network Brand": String,
	"No of Laser Printers": Number,
	"IT Budget": Number,
	"Hardware Budget": Number,
	"PC Budget": Number,
	"Server Budget": Number,
	"Printer Budget": Number,
	"Target Persona": String,
	"Buzz Score": Number,
	"Growth Score": Number
};

var options = {timestamps: true, strict: false};

var hiveRecordSchema = new Schema(fields, options);

module.exports = mongoose.model('HiveRecord', hiveRecordSchema);
