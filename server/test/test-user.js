var request = require('supertest'),
    express = require('express'),
	jwt = require('jsonwebtoken'),
	sha256 = require('sha256');

var config = require('../config/config');

process.env.NODE_ENV = 'test';

var app = require('../app.js');
var _id = '';
var token = '';

var username =  'Test';
username += new Date().getTime();

var email = username + '@example.com';

var password = '1234';

var generatePayloadChecksum = function(payloadValues) {
	var payloadValuesSHA = sha256(payloadValues);

	var isoDate = new Date().toISOString();
	var inputToEncrypt = {mac: payloadValuesSHA, ts: isoDate};
	var tokenObject = {kty: "oct", k: inputToEncrypt};
	return jwt.sign(tokenObject, config.TOKEN_SECRET);
};


describe('Payload integrity check', function() {

  it('Does not create new user and responds with PAYLOAD INTEGRITY FAIL error for no "payload_checksum" header', function(done) {
    request(app)
    .post('/api/auth/signup')
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
    .expect('Content-Type', /json/)
    .send({"name":username,"email":email,"password":password})
    .expect(400)
    .end(function(err, res) {
      if (err) {
        throw err;
      }

      done();
    });
  });
});


describe('Parameter missing error check', function() {

  it('Does not create new user and responds with PARAMETER MISSING error', function(done) {
    request(app)
    .post('/api/auth/signup')
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
	.set('payload_checksum', generatePayloadChecksum(email + username + password))
    .expect('Content-Type', /json/)
    .send({"name":'',"email":email,"password":password})
    .expect(400)
    .end(function(err, res) {
      if (err) {
        throw err;
      }

      done();
    });
  });
});

describe('POST New User', function() {

  it('Creates new user and responds with json success message', function(done) {
    request(app)
    .post('/api/auth/signup')
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
	.set('payload_checksum', generatePayloadChecksum(email + username + password))
    .expect('Content-Type', /json/)
    .send({"name":username,"email":email,"password":password})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw err;
      }

      done();
    });
  });
});

describe('Sign in with user and return jwt token', function() {
  it('Responds with a session token', function(done) {
    request(app)
    .post('/api/auth/login')
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
	.set('payload_checksum', generatePayloadChecksum(email + password))
    .send({"email":email,"password":password})
    .expect(200)
    .end(function(err, res) {
      if(err) {
        throw err;
      }
      token = res.body.payload.token;
	 
      done();
    });
  });
});

describe('Get profile using jwt token', function() {
  it('Responds with a user profile', function(done) {
    request(app)
    .get('/api/user/me')
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
    .set('authorization', 'Bearer ' + token)
    .expect(200)
    .end(function(err, res) {
      if(err) {
        throw err;
      }
      _id = res.body.payload._id;
      done();
    });
  });
});

describe('Delete User by ID', function() {
  it('Should delete user and return 200 status code', function(done) {
    request(app)
    .del('/api/user/'+ _id)
    .set('Accept', 'application/json')
    .set('api_key', 'dj123rouv13yro')
    .set('Authorization', 'Bearer ' + token)
    .expect(204, done);
  });
});
