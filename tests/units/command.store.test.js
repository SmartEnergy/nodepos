var assert = require('assert'),
    RegionStore = require('../../data/regions').RegionStore,
    Store = require('../../data/stores').Store,
    CommandStore = require('../../data/commands').CommandStore;

var store = new CommandStore();
var com1 = {
  name: 'test', 
  conditions: [{ name: 'userAlreadyIn', type: 'region', values: ['testregion'] }],
  actions: 'foo'
};

var regionStore = new RegionStore();
var actionStore = new Store('actions', 'name');

module.exports = {
  'CommandStore should add command': function() {
    store.push(com1, regionStore, actionStore, function(err, method, item) {
      assert.notEqual(com1, item);
      assert.equal(com1.name, item.name);
      assert.equal(store.length, 1);
    });
  }
}
