module.exports.configureSocket = function(app) {

  var io = require('socket.io').listen(app);
    
  defineUserMsgs(app, io.sockets);
  defineRegionMsgs(app, io.sockets);
  defineKinectMsgs(app, io.sockets);
  defineCommandMsgs(app, io.sockets);

  io.sockets.on('connection', function(socket) {

    defineGetMessages(app, socket);
   
    /**
     * messages from client
     */ 
    socket.on('newKinect', function(kinect) {
      app.kinects.push(kinect); 
    });

    socket.on('newRegion', function(region) {
      app.regions.push(region); 
    });
    
    socket.on('removeRegion', function(key) {
      app.regions.remove(key); 
    });

    socket.on('newCommand', function(command) {
      app.commands.push(command); 
    });

    socket.on('removeCommand', function(key) {
      app.commands.remove(key);
    });

  });
};

/**
 * get messages
 */
function defineGetMessages(app, socket) {

  socket.on('getRegions', function(fn) {
    var regions = app.regions.toArray();
    fn(regions);
  });
  
  socket.on('getKinects', function(fn) {
    var kinects = app.kinects.toArray();
    fn(kinects);
  });
  
  socket.on('getCommands', function(fn) {
    var commands = app.commands.toArray();
    fn(commands);
  });

};

/**
 * all socket events for users
 */
function defineUserMsgs(app, sockets) {

  app.users.addListener('new', function(key, user) {
    sockets.emit('newUser', user);  
  });
  
  app.users.addListener('update', function(key, user) {
    sockets.emit('updateUser', user);  
  });
  
  app.users.addListener('removed', function(key) {
    sockets.emit('removedUser', key);  
  });

};

/**
 * all socket events for kinects
 */
function defineKinectMsgs(app, sockets) {
  
  app.kinects.addListener('new', function(key, kinect) {
    sockets.emit('newKinect', kinect);  
  });
  
  app.kinects.addListener('update', function(key, kinect) {
    sockets.emit('updateKinect', kinect);  
  });
  
  app.kinects.addListener('removed', function(key) {
    sockets.emit('removedKinect', key);   
  });

}

/**
 * all socket events for regions
 */
function defineRegionMsgs(app, socket, sockets) {
  
  app.regions.addListener('new', function(key, region) {
    sockets.emit('newRegion', region);  
  });
  
  app.regions.addListener('update', function(key, region) {
    sockets.emit('updateRegion', region);  
  });
  
  app.regions.addListener('removed', function(key) {
    sockets.emit('removedRegion', key);    
  });

}

/**
 * all socket events for commands
 */
function defineCommandMsgs(app, socket, sockets) {

  app.commands.addListener('new', function(key, command) {
    sockets.emit('newCommand', command);  
  });
  
  app.commands.addListener('update', function(key, command) {
    sockets.emit('updateCommand', command);  
  });
  
  app.commands.addListener('removed', function(key) {
    sockets.emit('removedCommand', key);     
  });

}
