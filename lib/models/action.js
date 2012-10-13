var events = require('events'),
  http = require('http'),
  sys   = require('sys'),
  eibd = require('eibd');

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
sys.inherits(Action, events.EventEmitter);
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


Action.prototype.play = function(user, type, values, force, callback) {
  
  if(force === true) {
    this.last_execute = new Number(new Date());
    this.emit('play', user);
    this.handler(values);
    
    if(callback) callback();

    return;
  } else if(this.checkLastExec(user) === true || force === true) {
    this.last_execute = new Number(new Date());
    this.last_user = user;

    this.emit('play', user);
  
    this.handler();
    
    if(callback) callback();
    
    return;
  } 

  if(callback) callback(new Error('Failed checkLastExec.'));
}
exports.Action = Action;

/**
 * Model for Base Baall Actions
 *
 * turn on/off devices
 */
function BaallAction (opts, knx) {
  if(!opts.id) {
    console.log('no id given');
    return null;
  } else if(!opts.name) {
    console.log('no gad given');
    return null;
  } else if(!opts.type) {
    console.log('no type given');
    return null;
  }
  
  this.id = opts.id;
  this.name = opts.name;
  this.type = opts.type

  Action.call(this, this.name);

  this.value = null;

  this.handler = function ballrequest() {
    if(this.newValue != null) {
      knx.write(this.id, this.newValue);
    }
  } 
}
// inherits Action
sys.inherits(BaallAction, Action);
exports.BaallAction = BaallAction;

/**
 * play method
 */
BaallAction.prototype.play = function(user, type, values, force, callback) {
  if(type === 'Baall' && values.length === 1) {
    
    var value = values[0];
    if(value === 'On') {
      this.newValue = 1;
    }
    else if(value === 'Off') {
      this.newValue = 0;
    } 
    else {
      this.newValue = value;
    }
  
    Action.prototype.play.call(this, user, type, values, force, callback);

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
sys.inherits(ExBaallAction, BaallAction);
exports.ExBaallAction = ExBaallAction;

/**
 * play method
 */
ExBaallAction.prototype.play = function(user, type, values, force, callback) {
 
  if(type === 'Baall' && values.length === 1) {

    var value = values[0];

    if(value > this.min && value < this.max) {
      Action.prototype.play.call(this, user, type, values, force, callback);
    }

  }
}
