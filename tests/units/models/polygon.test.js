var assert = require('assert'),
    Polygon = require('../../../models/regions').Polygon;

/**
 * Fixtures
 */
var poly1 = new Polygon('polygon1', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 100, yMM: 100},{xMM: 0, yMM: 100}]);
var poly2 = new Polygon('polygon2', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 0, yMM: 100}]);

var user = {
  id    : 'user_',
  time  : (Number(new Date()))/1000,
  position  : {
	    x:  10
		, y:  10
		, z:  0
	}
};

module.exports = {
  'Polygon 1 and Polygon 2 should have a type': function() {
    assert.equal('polygon', poly1.type);
    assert.equal('polygon', poly2.type);
  }, 
  'Polygon 2 should check that user is in': function() {
    var isUserIn = poly2.isUserIn(user);
    assert.equal(true, isUserIn);
  },
  'Polygon 1 should check that user is not in': function() {
    user.position.x = 800;
    user.position.y = 800;
    var isUserIn = poly1.isUserIn(user);
    assert.equal(false, isUserIn);
  } 
}
