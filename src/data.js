/**
 * @fileoverview provides scene, region and action object
 * @author andree andreek@tzi.de
 */
var events      = require('events'),
    async       = require('async'),
    fs          = require('../lib/json2file'),
    util        = require('util');

/**
 * @Class Scene 
 * A scene is a complete configuration for nodePos.
 * This includes regions, actions and informations
 * about connection to dss/baall.
 *
 * @param name
 * @param ip
 * @param port
 * @param bg_image
 * @param roomlength
 * @param roomdepth
 *
 */
function Scene () {

  this.name = 'testscene';
  
  // ip and port
  this.ip = 'localhost';
  this.port = 8000;

  // room informations
  this.bg_image = 'img/baall_karte.png';
  this.roomlength = 10605;
  this.roomdepth = 5850;

  // connect with baall or dss?
  this.baall = false; 
  this.dss   = false;

  // stores
  this.regions = [];
};
exports.Scene = Scene;
/**
 * Save current scene configuration to file
 */
Scene.prototype.toFile = function(filename, regionStore, callback) {
  var that = this;
  regionStore.toArray(
    function(err, regions){
      that.regions = regions;
      fs.writeFile(filename, that, function() {
        if(callback) callback();
      });    
    }
  );
};

/**
 * Parse scene from file
 * @param data string
 */
Scene.prototype.parseFromFile = function(filename, callback) {
  var that = this;
  fs.readFile(filename, function(err, results){
    if(err === null) {
      var scene = JSON.parse(results);
  
      that.name = scene.name;
      that.ip = scene.ip;
      that.port = scene.port;
      that.bg_image = scene.bg_image;
      that.roomlength = scene.roomlength;
      that.roomdepth = scene.roomdepth;
      that.dss = scene.dss;
      that.baall = scene.baall;
      that.regions = scene.regions; 
    }
    callback(that);

  });
};

/**
 *	Region
 *	
 *	@params:
 *		name	[Something like 'bathroom', 'kitchen_fridge'...]
 *
 *		posX
 *		posY
 *		width
 *		height
 *
 *		events	[Array of Action-Objects]
 *	
 *	@methods:
 *		checking	[Is user in region?]
 *		broadcast	[all events should play]
 *
 *	@events:
 *		userIn		[User is in region]
 *		userNotIn	[User is not in region]
 *		newPosOfUser    [User position in region maybe changed]
 *		userOut         [User has leaved region]
 *
 */
function Region(name, actions) {
	
  events.EventEmitter.call(this);
	
  this.name	= name;
  this.actions = actions;
  this.users      = [];
  this.gestures   = [ 'zeroWavesOneClick', 'oneWaveZeroClicks', 'oneWaveOneClick', 'oneWaveTwoClicks'
                    , 'oneWaveThreeClicks', 'oneWaveFourClicks', 'oneWaveFiveClicks'];

  // on user is not in region
  this.on('userNotIn', function(user){
  });	

  this.on('userIn', function(user){
  });	
        
  this.on('newPosOfUser', function(user) {
  });

  this.on('userOut', function(user) {
  });
}
exports.Region = Region;
// inherit events.EventEmitter
util.inherits(Region, events.EventEmitter);
Region.super_ = events.EventEmitter;
Region.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Region,
		enumerable: false
	}		
});

/**
 * Verify if user already in this region
 */
Region.prototype.userAlreadyInRegion = function(user, callback) {
  var idx = this.users.indexOf(user.id);
  if(typeof this.users[idx] != 'undefined') {
    callback(true);
  }
  else {
    callback(false);
  }
};

/**
 *	Checking a user position
 */
Region.prototype.checking = function(user, callback) {
	
	var self = this;
  
  if(self.userIn(user)) {

    Region.prototype.userAlreadyInRegion.call(this, user, function(result) {

      if(result === true) {
        self.emit('newPosOfUser', user);
      } else {
        self.users.push(user.id);
        self.emit('userIn', user);
      }

      if(callback) callback(true);
    });

  } else {

    Region.prototype.userAlreadyInRegion.call(this, user, function(result) {
      if(result === true) {
        // user out of area
        var idx = self.users.indexOf(user.id);
        self.users.splice(idx, 1);
        self.emit('userOut', user);
      } else {
        self.emit('userNotIn', user);
      }
      if(callback) callback(false);
    });

  }
};

/**
 * Remove user from region
 */
Region.prototype.removeUser = function(userId, callback) {
  var idx = this.users.indexOf(userId);
  var user = this.users[idx];
  if(typeof user != 'undefined') {
      this.users.splice(idx, 1);
      this.emit('userOut', user);
  }
};


/**
 * Rectangle
 */
function Rectangle (name, actions, posX, posY, width, height) {

  Region.call(this, name, actions);
  
  this.posX	= posX;
  this.posY	= posY;
  this.width	= width;
  this.height	= height;
}
// inherits Region
util.inherits(Rectangle, Region);
exports.Rectangle = Rectangle;

/**
 * Check if user is in this rectangle
 */
Rectangle.prototype.userIn = function(user) {

  var self = this;
	var userpos = user.position;
  
  var isInXPos    = userpos.x >= self.posX;
  var isInXWidth  = userpos.x <= (self.posX+self.width); 
  
  var isInYPos    = userpos.y >= self.posY;
  var isInYHeight = userpos.y <= (self.posY+self.height); 

  if( isInXPos && isInXWidth && isInYPos && isInYHeight ) {
    return true;
  }
  return false; 
};

/**
 * Polygon
 */
function Polygon(name, actions, points) {
  Region.call(this, name, actions);

  this.points = points;
};
// inherits Region
util.inherits(Polygon, Region);
exports.Polygon = Polygon;

/**
 * Check if user is in this.points
 */
Polygon.prototype.userIn = function(user) {
  for(var c = false, i = -1, l = this.points.length, j = l - 1; ++i < l; j = i)
      ((this.points[i].yMM <= user.position.y && user.position.y < this.points[j].yMM) 
    || (this.points[j].yMM <= user.position.y && user.position.y < this.points[i].yMM))
    && (user.position.x < (this.points[j].xMM - this.points[i].xMM) * (user.position.y - this.points[i].yMM) / (this.points[j].yMM - this.points[i].yMM) + this.points[i].xMM)
    && (c = !c);
  return c; 
};

/**
 *	Object Action
 *
 *	@params:
 *		name		[Something like 'lightOn']
 *		handler 	[Function (to put the light on)]
 *
 *	@methods:
 *		play	[Executes handler]
 *	
 *	@events:
 *		beforePlay	
 *		play
 *		afterPlay
 *		broadcast(area)	
 *
 */
function Action(name, handler) {
	
	events.EventEmitter.call(this);
	
	this.name = name;
	this.handler = handler;

}
// inherit events.EventEmitter
util.inherits(Action, events.EventEmitter);
Action.super_ = events.EventEmitter;
Action.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Action,
		enumerable: false
	}		
});

/*
 * Executes handler and fires events..
 */
Action.prototype.play = function(user) {
	var self = this;
	// if callback is not called, the scene won't play
	this.emit('beforePlay', user, function() {
		self.handler();
		self.emit('afterPlay');
	});
}
exports.Action = Action;
