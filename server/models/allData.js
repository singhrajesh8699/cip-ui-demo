'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var fields = {
	"tenantID": String,
  "Company Name": String,
	"No of PC per Employees": Number,
	"No of PC per Employees : Industry Benchmark": Number,
	"Printer per Employees": Number,
	"Printer per Employees : Industry Benchmark": Number,
	"Brand Wallet Share": String,
	"Brand Wallet Share : Ink & Toner": String,
	"Brand Wallet Share : Supplies": String,
	"Brand Wallet Share :  Facilities": String,
	"Brand Wallet Share :  Technology": String,
	"Brand Wallet Share": String,
	"Brand Wallet Share": String,
	"Brand Wallet Share": String,
	"Address: line1": String,
	"Address: line2": String,
	"City": String,
	"Contact First Name": String,
	"Contact Last Name": String,
	"Gender": String,
	"Business Phone No": String,
	"Contact Official E Mail ID": String,
	"Person LinkedIn Link": String
};

var options = {timestamps: true, strict: false};

var AllDataSchema = new Schema(fields, options);

module.exports = mongoose.model('AllData', AllDataSchema);
