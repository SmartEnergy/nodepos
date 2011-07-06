var assert = require('assert'),
    app = require('../../app');

module.exports = {
  '[GET] /regions test': function(beforeExit) {
    var calls = 0;

    // valid request
    assert.response(
      app, 
      { 
        url: '/regions', 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      { 
        status: 200, 
        body: '{"size":0,"regions":[]}',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      function(res) {
        ++calls;
        assert.ok(res);
      }
    );

    beforeExit(function(){
      assert.equal(1, calls);
    });
  }
}
