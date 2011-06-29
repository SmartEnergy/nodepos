/**
 * @fileoverview implementing key/value arrays for
 *               regions, actions, users... 
 * @author andree andreek@tzi.de
 */
var events  = require('events'),
    async   = require('async'),
    util    = require('util');

/**
 * Key/Value store..
 */
function Store(name, key) {
  events.EventEmitter.call(this);

  this.name   = name;
  this.value  = key;
  this.length = 0;
  this.items  = [];
}
util.inherits(Store, events.EventEmitter);
Store.super_ = events.EventEmitter;
Store.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: Store,
    enumerable: false
  }   
});
exports.Store = Store;

/**
 * Return item
 */
Store.prototype.get           = function(key, callback) {
  callback(null, this.items[key]);
}

/**
 * Update existing item
 */
Store.prototype.update  = function(key, item, callback) {

  this.items[key] = item;
  this.emit('update', key, item);
  if(callback) callback(null, 'update', this.items[key]);

}

/**
 * Remove item
 */
Store.prototype.remove  = function(key, callback) {

  if(typeof this.items[key] != 'undefined') {
    this.length--;
    delete this.items[key];
    this.emit('removed', key);
    if(callback) callback(null, 'removed', key); 
  } else {
    if(callback) callback(true, 'removed', key); 
  }
}

/**
 *  Add new item
 */
Store.prototype.push  = function(new_item, callback) {

  var self    = this; 
  var key     = new_item[this.value];
  
  this.get(key, function(err, item){
    if(typeof item == 'undefined') {
      self.items[key] = new_item;
      self.length++;
      self.emit('new', key, new_item);
      if(callback)  callback(null, 'new', self.items[key]);
    }   
    else {
      self.update(key, new_item, callback);
    }
  });

}

/**
 *  Returns array with only items
 */
Store.prototype.toArray = function(callback) {
  
  var self = this;
  var results =       [];
  for(var user in self.items) {
    results.push(self.items[user]);
  }
  callback(null, results);

}

/**
 *  Returns a json string with items and size
 */
Store.prototype.toJson  = function(callback) {

  var self    = this;

  this.toArray(function(err, results){

    result = new Object({
      size        : self.length
    });
    result[self.name] = results;
    result = JSON.stringify(result);
    callback(err, result); 

  });
}
