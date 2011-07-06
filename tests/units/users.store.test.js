var assert = require('assert'),
    Users = require('../../data/users').Users;

/**
 * Some fixtures..
 */
var users = new Users();

var user_for_rm = new Object({
	id		: 	'user_for_rm',
	time		: 	(Number(new Date())/1000)-10,
  gesture : null, 
	position	: 	new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
				 })
});

var user1 = new Object({
	id		: 	'user1',
	time		: 	(Number(new Date()) / 1000 )+5, 
  gesture : null, 
  position	: 	new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
			  	})
});
var user_ = new Object({
	id		:	 'user_',
	time		: 	 (Number(new Date())/1000)+5, 
  gesture : null, 
	position	:	 new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
			  	})
});

/**
 * User Store test
 */
module.exports = {
  'Remove user out of time': function() {
    users.push(user1, function(err, action, item) {
      user1.time = user1.time-1000000;
      users.remove(user1.id, function(err){
        assert.equal(users.length, 0);
      });  
    
    });
  },
  'Not remove user if in time': function() {
    users.push(user_, function(err){
      users.remove('user_', function(err){
        assert.equal(users.length, 1);
      });  
    });     
  },
  'User should be in time': function() {
	  user_.time = user1.time+1000000;
    var isInTime = users.isInTime(user_);
    assert.equal(true, isInTime);
  },  
  'User should be out of time': function() {
	  user_.time = user1.time-1000000;
    var isInTime = users.isInTime(user_);
    assert.equal(false, isInTime);
  },  
  'User should be valid': function() {
    var isValid = users.isValid(user_);
    assert.equal(true, isValid);
  },  
  'User should be invalid': function() {
    var isValid = users.isValid({ id: 5 });
    assert.equal(false, isValid);
  },  
  'Add user': function() {
    var user = {
      id		:	'user_1',
      time		:	Number(new Date())/1000,
      gesture : null, 
      position	:	new Object({
              x	:	0,
              y	:	0,
              z	:	0
      })
    }; 
    users.push(user, function(err, action, item) {
      assert.isNull(err);
      assert.equal('new', action);
      assert.equal(user, item);
    });
  },
  'Not add user out of time': function() {
    var user = {
      id		:	'user_2',
      time		:	(Number(new Date())/1000)-20,
      gesture : null, 
      position	:	new Object({
              x	:	0,
              y	:	0,
              z	:	0
      })
    }; 
    users.push(user, function(err, action, item) {
      assert.equal(true, err);
      assert.equal('new', action);
      assert.equal(user, item);
      assert.equal(2, users.length);
    });
  },
  'User should be removed after 3 seconds without update':  function() {
    
    var testuser = {
      id		:	'test',
      time		:	(Number(new Date())/1000),
      gesture : null, 
      position	:	new Object({
              x	:	0,
              y	:	0,
              z	:	0
      })
    }; 

    users.push(testuser, function(err, action, item) {
      assert.equal('new', action);
      assert.equal(testuser, item);

      // after three seconds
      setTimeout(function() {

        users.get('test', function(err, user) {
          assert.isUndefined(user);

          // exit. Stop timeout check..
          process.exit();
        });
        clearTimeout(this);
      }, 3100);

    });
  },
};
