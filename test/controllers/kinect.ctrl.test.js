var help = require('../support/http'),
    assert = require('assert'),
    app = require('../../');
var req = new help(app);

describe('Kinect Controller', function() {
  describe('[GET] /kinects', function() {
    it('should response with 200', function(done) {
      req.request('GET', '/kinects');
      req.except(200, done);
    })
  }),
  describe('[POST] /kinects/new', function() {
    it('should response with 200', function(done) {
      req.request('POST', '/kinects/new');
      var data = JSON.stringify({
        size: 1,
        kinects: [
          {
            id: 1,
            x: 10,
            y: 10,
            z: 10, 
            angle: 0
          }
        ]
      });
      req.write(data);
      req.except(200, function() {
        req.request('GET', '/kinects');
        req.except(data, done);
      });
    })
  })
  describe('[POST] /kinects/:id/del', function() {
    it('should response with 200', function(done) {
       app.kinects.push({
             id: 1,
             x: 10,
             y: 10,
             z: 10, 
             angle: 0
      });
       
       req.request('GET', '/kinects/'+1+'/delete');
       req.end(function(res) {
        assert.equal(res.statusCode, 200);
        done();
       });
    }),
    it('should response with 500', function(done) {
      req.request('GET', '/kinects/'+3+'/delete');
      req.except(500, done);            
    });
  });
});
