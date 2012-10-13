/**
 * Name         : kinect.socket.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : TCP socket connection to communicate with
 *                kinectController
 */
var net = require('net'),
    KinectClient = require('./kinectClient').KinectClient;

var PORT = 8001;

// Status Codes
var OK = "OK";
var INTERNALERR = "INTERNAL_ERROR";
var INVALIDREQ = "INVALID_REQUEST";

/**
 * TCP server for KinectController 
 *    - Add new Users
 *    - Configure Kinects
 *    - Push Updates
 */
function KinectSocket(app) {
  KinectSocket.prototype.app = app;

  this.server = net.createServer();

  this.server.on('connection', this.entryPoint)
      .listen(PORT);

};
exports.KinectSocket = KinectSocket;

/**
 * Callback for all incoming socket connections
 */
KinectSocket.prototype.entryPoint = function(socket) {
  
  socket.on('data', KinectSocket.prototype.handleData);

}

/**
 * Responses answer to socket
 */
KinectSocket.prototype.response = function(socket, status, results) {
  var res = {
    status: status,
    results: results
  };
  socket.write(JSON.stringify(res));
}

/**
 * Handles all user requests
 */
KinectSocket.prototype.handleUser = function(socket, request) {
  
  switch(request.cmd) {
    case "new":
      var isValid = true;
      var users = request.data;
      var self = this;
      if(users && users.length > 0) {
        
          users.forEach(function(val, index, array) {
            self.app.users.push(val);
          });
        
          this.response(socket, OK, null);
      
      } else {
        this.response(socket, INVALIDREQ, "no data");
      }
      break;
    default: 
      this.response(socket, INVALIDREQ, "cmd not found");
      break;
  }

}

/**
 * Handle push of kinects to store
 */
KinectSocket.prototype.addKinects = function(socket, request) {
   var kinects = request.data;
   var isValid = true;

   for (var i = 0; i < kinects.length; i++) {
     var kinect = kinects[i];
     if(this.app.kinects.isValid(kinect) === false) {
       isValid = false;
     }
   };
  
   if(isValid === true) {
      var self = this;
      kinects.forEach(function(val, index, array) {
        self.app.kinects.push(val);
      });
 
     this.response(socket, OK, null);

   } else {

     this.response(socket, INVALIDREQ, "invalid data");

   }
}

/**
 * Handles all kinect requests
 */
KinectSocket.prototype.handleKinect = function(socket, request) {
  
  switch(request.cmd) {
    case "index":
      var self = this;
      function cbidx(err, result) {
        if(err) {
          self.response(socket, INTERNALERR, null);
        } else {
          self.response(socket, OK, result);
        }
      }
      self.app.kinects.toArray(cbidx);
      break;
    case "new":
      this.addKinects(socket, request);
      break;
    case "update": 
      this.addKinects(socket, request);
      break;
    case "delete":
      var id = request.data;
      var self = this;
      function cb(err) {
        if(err) {
          self.response(socket, INVALIDREQ, null);
        } else {
          self.response(socket, OK, null);
        }
      }
      this.app.kinects.remove(id, cb);
      break;
    default:
      this.response(socket, INVALIDREQ, "cmd not found");
      break;
  }

}

/**
 * Callback after new data from socket
 * arrived.
 */
KinectSocket.prototype.handleData = function(data) {
  var dt = data.toString();
  
  var request = { object: 'null' };
  try {
    request = JSON.parse(dt);
  } catch (e) {
  
  }
  
  switch(request.object) {
    case "kinects":
      KinectSocket.prototype.handleKinect(this, request);
      break;
    case "users":
      KinectSocket.prototype.handleUser(this, request);
      break;
    default:
      KinectSocket.prototype.response(this, INVALIDREQ, "Object not found");
      break;
  }
};
