/**
 * @fileoverview configure socket.io connection with
 *               clients. Fetch/send messages. 
 * @author andree andreek@tzi.de
 */
var async = require('async'),
    fs    = require('../lib/json2file'),
    io    = require('socket.io'),
    util  = require('util');

/**
 * Socket connection with socket.io
 */
function Socket(server, userStore, regionStore, actionStore, gestureStore, kinectStore, scene) {
  
  // listening to server
  this.socket = io.listen(server);
  this.userStore  = userStore;
  this.regionStore  = regionStore;
  this.actionStore  = actionStore;
  this.gestureStore  = gestureStore;
  this.kinectStore  = kinectStore;

  this.scene = scene;

  // init events
  this.initServerEvents(); 
  this.initClientEvents();
};
exports.Socket = Socket;

/**
 * Fetch sent messages from client
 */
Socket.prototype.initServerEvents  = function() {
  var that = this;
  this.socket.on('connection', function (client) {
     client.on(
       'message', 
       function(data) {
        Socket.prototype.onMessage.call(that, client, data);
       }); 
  });
};

/**
 *  Send events to socket on userStore, regionStore and region
 */
Socket.prototype.initClientEvents  = function() {
  var that = this;

  Socket.prototype.initUserStore.call(that);

  Socket.prototype.initRegion.call(that);

  // Add beforePlay event to actions
  // Tell client that action was executed.
  that.actionStore.addListener('new', function(key, action) {
      action.addListener('beforePlay', function(user, play) {
        util.log('[ACTION] Playing.. ' + this.name);
        Socket.prototype.broadcast.call(
          that, 
          { 
            event: 'triggeredAction', 
            name: action.name, 
            user: user 
          }
        );
        play();
      });    
  });

};

/**
 * little helper func for broadcast
 */
Socket.prototype.broadcast  = function(message) {
    this.socket.broadcast(JSON.stringify(message));
};

/**
 * handle messages from client
 */
Socket.prototype.onMessage = function(client, data) {
  var that   = this;
  var client = client;
  var parsed = JSON.parse(data);
  var method = parsed.method;
  switch(method) {
    case 'kinect':
      pushKinect(parsed, client, method, that.kinectStore);
      break;
    case 'deleteKinect':
      that.kinectStore.remove(
          parsed.key,
          function(err, event, key) { 
            client.broadcast(JSON.stringify( { event: 'removedKinect', key: key}));
            client.send(JSON.stringify({ event: 'deleteKinect', success: true }));
          });
      break;
    case 'regionPolygon':
      pushRegion(parsed, client, method, that.regionStore);
      break;
    case 'regionRectangle':
      pushRegion(parsed, client, method, that.regionStore);
      break;
    case 'deleteRegion':
      that.regionStore.remove(
          parsed.key,
          function(err, event, key) { 
            client.broadcast(JSON.stringify( { event: 'removedRegion', key: key}));
            client.send(JSON.stringify({ event: 'deleteRegion', success: true }));
          });
      break;
    case 'loadActions':
      that.actionStore.toArray(function(err, result){
        client.send(JSON.stringify( { event: 'loadActions', success: true, actions: result }));
      });
      break;
    case 'loadRegions':
      that.regionStore.toArray(function(err, result){
        client.send(JSON.stringify( { event: 'loadRegions', success: true, regions: result }));
      });
      break;
    default:
      break;
  }
};

/**
 * Broadcast region(!) events to client:
 *  - userIn
 *  - userOut
 */
Socket.prototype.initRegion = function() {
  var that = this;

  // regions
  that.regionStore.addListener('new', regionListenerCb);
  that.regionStore.addListener('update', regionListenerCb);

  function regionListenerCb (key, region) {
    region.addListener('userIn', function(user) {
      that.broadcast({event: 'userIn', region: this, user: user});
    });
        
    region.addListener('userOut', function(user) {
      that.broadcast({event: 'userOut', region: this, user: user});
    });
  };

};

/**
 * bind userStore events for broadcasting
 * events:
 *  - newUser
 *  - updateUser
 *  - removedUser
 */
Socket.prototype.initUserStore = function () {

  var that = this;
  
  // send new user to clients
  that.userStore.addListener('new', function(key, user) {
    that.broadcast({ event: 'newUser', user: user, key: key});
    that.regionStore.checkUser(user);

  });

  // send updated user to clients
  that.userStore.addListener('update', function(key, user) {
    that.broadcast({ event: 'updateUser', user: user, key: key});
    that.regionStore.checkUser(user, function() {});
  });

  // send removed user to clients
  that.userStore.addListener('removed', function(key){
    that.broadcast({ event: 'removedUser', key: key});
  });
}
/**
 * push sent regions to regionstore and broadcast other clients
 */
function pushRegion(parsed, client, method, regionStore) {
  // map over all regions
  async.map(      
    parsed.regions,
    function(item, callback){

      // add region to store
      regionStore.push(item, method, function(err, event, item) {
    
        // broadcast all others client sockets.
        client.broadcast(JSON.stringify( { event: event+'Region', region: item, key: item.name}));
    
      });
    
      callback(item);
    },
    function(err, results){
      client.send(JSON.stringify({ event: method, success: true }));
    }
  );
}

/**
 */
function pushKinect(parsed, client, method, kinectStore) {
  // map over all kinects
  async.map(      
    parsed.kinects,
    function(item, callback){

      // add kinect to store
      kinectStore.push(item, function(err, event, item) {
    
        // broadcast all others client sockets.
        client.broadcast(JSON.stringify( { event: event+'Kinect', kinect: item, key: item.id}));
    
      });
    
      callback(item);
    },
    function(err, results){
      client.send(JSON.stringify({ event: method, success: true }));
    }
  );
}

