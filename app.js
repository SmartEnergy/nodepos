var express = require('express'),
    kinect = require('./controllers/kinect'),
    user = require('./controllers/user'),
    region = require('./controllers/region'),
    command = require('./controllers/command'),
    action = require('./controllers/action'),
    Store = require('./data/stores').Store,
    CommandStore = require('./data/commands').CommandStore,
    Baall = require('./actions/baall').Baall,
    socket = require('./socket'),
    persist = require('./persist'),
    util = require('util'),
    helpers = require('./helpers');

// create server
var app = module.exports = express.createServer();

// server configuration
app.use(express.bodyParser());
app.use(express.methodOverride());

// command store
var commandStore = app.commands = new CommandStore();
var actionStore = app.actions = app.commands.actions;

// boot controllers 
kinect.configureApp(app);
user.configureApp(app);
region.configureApp(app);
command.configureApp(app);
action.configureApp(app);

// load Baall actions
Baall(app.actions);

// read config file
helpers.readConfig('conf.json', app, express, persist);

/**
 * On new/update user check regions
 * and commands.
 */
app.users.on('new', helpers.checkRegions);
app.users.on('update', helpers.checkRegions);

/**
 * MAIN
 */
if(!module.parent) {

  // boot websocket
  socket.configureSocket(app);

  // listen on port 8000
  app.listen(8000);
  console.log('Express server listening on port %d, environment: %s'
              , app.address().port, app.settings.env);

}
