var assert = require('assert'),
    Polygon = require('../../../models/regions').Polygon,
    RegionStore = require('../../../data/regions').RegionStore,
    Store = require('../../../data/stores').Store,
    Command = require('../../../models/command').Command;

/**
 * Some fixtures.
 */
var poly1 = new Polygon('testregion', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 100, yMM: 100},{xMM: 0, yMM: 100}]);

var store = new RegionStore();
store.push(poly1);
var com1 = new Command('test', [{ name: 'userIn', type: 'region', values: ['testregion'] }], [], store);
var com2 = new Command('test', [{ name: 'userIn', type: 'region', empty: false, values: ['testregion'] }, { name: 'click', type: 'gesture'}], [], store);

var user1 = {  
  id: 'testuser1', 
  time: Number(new Date)/1000, 
  position: { x: 10, y: 10, z: 0}, 
  gesture: null 
};

var user2 = {  
  id: 'testuser2', 
  time: Number(new Date)/1000, 
  position: { x: 10, y: 10, z: 0}, 
  gesture: 'click' 
};

var user3 = {  
  id: 'testuser3', 
  time: Number(new Date)/1000, 
  position: { x: 1000, y: 1000, z: 0}, 
  gesture: 'click' 
};
 
var bla = store.get(poly1.name);
bla.checking(user1);
bla.checking(user2);
bla.checking(user3);

var actionStore = new Store('actions', 'name');

module.exports = {
  'com1 should complied': function() {
      var isComplied = com1.isComplied(user1);
      assert.equal(true, isComplied);
  },
  'com2 should not complied': function() {
      var isComplied = com2.isComplied(user1);
      assert.equal(false, isComplied);
  },
  'com2 should complied': function() {
      var isComplied = com2.isComplied(user2);
      assert.equal(true, isComplied);
  }, 
  'com1 should execute':  function() {
    com1.exec(user1, actionStore, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should not execute': function() {
    com2.exec(user1, actionStore, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should execute': function() {
    com2.exec(user2, actionStore, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should not execute': function() {
    com2.exec(user3, actionStore, function(result) {
      assert.equal(false, result);
    });
  }
}
