var helpers = require(__dirname+'/../lib/helpers'),
    assert = require('assert');

var stub = __dirname+'/stubs/child_stub.py';

describe('startProc', function() {
  it('should start a child process', function(done) {
    helpers.startProc(stub, function(err, child) {
      assert.equal(null, err);
      done();
    });
  }),
  it('should produce an error if command not found', function(done) {
    helpers.startProc('HELLOWORLD', function(err, child) {
      assert.notEqual(null, err);
      done();
    });
  })
}); 
