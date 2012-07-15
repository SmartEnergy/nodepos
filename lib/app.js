/**
 * Name         : app.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Entry point
 *                Parse config, boot controllers, start socket and start http-server
 */
var express = require('express'),
    winston = require('winston'),
    kinectCtrl = require('./controllers/kinect.ctrl'),
    KinectSocket = require('./controllers/kinect.socket').KinectSocket,
    userCtrl = require('./controllers/user.ctrl'),
    regionCtrl = require('./controllers/region.ctrl'),
    commandCtrl = require('./controllers/command.ctrl'),
    actionCtrl = require('./controllers/action.ctrl'),
    socketCtrl = require('./controllers/socket.ctrl'),
    Store = require('./data/store').Store,
    Baall = require('./actions/baall').Baall,
    persist = require('./data/redis.store'),
    helpers = require('./helpers');

// create server
var app = express.createServer();
var logger = app.logger = new (winston.Logger);
app.configure('test', function(){

});
app.startProc = helpers.startProc;
app.configure('development', function(){
  app.logger.add(winston.transports.Console, { colorize: true });
  app.logger.add(winston.transports.File,{ filename: __dirname+'/../server.log' });
});
// configure logger

// server configuration
app.use(express.bodyParser());
app.use(express.methodOverride());

// boot controllers 
kinectCtrl.configureApp(app);
userCtrl.configureApp(app);
regionCtrl.configureApp(app);
commandCtrl.configureApp(app);
actionCtrl.configureApp(app);
socketCtrl.configureSocket(app);

var knsocket = new KinectSocket(app);

// load Baall actions
Baall(app.actions);

app.responseError = helpers.responseError;

// read config file
helpers.readConfig(__dirname+'/../conf.json', app, express, persist);

module.exports = app;
