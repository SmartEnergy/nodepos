var help = require('./support/http'),
    app = require('../');

var req = new help(app);

  describe('[GET] /actions', function() {
    it('should response with 200', function(done) {
      req.request('GET', '/actions');
      req.except(200, done);
    })
  });
