var vows    = require('vows'),
    assert	= require('assert'),
    data    = require('../data');

var scene = new data.Action('test', function(callback){
  callback(true);
});

var rectangle = new data.Rectangle('test', [scene], 0, 0, 100, 100);
rectangle.on('userOut', function(user) {
});
rectangle.on('newPosOfUser', function(user) {
});
rectangle.on('userIn', function(user){
});

// some polygons
var polygon1 = new data.Polygon('polygon1', [scene], [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 100, yMM: 100},{xMM: 0, yMM: 100}]);
var polygon2 = new data.Polygon('polygon2', [scene], [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 0, yMM: 100}]);

var user = new Object({
  id    : 'user_',
  time  : new Date().getTime()+4238403824,
  position  : {
	    x:  10
		, y:  10
		, z:  0
	}
});
vows.describe('Region').addBatch({
  'A polygon': {
    topic: polygon2,
    'should check that user is in': function(topic) {
      topic.checking(user, function(result){
        assert.equal(result, true);
      });
    }    
  },
  'A rectangle polygon': {
    topic: polygon1,
    'should check that user is in.': function(topic) {
      topic.checking(user, function(result){
        assert.equal(result, true);
      });
    }
  },
	'A rectangle': {
		topic: rectangle,
		'should respond to checking and broadcast': function(topic) {
			assert.isFunction(topic.checking);
		},
		'should check that user is in region': function(topic) {
			topic.checking(user, function(result) {
				assert.equal(result, true);
        assert.equal(topic.users[0], user.id);
        assert.equal(topic.users.length, 1);
			});
		},
    'should check that user was updated': function(topic) {
      topic.checking(user, function(result) {
			  assert.equal(result, true);
        assert.equal(topic.users[0], user.id);
        assert.equal(topic.users.length, 1);
			});
                
                },
		'should check that user is out of region now': function(topic) {
			user.position.x = 200;
			user.position.y = 200;
			topic.checking(user, function(result) {
				assert.equal(result, false);
        assert.equal(topic.users.length, 0);
			});
		},
		'should check that user is not in region': function(topic) {
			user.position.x = 200;
			user.position.y = 200;
                        user.id = 'changed..';
			topic.checking(user, function(result) {
				assert.equal(result, false);
        assert.equal(topic.users.length, 0);
			});
		},
    'should have a action': function(topic){
      assert.equal(rectangle.actions.length, 1);
    },
	}
}).export(module);
