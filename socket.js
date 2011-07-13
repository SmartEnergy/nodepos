module.exports.configureSocket = function(app) {

  var io = require('socket.io').listen(app);

  io.sockets.on('connection', function(socket) {
  
    defineUserMsgs(app, io.sockets);
    defineKinectMsgs(app, io.sockets);

    defineGetMessages(app, socket);
   
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
        app.regions.push(region);      
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
        app.commands.push(command);      
        socket.broadcast.emit('newCommand', command);  
      //}

    });

    socket.on('removeCommand', function(key) {

      if(key){
        app.commands.remove(key);
        socket.broadcast.emit('removedCommand', key);   
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
 * store events
 */
function defineKinectMsgs (app, sockets) {
  
  app.kinects.addListener('new', function(key, kinect) {
    sockets.emit('newKinect', kinect);  
  });
  
  app.kinects.addListener('removed', function(key) {
    sockets.emit('removedKinect', key);  
  });

}
