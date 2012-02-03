var events = require('events'),
  http = require('http'),
  util   = require('util');

/* 
* Action executes an interaction with baall or digitalStrom
*/
function Action (name, handler) {

events.EventEmitter.call(this);

this.name = name;
this.handler = handler;

// save last time this action was executed
// and user.
this.last_execute = null;
this.last_user  = null;

};

// inherit events.EventEmitter
util.inherits(Action, events.EventEmitter);
Action.super_ = events.EventEmitter;
Action.prototype = Object.create(events.EventEmitter.prototype, {
constructor: {
  value: Action,
  enumerable: false
	}		
});

Action.prototype.checkLastExec = function(user) {
   
  if(this.last_execute >= (new Number(new Date())-5000) && this.last_user.id === user.id) {
    return true;
  }
  else if (this.last_execute === null || this.last_user === null){
    return true;
  }
  return false;

};


Action.prototype.play = function(user, type, values, force) {
 
  if(force === true) {
    this.last_execute = new Number(new Date());
    this.emit('play', user);
    this.handler(values);

  } else if(true || force === true) {
    this.last_execute = new Number(new Date());
    this.last_user = user;

    this.emit('play', user);
  
    this.handler();
  
  } else {
  
    console.log('won\'t execute this action..');
  
  }
  
}
exports.Action = Action;

/**
 * Model for Base Baall Actions
 *
 * turn on/off devices
 */
function BaallAction (name) {
  
  Action.call(this, name);

  this.value = null;

  this.handler = function ballrequest() {
    if(this.value != null) {
      // TODO use socket
      var client = http.createClient(80, 'baall-server.informatik.uni-bremen.de');

      var headers = {
        'Host': 'baall-server.informatik.uni-bremen.de',
        'Content-Type': 'text/plain',
        'Content-Length': 0
      };

      var req = client.request('GET', '/update.php?value='+this.value+'&name='+this.name, headers);
      req.write('');
      req.end();
    
      this.value = null;
    }
  } 
}
// inherits Action
util.inherits(BaallAction, Action);
exports.BaallAction = BaallAction;

/**
 * play method
 */
BaallAction.prototype.play = function(user, type, values, force) {
  if(type === 'Baall' && values.length === 1) {
    
    var value = values[0];
    if(value === 'On') {
      this.value = 1;
    }
    else if(value === 'Off') {
      this.value = 0;
    } 
    else {
      this.value = value;
    }
  
    Action.prototype.play.call(this, user, type, values, force);

  }
}

/**
 * Extend baall action..
 */
function ExBaallAction(name, max, min) {
  
  BaallAction.call(this, name);

  this.max = max;
  this.min = min;

};
// inherits Action
util.inherits(ExBaallAction, BaallAction);
exports.ExBaallAction = ExBaallAction;

/**
 * play method
 */
ExBaallAction.prototype.play = function(user, type, values, force) {
 
  if(type === 'Baall' && values.length === 1) {

    var value = values[0];

    if(value > this.min && value < this.max) {
      Action.prototype.play.call(this, user, type, values, force);
    }

  }
}
