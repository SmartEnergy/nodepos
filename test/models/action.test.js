var assert = require('assert'),
    BaallAction = require('../../lib/models/action').BaallAction,
    Action = require('../../lib/models/action').Action;

var action = new Action('test', function() {});

var user = {
  id: '99',
  time: Number(new Date)/1000, 
  position: { x: 10, y: 10, z: 0}, 
  gesture: 'click' 
}

describe('Action', function(){
  describe('Action attributes', function(){
    it('should return name test', function(done){
      assert.equal('test', action.name);
      done();
    }),
    it('should have a handler function', function(done) {
      assert.equal(true, typeof action.handler === 'function');
      done();
    });
  }),
  describe('#checkLastExec()', function() {
    it('should return true', function(done) {
      action.last_execute = null; 
      action.last_user = null;
      assert.equal(action.checkLastExec(user), true);
      done();
    }),
    it('should return false', function(done) {
      action.last_execute = new Number(new Date)-2000000; 
      action.last_user = user;
      assert.equal(action.checkLastExec(user), false);
      done();
    })  
  });
  describe('#play()', function() {
    it('should emit play', function(done) {
      action.on('play', function(play_user) {
        assert.notEqual(this.last_execute, null);
        assert.equal(this.last_user, play_user);
        done();
        action.removeAllListeners();
      });

      action.last_execute = null; 
      action.last_user = null;
      action.play(user, 'digitalStrom', [], false, function() {}
      );
    }),
    it('should not play baall action if no value is specified', function(done) {
      var myaction = new BaallAction('test');
      var callback = function (err) {
         done();
       }
      myaction.last_execute = null; 
      myaction.last_user = null;
      myaction.play(user, 'Baall', [ 'LALA' ], false, callback);
    });
  })
});
