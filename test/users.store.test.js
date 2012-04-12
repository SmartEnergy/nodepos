var assert = require('assert'),
    Users = require('../lib/data/user.store').Users;

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
describe('User Store', function() {
  it('Remove user out of time', function(done) {
    users.push(user1, function(err, action, item) {
      user1.time = user1.time-1000000;
      users.remove(user1.id, function(err){
        assert.equal(users.length, 0);
        done()
      });  
    
    });
  }),
  it('User should be in time', function(done) {
	  user_.time = user1.time+1000000;
    var isInTime = users.isInTime(user_);
    assert.equal(true, isInTime);
    done();
  }),  
  it('User should be out of time', function(done) {
	  user_.time = user1.time-1000000;
    var isInTime = users.isInTime(user_);
    assert.equal(false, isInTime);
    done();
  }),  
  it('User should be valid', function(done) {
    var isValid = users.isValid(user_);
    assert.equal(true, isValid);
    done();
  }),  
  it('User should be invalid', function(done) {
    var isValid = users.isValid({ id: 5 });
    assert.equal(false, isValid);
    done();
  }),  
  it('Add user', function(done) {
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
      assert.equal(null, err);
      assert.equal('new', action);
      assert.equal(user, item);
      done();
    });
  }),
  it('Not add user out of time', function(done) {
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
      assert.equal(1, users.length);
      done();
    });
  }),
  it('User should be removed after 3 seconds without update', function(done) {
    
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
          assert.equal(null, err);
          done();
        });
        clearTimeout(this);
      }, 3100);

    });
  })
});
