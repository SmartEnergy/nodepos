var events      = require('events'),
    util        = require('util');

/**
 * Region
 *
 * An area in a room, which could
 * be entered by a user. One Region emit
 * three events:
 *  - "userIn"
 *  - "userOut"
 *  - "userAlreadyIn"
 *  - "userNotIn"
 *
 * @param name  'kitchen', 'bathroom', 'bedroom' ..
 * @param type  'polygon', 'rectangle'
 *
 * @method checking
 * @method isUserIn 
 */
function Region(name, type) {
  events.EventEmitter.call(this);
  
    
    this.name	= name;
    this.type = type; 
    this.users = [];
  

};
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
  if(idx != -1) {
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
  
  if(self.isUserIn(user) === true) {

    Region.prototype.userAlreadyInRegion.call(this, user, function(result) {

      if(result === true) {
        self.emit('userAlreadyIn', user);
      } else {
        self.users.push(user.id);
        self.emit('userIn', user);
      }

      if(callback) callback(true);
    });

  } else {
    var self = this;
    Region.prototype.userAlreadyInRegion.call(this, user, function(result) {
      if(result === true) {
        self.emit('userOut', user);
        Region.prototype.removeUser.call(self, user.id);
        
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
  if(user != undefined) {
      this.users.splice(idx, 1);
      if(callback) callback(true);
  } else {
     if(callback) callback(false);
  }
};

/**
 * Rectangle
 */
function Rectangle (name, posX, posY, width, height) {

  Region.call(this, name, 'rectangle');
  
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
Rectangle.prototype.isUserIn = function(user) {

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
 * update attributes of region
 */
Rectangle.prototype.update = function(region) {

  this.posX = region.posX;
  this.posY = region.posY;
  this.width = region.width;
  this.height = region.height;

};

/**
 * Polygon
 */
function Polygon(name, points) {
  Region.call(this, name, 'polygon');

  this.points = points;
};
// inherits Region
util.inherits(Polygon, Region);
exports.Polygon = Polygon;

/**
 * Check if user is in this.points
 */
Polygon.prototype.isUserIn = function(user) {
  for(var c = false, i = -1, l = this.points.length, j = l - 1; ++i < l; j = i)
      ((this.points[i].yMM <= user.position.y && user.position.y < this.points[j].yMM) 
    || (this.points[j].yMM <= user.position.y && user.position.y < this.points[i].yMM))
    && (user.position.x < (this.points[j].xMM - this.points[i].xMM) * (user.position.y - this.points[i].yMM) / (this.points[j].yMM - this.points[i].yMM) + this.points[i].xMM)
    && (c = !c);
  return c; 
};

/**
 * update attributes of region
 */
Polygon.prototype.update = function(region) {

  this.points = region.points;

};
