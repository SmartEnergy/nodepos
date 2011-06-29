/**
 * @fileoverview implementing key/value arrays for
 *               regions, actions, users... 
 * @author andree andreek@tzi.de
 */
var events  = require('events'),
    async   = require('async'),
    data    = require('./data'),
    dsscurl = require('./interactions/dsscurl'),
    baall   = require('./interactions/baall'),
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
  }
  if(callback) callback(null, 'removed', key); 

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
      if(callback)  callback(err, 'new', self.items[key]);
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
    callback();
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
exports.Users;

/**
 * Regions
 */
function Regions (actionStore) {
  Store.call(this, 'regions', 'name');

  //this.socket = socket;

  this.actionStore = actionStore;

  this.on('new', function(key, region){
    util.log('new region')
  });

  this.on('update', function(key, region){
    util.log('updated region')
  });

  this.on('removed', function(key){
    util.log('removed region')
  });
}
// inherits Store
util.inherits(Regions, Store);
exports.Regions = Regions;

/**
 * fire userOut event if user was removed
 */
Regions.prototype.removeUser  = function(userId, callback) {
  for(var key in this.items) {
    var region = this.items[key];
    region.removeUser(userId);
  }
  if(callback) callback();
}
/**
 *  check all regions 
 */
Regions.prototype.checkUser       = function(user, callback) {

  for(var key in this.items) {
    var region = this.items[key];
    region.checking(user);
  }
  if(callback)  callback(null);

};

/**
 * add/create new region
 */
Regions.prototype.push          = function(new_region, method, callback) {
    
  var that = this;
  // TODO check region object
  // convert to local region object.
  var region = null;
  switch(method) {
    case 'regionRectangle': 
      region = new data.Rectangle( new_region.name, new_region.actions
                              , new_region.posX, new_region.posY
                              , new_region.width, new_region.height);
      break;
    case 'regionPolygon':
      console.log('neeeew polygon regions..');
      region = new data.Polygon(new_region.name, new_region.actions, new_region.points);
      break;
    default:
      break;
  }

  if(region === null) {
    return;
  }

  // push region after bind actions process
  function callSuper(that, region){
    Store.prototype.push.call(that, region, callback);
  }

  // bind actions
  Regions.prototype.bindActions.call(this, region, callSuper);
}

/**
 *  Bind actions to event of region
 */
Regions.prototype.bindActions = function(region, callback) {
  var that = this;
  for(var idx in region.actions) {
    var name = region.actions[idx].action;
    var eventName = region.actions[idx].event;
    this.actionStore.get(name, function(err, action) {

      function execAction(user) {
          action.play(user);
      }
      region.addListener(eventName, execAction);

    });
  }
  callback(that, region);
}

/**
 *  Modified store for actions
 */
function Actions (user, pw, dss, knx) {
  Store.call(this, 'actions', 'name');
  var that = this;
  this.conn = new dsscurl.Connection;
  this.user = user;
  this.pw = pw;
  this.connected = false;
  this.knx = knx; 
  if(dss === true) {
    this.conn.login(user, pw, function(result) {
      if(result === true) {
        that.connected = true;
        util.log('[ACTIONSTORE] Connection to digitalStrom server..');
      }
    });
  }

};
util.inherits(Actions, Store);
exports.Actions = Actions;

/**
 * create baall actions
 */
Actions.prototype.readBaall = function() {
  if(this.knx === true ) {
    baall.Baall(this); 
  }
}

/**
 * read digitalstrom scenes
 */
Actions.prototype.readDsScenes = function () {
  var that = this;
  if(this.connected === true) {
    this.conn.readActions(function (result) {
      Actions.prototype.parseDsScenes.call(that, result);
    });
  }
};

/**
 * parse digitalstrom scenes to actions
 */
Actions.prototype.parseDsScenes = function(result) {
  var that = this;
  // zones 
  for(var i in result.zones) {
  
    var zone = result.zones[i];
    var zoneId = zone.ZoneID;

    // groups
    for(var j in zone.groups) {

      // scenes
      for(var k in zone.groups[j].scenes) {

        var scene = zone.groups[j].scenes[k];

        // parse unique action name. Example: dss_0_light1On
        var actionName = 'dss_' + zoneId + '_' + scene.name;
        
        // create action and push to items
        var action = new data.Action(actionName, function() {
          that.conn.callScene(zoneId, scene.scene);
        });
        Store.prototype.push.call(this, action);
      }
    }
  }
};
