var util = require('util'),
    Store = require('./stores').Store;
/**
 * Users
 */
function Users () {

  Store.call(this, 'users', 'id');
  
}
// inherit Store
util.inherits(Users, Store);
exports.Users = Users;

/**
 * Create new timeout for a user
 */
Users.prototype.createTimeout = function(user) {
  var that = this;
  var id = user.id;

  // housekeeping
  if(user.timeoutId) clearTimeout(user.timeoutId);

  // new interval
  var timeoutId = setTimeout(function(that, userId) {
    Users.prototype.remove.call(that, userId);
  }, 3100, that, id);

  user.timeoutId = timeoutId;
  return;
};

/**
 * check if user is in time
 */
Users.prototype.isInTime = function(user) {
  if(this.isValid(user)) {
    var current_timeout = Number(new Date())-3000;

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
    Users.prototype.createTimeout.call(this, new_user);
    Store.prototype.push.call(this, new_user, callback);
  } else {
    callback(true, 'new', new_user);
  }
}

/**
 *  remove only if user out of time
 */
Users.prototype.remove  = function(key, callback) {
  if(key) {
    if(!this.isInTime(this.items[key])) {
      // remove timeout
      if(this.items[key] != undefined) clearInterval(this.items[key].timeoutId);
      Store.prototype.remove.call(this, key, callback);
    }
  } else {
    if(callback) callback(null);
  }

}

/**
 * small validation
 */
Users.prototype.isValid = function(user) {

  if( undefined === user || undefined === user.gesture || undefined === user.id || undefined === user.position || undefined === user.time) {
    return false;
  } else if (undefined === user.position.x || undefined === user.position.z) {
    return false;
  }
  return true;

}
