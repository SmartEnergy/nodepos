var assert = require('assert'),
    Polygon = require('../../../models/regions').Polygon,
    RegionStore = require('../../../data/regions').RegionStore,
    Store = require('../../../data/stores').Store,
    Command = require('../../../models/command').Command,
    Action = require('../../../models/action').Action,
    util  = require('util');

/**
 * Some fixtures.
 */
var poly1 = new Polygon('testregion', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 100, yMM: 100},{xMM: 0, yMM: 100}]);

var store = new RegionStore();
var actionStore = new Store('actions', 'name');
store.push(poly1);


var com1 = new Command('test', [{ name: 'userAlreadyIn', category: 'Regions', type: 'region', values: ['testregion'] }], [], store, actionStore);
var com2 = new Command('test2', [{ name: 'userAlreadyIn', category: 'Regions', type: 'region', empty: false, values: ['testregion'] }, { name: 'click', category: 'Gestures', type: 'gesture'}], [], store, actionStore);
var com4 = new Command('test3', [ { name: 'Combi', category: 'Gestures', type: 'gesture', values: ['Click,Click']}] , [], store, actionStore);

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
 
var user4 = {  
  id: 'testuser4', 
  time: Number(new Date)/1000, 
  position: { x: 10, y: 10, z: 0}, 
  gesture: 'click' 
};

var bla = store.get(poly1.name);
bla.checking(user1);
bla.checking(user2);
bla.checking(user3);


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
  'com4 should complied':  function() {
    var user = {
      id: 'testuser4', 
      time: Number(new Date)/1000, 
      position: { x: 10, y: 10, z: 0}, 
      gesture: 'Click,Click' 
    }
    var isComplied = com4.isComplied(user);
    assert.equal(true, isComplied);
  }, 
  'com4 should not complied':  function() {
    var user = {
      id: 'testuser4', 
      time: Number(new Date)/1000, 
      position: { x: 10, y: 10, z: 0}, 
      gesture: 'Swype,Click' 
    }
    var isComplied = com4.isComplied(user);
    assert.equal(false, isComplied);
  }, 
  'com1 should execute':  function() {
    com1.exec(user1, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should not execute': function() {
    com2.exec(user1, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should execute': function() {
    com2.exec(user2, function(result) {
      assert.equal(true, result);
    });
  },
  'com2 should not execute': function() {
    com2.exec(user3, function(result) {
      assert.equal(false, result);
    });
  },
  'com3 should execute on userIn event': function() {
  
    var action = new Action('testaction', function(value) { 
      assert.equal(1,1) 
    });
    
    actionStore.push(action);
    var com3 = new Command('test3', [{ name: 'userIn', category: 'Regions', type: 'region', empty: false, values: ['testregion']}], [{ name: 'testaction', category: 'Baall', empty: false, values: ['on']}], store, actionStore);
    
    com3.store.items['testregion'].checking(user4);

    
  },  
  'com3 should execute on userOut event': function() {
    user4.position.x = -1; 
    user4.position.y = -1; 
    var action = new Action('testaction_out', function(value) { 
      assert.equal(1,1) 
    });
    
    actionStore.push(action);
    var com3 = new Command('test3', [{ name: 'userOut', category: 'Regions', type: 'region', empty: false, values: ['testregion']}], [{ name: 'testaction_out', category: 'Baall', empty: false, values: ['off']}], store, actionStore);
    
    com3.store.items['testregion'].checking(user4);

    
  }  
}
