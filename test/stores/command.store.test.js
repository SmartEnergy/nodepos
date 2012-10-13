var assert = require('assert'),
    RegionStore = require('../../lib/data/regions.store').RegionStore,
    Store = require('../../lib/data/store').Store,
    CommandStore = require('../../lib/data/command.store').CommandStore;

var store = new CommandStore();
var com1 = {
  name: 'test', 
  conditions: [{ name: 'userAlreadyIn', type: 'region', values: ['testregion'] }],
  actions: 'foo'
};

var regionStore = new RegionStore();
var actionStore = new Store('actions', 'name');

describe('Command Store', function() {
  it('CommandStore should add command', function(done) {
    store.push(com1, regionStore, actionStore, function(err, method, item) {
      assert.notEqual(com1, item);
      assert.equal(com1.name, item.name);
      assert.equal(store.length, 1);
      done();
    });
  })
});
