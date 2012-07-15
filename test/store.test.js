var assert = require('assert'),
    Store = require('../lib/data/store').Store;

/**
 * Some fixtures
 */
var store = new Store('test', 'some');
var item = new Object({
   some         : 'one',
   changed      : 0       
});
var two = new Object({
   some         : 'two',
   changed      : 0       
});
var three = new Object({
   some         : 'three',
   changed      : 0       
});
store.push(item, function(){});
store.push(three, function(){});

describe('Store', function() {
  it('Add new item', function (done) {
    // test event
    store.on('new', function(key, item) {
      assert.equal(store.items['two'], item);
    });

    // push new item
    store.push(two, function(err, action, item) {
      assert.equal(null, err);
      assert.equal('new', action);
      assert.equal(store.items['two'], item);
      assert.equal(3, store.length);
      done();
    });
  }),
  it('Update existing item', function(done) {
    var update_item = { some: 'two', changed: 1 };

    // test event
    store.on('update', function(key, item) {
      assert.equal(update_item, item);
    });

    // update item
    store.push(update_item, function(err, action, item) {
      assert.equal(update_item, store.items['two']);
      assert.equal(null, err);
      assert.equal('update', action);
      assert.equal(3, store.length);
      done();
    });
  }),
  it('Remove existing item', function(done) {
    store.on('remove', function(key) {
      assert.equal(2, store.length);
    });

    // remove item
    store.remove('three', function(err, action, key) {
      assert.equal(null, err);
      assert.equal(2, store.length);
      done();
    });
  }),
  it('Remove not existing item', function(done) {
    store.remove('x', function(err, action, key) {
      assert.equal(true, err);
      assert.equal('x', key);
      done();
    });    
  }),
  it('toArray', function (done) {
    store.toArray(function(err, result) {
      assert.equal(null, err);
      done();
    });
  }),
  it('toJson', function(done) {
    store.toJson(function(err, result) {
      console.log(err);
      console.log(result);
      assert.equal(null, err);
      assert.equal(2, JSON.parse(result).size)
      done();
    });
  })
});
