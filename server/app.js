'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    http = require('http'),
	  mongoose = require('mongoose'),
	  cors = require('cors'),
    config = require('./config/config'),
    apiAuth = require('./utils/apiAuth'),
    payloadIntegrityValidator = require('./utils/payloadIntegrityValidator');


var app = module.exports = exports.app = express();

var server = http.createServer(app);

//Mongoose models list
var models =[];

/*=============================================>>>>>
= Socket-io variables =
===============================================>>>>>*/

var io = require('socket.io').listen(server);
var socketiotJwt = require('socketio-jwt');

var events = require('events');
var eventEmitter = new events.EventEmitter();

var jwtSecret = config.TOKEN_SECRET;

/*= End of Socket variables =*/
/*=============================================<<<<<*/
app.use(cors());

app.locals.siteName = "Dataxylo";

// Connect to database
var db = require('./config/db');
app.use(express.static(__dirname + '/public'));
app.use('/logos', express.static('uploads'));


// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  models.push(require(modelsPath + '/' + file));
});

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    app.use(morgan('dev'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
}

if ('production' == env) {
    app.use(morgan());
     app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}


// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiAuth.validateAPIKey);


//Create directories
var uploadsDir = path.join(__dirname, 'routes');
if (!fs.existsSync('./uploads/')){
    fs.mkdirSync('./uploads/');
}

app.use('/logos', express.static('uploads'));

// Bootstrap routes
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function(file) {
  app.use('/', require(routesPath + '/' + file));
});

// app.post('*', payloadIntegrityValidator.validateIVTokenString);

// Bootstrap api
var apiPath = path.join(__dirname, 'api');
fs.readdirSync(apiPath).forEach(function(file) {
    // console.log(apiPath + '/' + file);
    app.use('/dataxylo/v1', require(apiPath + '/' + file));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/../dist/' + req.url));
});

//var graffitiSchemas = getSchema(models);

//app.use(graffiti.express({schema: graffitiSchemas, graphiql: false}));

// console.log(app._router.stack);

// Start server
var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});


/*=============================================>>>>>
= Socket-io implementation =
===============================================>>>>>*/

// io.use(socketiotJwt.authorize({
// 		secret: jwtSecret,
// 		handshake: true
// 	}));
//
// io.on('connection', function(socket) {
//     socket.join(socket.decoded_token.sub.id);
// });
//
//
// var routesPath = path.join(__dirname, 'socket');
// fs.readdirSync(routesPath).forEach(function(file) {
//     var socketMessageGroup = require(routesPath + '/' + file);
//     if(typeof socketMessageGroup.events !== undefined) {
//         Object.keys(socketMessageGroup.events).forEach(function(key) {
//             eventEmitter.on(socketMessageGroup.events[key], function(room, data) {
//                 io.to(room).emit(key, data);
//             });
//         });
//     }
// });

/*= End of Socket-io implementation =*/
/*=============================================<<<<<*/
