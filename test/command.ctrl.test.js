var help = require('./support/http'),
    Command = require('../lib/models/command').Command,
    RegionStore = require('../lib/data/regions.store').RegionStore,
    Store = require('../lib/data/store').Store,
    app = require('../');

var req = new help(app);

var store = new RegionStore();
var actionStore = new Store('actions', 'name');

describe('Command Controller', function() {
  describe('[GET] /commands', function() {
    it('should response with 200', function(done) {
      req.request('GET', '/commands');
      req.except(200, done);
    })
  }),
  describe('[POST] /commands/new', function() {
    it('should response with 200', function(done) {
      req.request('POST', '/commands/new');
      var com = new Command('test', [], [], store, actionStore);
      var data = JSON.stringify(com);
      req.write(data);
      req.except(200, function() {
        req.request('GET', '/commands');
        req.except(200, done);
      });
    }); 
  }),
  describe('[DELETE] /command/:id/delete', function(done) {
    it('should response with 200', function() {
      req.request('POST', '/commands/new');
      var com = new Command(1, [], [], store, actionStore);
      var data = JSON.stringify(com);
      req.write(data);
      req.except(200, function() {
        req.request('GET', '/commands/1/delete');
        req.except(200, done);
      });
    });
  })
});
