/**
 * Name         : app.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Entry point
 *                Parse config, boot controllers, start socket and start http-server
 */
var express = require('express'),
    winston = require('winston'),
    KNX = require('./controllers/knx.controller'),
    kinectCtrl = require('./controllers/kinect.ctrl'),
    userCtrl = require('./controllers/user.ctrl'),
    regionCtrl = require('./controllers/region.ctrl'),
    commandCtrl = require('./controllers/command.ctrl'),
    actionCtrl = require('./controllers/action.ctrl'),
    KinectSocket = require('./sockets/kinectServer').KinectSocket,
    socketCtrl = require('./sockets/websocket'),
    Store = require('./data/store').Store,
    Baall = require('./actions/baall').Baall,
    persist = require('./data/redis.store'),
    helpers = require('./helpers');

// create server
var app = express.createServer();
var logger = app.logger = new (winston.Logger);

// listening for knx bus
app.knx = new KNX({
  host: app.knxHost,
  port: 6720,
  save: 1
});
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
Baall(app.actions, app);

app.responseError = helpers.responseError;

// read config file
helpers.readConfig(__dirname+'/../conf.json', app, express, persist);

module.exports = app;
