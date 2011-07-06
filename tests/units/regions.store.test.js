var assert = require('assert'),
    RegionStore = require('../../data/regions').RegionStore;

var store = new RegionStore();

var rectangle = {
  name: 'test-rectangle',
  type: 'rectangle',
  height: 100,
  width: 100,
  posX: 50,
  posY: 50
};

var polygon = {
  name: 'test-polygon',
  type: 'polygon',
  points: [
    {xMM: 0, yMM: 0},
    {xMM: 100, yMM: 0}, 
    {xMM: 0, yMM: 100}
  ]
};

module.exports = {
  'Polygon should be valid': function() {
    var isPolygonValid = store.isValid(polygon);
    assert.equal(true, isPolygonValid); 
  },
  'Rectangle should be valid':  function() {
    var isRectangleValid = store.isValid(rectangle);
    assert.equal(true, isRectangleValid); 
  },
  'Wrong object should be invalid':  function() {
    var isValid = store.isValid({foo: 'foo'});
    assert.equal(false, isValid);

    isValid = store.isValid({name: 'foo', type: 'foo'});
    assert.equal(false, isValid);
  },  
  'RegionStore should add rectangle': function() {
    store.push(rectangle, function(err, method, item) {
      assert.equal(rectangle.name, item.name);
      assert.equal(store.length, 1);
    });
  },
  'RegionStore should add polygon': function() {
    store.push(polygon, function(err, method, item) {
      assert.equal(polygon.name, item.name);
      assert.equal(store.length, 2);
    });
  },
  'RegionStore should not add invalid object': function() {
    store.push({name: 'foo'}, function(err, method, item) {
      assert.equal(true, err); 
      assert.isNull(method);
      assert.isNull(item);
    });
  },
  /**
   * TODO
  'Should check a user in all regions': function() {
    //assert.equal(false, true);
  },  
  'Should remove user from all regions':  function() {
    //assert.equal(false, true);
  } */
}
