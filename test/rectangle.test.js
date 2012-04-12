/**
 * Name         : rectangle.test.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Unit tests for rectangle model
 *                using the mochajs framework
 */
var assert = require('assert'),
    Rectangle = require('../lib/models/regions').Rectangle;

var rectangle = new Rectangle('rec1', 0, 0, 100, 100);

var user = {
  id: 'user',
  time: (new Date())/1000,
  position: {
    x: 10,
    y: 10
  }
};

describe('Rectangle', function(){
  describe('Rectangle.type', function(){
    it('should return type rectangle', function(done){
      assert.equal('rectangle', rectangle.type);
      done(null);
    })
  }),
  describe('#isUserIn()', function() {
    it('user should be in', function(done) {
      var isUserIn = rectangle.isUserIn(user);
      assert.equal(true, isUserIn);
      done(null);
    }),
    it('user should not be in', function(done) {
      
      var isUserIn = rectangle.isUserIn({
        id: 'user',
        time: (new Date())/1000,
        position: {
          x: 200,
          y: 200
        }
      });

      assert.equal(false, isUserIn);
      done(null);
    });
  }),
  describe('#isUserAlreadyIn()', function() {
    it('should be false', function(done) {
      rectangle.userAlreadyInRegion(user, function(result) {
        assert.equal(false, result);
        done();
      });
    }),
    it('should be true', function(done) {
      rectangle.checking(user, function(result) {
        assert.equal(true, result);      
      
        rectangle.userAlreadyInRegion(user, function(result) {
          assert.equal(true, result);
          done();
        });
      })
    })
  }),
  describe('#removeUser()', function() {
    it('should remove user', function(done) {
      rectangle.checking(user, function(result) {
        assert.equal(true, result);
        rectangle.removeUser(user, done);
      });
    })
  }),
  describe('#checking()', function() {
    it('should be true and emit event userIn', function(done) {
      rectangle.addListener('userIn', function(new_user) {
        assert.equal(user, new_user);
        rectangle.removeAllListeners();
      });

      rectangle.checking(user, function(result) {
        assert.equal(true, result);
        done(null);
      });
    }),
    it('should be true and emit event userAlreadyIn', function(done) {
      rectangle.addListener('userAlreadyIn', function(new_user) {
        assert.equal(user, new_user);
        rectangle.removeAllListeners();
        done(null);
      });

      rectangle.checking(user);
    }),
    it('should be false and emit event userOut', function(done) {

      var out_user = {
        id: 'user',
        time: (new Date())/1000,
        position: {
          x: 200,
          y: 200
        }
      }

      rectangle.addListener('userOut', function(old_user) {
        assert.equal(out_user, old_user);
        rectangle.removeAllListeners();
        done(null);
      });

      rectangle.checking(out_user);
    })
  })
});
