/**
 * Name         : socket.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Configure server to have a socket.io layer. Defines all messages
 *                that can send/receive over the socket.
 */
var Action = require('../models/action').Action,
    redis = require('redis').createClient();

/**
 * Configures server side socket.io
 * 
 * Defining all events and messages the server 
 * listening for.
 *
 */
module.exports.configureSocket = function(app) {

  var knx = app.knx;
  var io = require('socket.io').listen(app);

  // no debug messages
  io.set('log level', 1);

  // update on changes via http
  app.regions.addListener('update', function(key, region) {
    io.sockets.emit('updateRegion', region);
  });

  // knx status updates
  knx.on('data', function(action, src, dest, value) {
    if(action === 'Write' || action === 'Response') {
      
      if(value === 0) {
        value = 'Off';
      } else if(value === 1) {
        value = 'On';
      }
      
      io.sockets.emit('updateDevice', dest, value);

    }
    
  });

  io.sockets.on('connection', function(socket) {
  
    defineUserMsgs(app, socket);
    defineKinectMsgs(app, socket);

    definePushUiMsgs(app, io.sockets);

    defineGetMessages(app, socket);

    socket.on('getDevices', function() {
      knx.getDevices(function(err, devices) {
        if(!err) {
          socket.emit('devices', devices);
        }
      });
    });
   
    /**
     * messages from client
     */ 
    socket.on('updateKinect', function(kinect) {
      
      if(app.kinects.isValid(kinect)){
        app.kinects.push(kinect);      
        socket.broadcast.emit('updateKinect', kinect);  
      }

    });

    socket.on('newRegion', function(region) {

      if(app.regions.isValid(region)){

        app.regions.push(region, function (err, method, region) {

          if(err) return;

          if(method === 'new') {
            /**
             * broadcast socket on enter and leave
             */
            region.addListener('userIn', function(user) {
	      			var jsonUser = { 
								position: user.position,
								id: user.id,
  							time: user.time,
  							gesture: user.gesture
						  };
              socket.broadcast.emit('userInRegion', this.name, jsonUser);  
            });
            
            region.addListener('userOut', function(user) {
	      			var jsonUser = { 
								position: user.position,
								id: user.id,
  							time: user.time,
  							gesture: user.gesture
						  };
              socket.broadcast.emit('userOutRegion', this.name, jsonUser);  
            });

          }
        });
        socket.broadcast.emit('newRegion', region);  
      }

    });
    
    socket.on('updateRegion', function(region) {

      if(app.regions.isValid(region)){
        app.regions.push(region);      
        socket.broadcast.emit('updateRegion', region);  
      }

    });

    socket.on('removeRegion', function(key) {

      if(key){
        app.regions.remove(key); 
        socket.broadcast.emit('removedRegion', key);   
      }

    });

    socket.on('newCommand', function(command) {

      // TODO Validate
      //if(app.commands.isValid(command)){
        app.commands.push(command, app.regions, app.actions);      
        socket.broadcast.emit('newCommand', command);  
      //}

    });

    socket.on('removeCommand', function(key) {

      if(key){
        app.commands.remove(key);
        socket.broadcast.emit('removedCommand', key);   
      }

    });

    socket.on('execAction', function(values) {
      var action = app.actions.items[values.name];
      if(action) {
        action.play(null, values.category, values.values, true);
      }

    });

  });
};

/**
 * get messages
 */
function defineGetMessages(app, socket) {

  socket.on('getRegions', function(fn) {
    app.regions.toArray(function(err, regions) {
      fn(regions);
    });
  });
  
  socket.on('getKinects', function(fn) {
    app.kinects.toArray(function(err, kinects) {
      fn(kinects);
    });
  });
  
  socket.on('getCommands', function(fn) {
    app.commands.toArray(function(err, commands) {
      fn(commands);
    });
  });

};

/**
 * all socket events for users
 */
function defineUserMsgs(app, socket) {
    app.users.addListener('new', function(key, user) {
      socket.emit('newUser', { id: user.id, position: user.position, time: user.time, gesture: user.gesture, joints: user.joints });  
    });
    
    app.users.addListener('update', function(key, user) {
      socket.emit('updateUser', { id: user.id, position: user.position, time: user.time, gesture: user.gesture, joints: user.joints });  
    });
    
    app.users.addListener('removed', function(key) {
      socket.emit('removedUser', key);  
    });
};

/**
 * store events
 */
function defineKinectMsgs (app, socket) {
  
  app.kinects.addListener('new', function(key, kinect) {
    socket.emit('newKinect', kinect);  
  });
  
  app.kinects.addListener('update', function(key, kinect) {
    socket.emit('updateKinect', kinect);  
  });
  
  app.kinects.addListener('removed', function(key) {
    socket.emit('removedKinect', key);  
  });

}

/**
 * Push ui to client
 */
function definePushUiMsgs(app, socket) {
  var pushUi = new Action('pushUi', function(value) {
    socket.emit('pushUi', value);  
  });

  app.actions.push(pushUi);
}
