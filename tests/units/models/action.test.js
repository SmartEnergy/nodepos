var assert = require('assert'),
    Action = require('../../../models/action').Action;

var handler = function() {
  console.log('Action executed');
};

var action = new Action('test', handler);

module.exports = {
  'action should have a name': function() {
    assert.isDefined(action.name);
    assert.equal(action.name, 'test');
  },  
  'action should have a handler': function() {
    assert.isDefined(action.handler);
    assert.equal(action.handler, handler);
  },  
  'action should emit play': function() {
      action.on('play', function(user) {
        assert.equal(user, test_user);
      });

      var test_user = {
        id: '99',
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'click' 
      }
      
      action.play(test_user);
  }
};
