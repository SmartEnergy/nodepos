var assert = require('assert'),
    Polygon = require('../lib/models/regions').Polygon,
    RegionStore = require('../lib/data/regions.store').RegionStore,
    Store = require('../lib/data/store').Store,
    Command = require('../lib/models/command').Command,
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
  gesture: null 
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


describe('Command', function(){
  describe('#isComplied()', function(){
    it('com1 should complied for user1', function(done){
      var isComplied = com1.isComplied(user1);
      assert.equal(true, isComplied);
      done();
    }),
    it('com2 should not complied for user1', function(done) {
      var isComplied = com2.isComplied(user1);
      assert.equal(false, isComplied);
      done();
    }),
    it('com2 should complied for user2', function(done) {
      var isComplied = com2.isComplied(user2);
      assert.equal(true, isComplied);
      done();
    }),
    it('com4 should complied', function(done) {
      var user = {
        id: 'testuser4', 
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'Click,Click' 
      }
      var isComplied = com4.isComplied(user);
      assert.equal(true, isComplied);
      done();
    }),
    it('com4 should not complied', function(done) {
      var user = {
        id: 'testuser4', 
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'Swype,Click' 
      }
      var isComplied = com4.isComplied(user);
      assert.equal(false, isComplied);
      done();
    })
  }),
  describe('#exec()', function() {
    it('com1 should execute',  function(done) {
      com1.exec(user1, function(result) {
        assert.equal(true, result);
        done();
      });
    }),
    it('com2 should not execute with user 1', function(done) {
      com2.exec(user1, function(result) {
        assert.equal(false, result);
        done();
      });
    }),
    it('com2 should execute', function(done) {
      com2.exec(user2, function(result) {
        assert.equal(true, result);
        done();
      });
    }),
    it('com2 should not execute with user3', function(done) {
      com2.exec(user3, function(result) {
        assert.equal(false, result);
        done()
      });
    })
  });
});
