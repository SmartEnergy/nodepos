var assert = require('assert'),
    CommandStore = require('../../data/commands').CommandStore;

var store = new CommandStore();
var com1 = {
  name: 'test', 
  conditions: [{ name: 'userIn', type: 'region', values: ['testregion'] }],
  actions: 'foo'
};

module.exports = {
  'CommandStore should add command': function() {
    store.push(com1, function(err, method, item) {
      assert.notEqual(com1, item);
      assert.equal(com1.name, item.name);
      assert.equal(store.length, 1);
    });
  }
}
