var assert = require('assert'),
    BaallAction = require('../../../models/action').BaallAction,
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
      
      action.play(test_user, 'digitalStrom', []);

      assert.notEqual(action.last_execute, null);
      assert.equal(action.last_user, test_user);
  },
  'lastExec should be false': function() {
      var test_user = {
        id: '99',
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'click' 
      }
      action.last_execute = new Number(new Date)-2000000; 
      assert.equal(action.checkLastExec(test_user), false);
  },
  'lastExec should be true': function () {
      var test_user = {
        id: '99',
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'click' 
      }
      action.last_execute = null; 
      action.last_user = null;
      assert.equal(action.checkLastExec(test_user), true);
  },
  'Baall Action should not play if value is not On Or Off': function() {
    var action = new BaallAction('test');

    var test_user = {
        id: '99',
        time: Number(new Date)/1000, 
        position: { x: 10, y: 10, z: 0}, 
        gesture: 'click' 
    }
    
    assert.equal(action.play(test_user, 'Baall', [ 'LALA' ]), false);
  }
  
};
