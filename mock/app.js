var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/client'));

app.set('views', __dirname + '/client');

app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    res.render('ejs/segments_overview');
});
app.get('/index', function(req, res) {
    res.render('ejs/segments_overview');
});
app.get('/segments_overview', function(req, res) {
    res.render('ejs/segments_overview');
});
app.get('/customers_profile', function(req, res) {
    res.render('ejs/customers_profile');
});
app.get('/customers_sample1', function(req, res) {
    res.render('ejs/customers_sample1');
});

app.listen(3031, function() { 

    console.log('listening');

});
