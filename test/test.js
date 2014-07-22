var Lab = require('lab');
var Gutil = require('gulp-util');
var Glab = require('../index');
var es = require('event-stream');

var expect = Lab.expect;
var describe = Lab.experiment;
var it = Lab.test;

describe('index', function () {

  it('should return stream', function (done) {

    var stream = Glab();

    expect(Gutil.isStream(stream)).to.equal(true);

    done();
  });

  it('should run truthy test by gulp-lab module with String options', function (done) {

    var stream = Glab('-v -l');

    stream.pipe(es.wait(done));
    stream.end(new Gutil.File({path: './test/truthy.js'}));
  });

  it('should emit an error if options object is passed with missing opt property', function (done) {

    var failure;
    var stream = Glab({
      cmd: '-s -l'
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure, 'no error').to.be.an.instanceOf(Error);
      expect(failure.message, 'message').to.match(/Object property "opt" must be an object!/i);
      done();
    }));
    stream.end();
  });

  it('should emit an error if options object is passed with missing emitLabError property', function (done) {

    var failure;
    var stream = Glab({
      cmd: '-s -l',
      opt: {}
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure, 'no error').to.be.an.instanceOf(Error);
      expect(failure.message, 'message').to.match(/Object property "emitLabError" must be a boolen!/i);
      done();
    }));
    stream.end();
  });

  it('should emit an error if options object is passed with NON boolean emitLabError property', function (done) {

    var failure;
    var stream = Glab({
      cmd: '-s -l',
      opt: {
        emitLabError: 'true'
      }
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure, 'no error').to.be.an.instanceOf(Error);
      expect(failure.message, 'message').to.match(/Object property "emitLabError" must be a boolen!/i);
      done();
    }));
    stream.end();
  });

  it('should emit an error if the test fail', function (done) {

    var failure;
    var stream = Glab({
      cmd: '-s -l',
      opt: {
        emitLabError: true
      }
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure, 'no error').to.be.an.instanceOf(Error);
      expect(failure.message, 'message').to.match(/exited with errors/i);
      done();
    }));
    stream.end(new Gutil.File({path: './test/fail.js'}));
  });

  it('should NOT emit an error if the test fail', function (done) {

    var failure;
    var stream = Glab({
      cmd: '-s -l',
      opt: {
        emitLabError: false
      }
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure).to.equal(undefined);
      done();
    }));
    stream.end(new Gutil.File({path: './test/fail.js'}));
  });

  it('should emit an error if the test fail - missing cmd', function (done) {

    var failure;
    var stream = Glab({
      opt: {
        emitLabError: true
      }
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure, 'no error').to.be.an.instanceOf(Error);
      expect(failure.message, 'message').to.match(/exited with errors/i);
      done();
    }));
    stream.end(new Gutil.File({path: './test/fail.js'}));
  });

  it('should NOT emit an error if the test fail - missing cmd', function (done) {

    var failure;
    var stream = Glab({
      opt: {
        emitLabError: false
      }
    });

    stream.once('error', function (error) { failure = error; });
    stream.pipe(es.wait(function () {
      expect(failure).to.equal(undefined);
      done();
    }));
    stream.end(new Gutil.File({path: './test/fail.js'}));
  });

});
