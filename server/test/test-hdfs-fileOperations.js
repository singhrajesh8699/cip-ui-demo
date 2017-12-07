var request = require('supertest'),
    express = require('express'),
	should = require('should');

var config = require('../config/config');

process.env.NODE_ENV = 'test';

var app = require('../app.js');

var fileName = '/testdir/file-' + new Date().getTime() + '.txt';

describe('HDFS create file', function() {

	it('Creates file on HDFS server in root directory', function(done) {
		request(app)
	    .put('/api/hdfsfile?fileName=' + fileName)
	    .set('Accept', 'application/json')
	    .set('api_key', config.API_KEY)
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
	      if (err) {
	        throw err;
	      }

		  res.body.should.be.an.instanceOf(Object)
		  			.and.containEql({status:{message:"success",statusCode:0}})
					.and.have.property('payload');

	      done();
	    });
	});
});

describe('HDFS file details', function() {

  it('Displays requested file details', function(done) {
    request(app)
    .get('/api/hdfsfile/details?fileName=' + fileName)
    .set('Accept', 'application/json')
    .set('api_key', config.API_KEY)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw err;
      }

	  res.body.should.be.an.instanceOf(Object)
	  			.and.containEql({status:{message:"success",statusCode:0}})
				.and.have.property('payload');

      done();
    });
  });
});

describe('HDFS delete file', function() {

	it('Deletes file on HDFS server from root directory', function(done) {
		request(app)
	    .delete('/api/hdfsfile/?fileName=' + fileName)
	    .set('Accept', 'application/json')
	    .set('api_key', config.API_KEY)
	    .expect('Content-Type', /json/)
	    .expect(200)
	    .end(function(err, res) {
	      if (err) {
	        throw err;
	      }

		  res.body.should.be.an.instanceOf(Object)
		  			.and.containEql({status:{message:"success",statusCode:0}})
					.and.have.property('payload');

	      done();
	    });
	});
});
