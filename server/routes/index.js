var express = require('express');
var app = express();
var router = express.Router();
var apiAuth = require('../utils/apiAuth');


router.all(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = router;
