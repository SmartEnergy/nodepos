var assert = require('assert'),
    Rectangle = require('../../../models/regions').Rectangle;

/**
 * Fixtures
 */
var rec1 = new Rectangle('rec1', 0, 0, 100, 100);
var rec2 = new Rectangle('rec2', 400, 400, 600, 600);

var user = {
  id: 'user',
  time: (new Date())/1000,
  position: {
    x: 10,
    y: 10,
  }
};

module.exports = {
  'rec1 and rec2 should have a type': function() {
    assert.equal('rectangle', rec1.type);
    assert.equal('rectangle', rec2.type);
  }, 
  'rec1 isUserIn should be true': function() {
    var isUserIn = rec1.isUserIn(user);
    assert.equal(true, isUserIn);
  },
  'rec1 checking should be true': function() {
    rec1.checking(user, function(result) {
      assert.equal(true, result);
    });
    
    // should emit event userIn 
    rec1.on('userIn', function(new_user) {
      assert.equal(user, new_user);
      rec1.removeAllListeners();
    });
  },
  'rec1 isUserAlready in should be true': function() {
    rec1.userAlreadyInRegion(user, function(result) {
      assert.equal(true, result);
    });
  },
  'rec1 checking should emit event userAlreadyIn': function() {
    
    rec1.on('userAlreadyIn', alreadyInListener);

    function alreadyInListener (new_user) {
      assert.equal(user, new_user);

      rec1.removeAllListeners();
    };

    rec1.checking(user, function(result) {
      assert.equal(true, result);
    });

  },
  'rec1 should remove user': function() {
    user.position.x = 200; 
    user.position.y = 200; 
    
    rec1.on('userOut', function(id) {
      assert.equal(user.id, id);
    });

    rec1.removeUser(user.id, function(result) {
      assert.equal(true, result);
    });
  },
  'rec2 isUserIn should be false': function() {
    var isUserIn = rec2.isUserIn(user);
    assert.equal(false, isUserIn);
  }, 
  'rec2 isUserAlready in should be false': function() {
    rec2.userAlreadyInRegion(user, function(result) {
      assert.equal(false, result);
    });
  },
  'rec2 checking should return false': function() {
    rec1.on('userNotIn', function(not_in_user) {
      assert.equal(user, not_in_user);
    });

    rec2.checking(user, function(result) {
      assert.equal(false, result);
    });
  },  
  'rec2 try remove non existing user': function() {
    rec2.removeUser(user, function(result) {
      assert.equal(false, result);
    });
  },
}
