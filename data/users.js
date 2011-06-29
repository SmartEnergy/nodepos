var util = require('util'),
    Store = require('./stores').Store;
/**
 * Users
 */
function Users () {

  Store.call(this, 'users', 'id');

  this.on('new', function(key, user){
  });

  this.on('update', function(key, user){
  });

  this.on('removed', function(key){
  });
}
// inherit Store
util.inherits(Users, Store);
exports.Users = Users;

/**
 * check if user is in time
 */
Users.prototype.isInTime = function(user) {

  if(this.isValid(user)) {
    var current_timeout = Number(new Date())-5000;

    if((current_timeout/1000) <= user.time) {
      return true;
    }       
  }
  return false;

}

/**
 * verify that new_user to add or update are in time 
 */
Users.prototype.push    = function(new_user, callback) {

  if(this.isInTime(new_user)) {
    Store.prototype.push.call(this, new_user, callback);
  } else {
    callback(true, 'new', new_user);
  }

}

/**
 *  remove only if user out of time
 */
Users.prototype.remove  = function(key, callback) {

  if(!this.isInTime(this.items[key])) {
    Store.prototype.remove.call(this, key, callback);
  } else {
    callback(null);
  }

}

/**
 * small validation
 */
Users.prototype.isValid = function(user) {

  var pos = user.position;

  if( 'undefined' === typeof user || 'undefined' === typeof user.position || 'undefined' === typeof user.time) {

    return false;

  } else if ('undefined' === typeof user || 'undefined' === typeof user.position.x || 'undefined' === typeof user.position.z) {

    util.log("[USER][WARNING] COULD NOT VALIDATE USER " + user.id);
    return false;

  }

  return true;
}
