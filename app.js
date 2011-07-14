var express = require('express'),
    kinect = require('./controllers/kinect'),
    user = require('./controllers/user'),
    region = require('./controllers/region'),
    Store = require('./data/stores').Store,
    CommandStore = require('./data/commands').CommandStore,
    Baall = require('./actions/baall').Baall,
    dsscurl = new require('./actions/dsscurl.js'),
    socket = require('./socket'),
    util = require('util');

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

// load dss actions
var dss = new dsscurl.Connection; 
dss.readActions(app.actions);

// load Baall actions
Baall(app.actions);

/**
 * On new/update user check regions
 * and commands.
 */
app.users.on('new', checkRegions);
app.users.on('update', checkRegions);

function checkRegions(key, user) {

  app.regions.checkUser(user, execCommands);

  function execCommands(err) {
    if(err === false) app.commands.execAll(user);
  }
};

if(!module.parent) {
  // boot websocket
  socket.configureSocket(app);

  // listen on port 8000
  app.listen(8000);
  console.log('Express server listening on port %d, environment: %s'
              , app.address().port, app.settings.env);
}
