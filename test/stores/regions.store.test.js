var assert = require('assert'),
    RegionStore = require('../../lib/data/regions.store').RegionStore;

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

describe('Region Store', function() {
  it('Polygon should be valid', function(done) {
    var isPolygonValid = store.isValid(polygon);
    assert.equal(true, isPolygonValid); 
    done();
  }),
  it('Rectangle should be valid', function(done) {
    var isRectangleValid = store.isValid(rectangle);
    assert.equal(true, isRectangleValid); 
    done();
  }),
  it('Wrong object should be invalid', function(done) {
    var isValid = store.isValid({foo: 'foo'});
    assert.equal(false, isValid);

    isValid = store.isValid({name: 'foo', type: 'foo'});
    assert.equal(false, isValid);
    done();
  }),  
  it('RegionStore should add rectangle', function(done) {
    store.push(rectangle, function(err, method, item) {
      assert.equal(rectangle.name, item.name);
      assert.equal(store.length, 1);
      done();
    });
  }),
  it('RegionStore should add polygon', function(done) {
    store.push(polygon, function(err, method, item) {
      assert.equal(polygon.name, item.name);
      assert.equal(store.length, 2);
      done();
    });
  }),
  it('RegionStore should not add invalid object', function(done) {
    store.push({name: 'foo'}, function(err, method, item) {
      assert.equal(true, err); 
      assert.equal(null, method);
      assert.equal(null, item);
      done();
    });
  })
})
