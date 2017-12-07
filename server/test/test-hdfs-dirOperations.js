var request = require('supertest'),
    express = require('express'),
	should = require('should');

var config = require('../config/config');

process.env.NODE_ENV = 'test';

var app = require('../app.js');

var dirName = '/testdir/test-' + new Date().getTime();

describe('HDFS create directory', function() {

	it('Creates directory on HDFS server in testdir directory', function(done) {
		request(app)
	    .put('/api/hdfsdir?dirName=' + dirName)
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

describe('HDFS directory content', function() {

  it('Displays list of files and sub-directories in given directory', function(done) {
    request(app)
    .get('/api/hdfsdir/content?dirName=/testdir')
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

describe('HDFS delete directory', function() {

	it('Deletes directory on HDFS server from testdir directory', function(done) {
		request(app)
	    .delete('/api/hdfsdir/?dirName=' + dirName)
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
