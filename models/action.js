var events = require('events'),
    util   = require('util');

/* 
 * Action executes an interaction with baall or digitalStrom
 */
function Action (name, handler) {

  events.EventEmitter.call(this);

  this.name = name;
  this.handler = handler;

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

Action.prototype.play = function(user, type, values) {

  this.emit('play', user);

  // execute action
  if(type === 'Baall') {
    if(values.length === 1) {
      this.handler(values[0]); 
    }
  } else if( type === 'digitalStrom') {
    this.handler(null);
  }
}
exports.Action = Action;
