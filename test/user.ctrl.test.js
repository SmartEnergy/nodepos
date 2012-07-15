var help = require('./support/http'),
    app = require('../');

var req = new help(app);

describe('User Controller', function() {
  describe('[GET] /users', function() {
    it('should response with 200', function(done) {
      req.request('GET', '/users');
      req.except(200, done);
    }),
    it('should match body', function(done) {
      req.request('GET', '/users');
      req.except("{\"size\":0,\"users\":[]}", done);
    });  
  });
  describe('[POST] /users', function() {
    it('should response with 200', function(done) {
      req.request('POST', '/users/new');
      var time = Number(new Date())/1000;
      var data = {
        size: 1,
        users: [{ id: 1, position: { x: 20, y: 20, z: 0 }, time: time, gesture: '', joints: []}]
      };
      req.write(JSON.stringify(data))
      req.except('{"success":true}', function() {
        req.request('GET', '/users');
        req.except(200, done);

      });
    }),
    it('should response with 400', function(done) {
      req.request('POST', '/users/new');
      req.write(JSON.stringify({ foo: 'foo' }));
      req.except(400, done);
    })
  });
});
