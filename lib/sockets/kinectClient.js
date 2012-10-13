/**
 * Name         : kinect.socket.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : TCP socket connection to communicate with
 *                kinectController
 */
var net = require('net');

var HOST = 'localhost';
var PORT = 8010;

function KinectClient(app) {
  this.app = app;
  
  this.client = new net.Socket();
  this.client.connect(HOST, PORT);

  var self = this;

  this.client.on('connection', function() {
    
    function sendKinect(id, kinect) {

      self.client.write(JSON.stringify({
        cmd: "new",
        object: "kinects",
        data: [kinect]
      })+'\0');

    } 
    
    self.app.kinects.toJson(function(err, result) {
      if(!err) {
        self.client.write(JSON.stringify({
          cmd: "new",
          object: "kinects",
          data: []
        })+'\0');
      }
    });


    self.app.kinects.on('new', sendKinect); 

    self.app.kinects.on('update', sendKinect); 
    
    self.app.kinects.on('removed', function(id) {
      self.client.write(JSON.stringify({
        cmd: "delete",
        object: "kinect",
        data: [id]
      }));
    }); 
  
  });
};
exports.KinectClient = KinectClient;
