var express = require('express'),
    kinect = require('./controllers/kinect'),
    user = require('./controllers/user'),
    region = require('./controllers/region'),
    Store = require('./data/stores').Store,
    CommandStore = require('./data/commands').CommandStore,
    Baall = require('./actions/baall').Baall,
    socket = require('./socket'),
    persist = require('./persist'),
    util = require('util'),
    fs = require('fs');

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

// load Baall actions
Baall(app.actions);

/** 
 * Read config file
 */
fs.readFile('conf.json', encoding='utf8', function(err, results){
  if(err === null) {
    var conf = JSON.parse(results);
    if(conf.persist === true) {
    
      // persisting
      persist.configurePersist(app);

    }
    
    // viewpath
    fs.stat(conf.viewpath, function(err, stat) {
      if(err) {
        console.log('Error on selecting viewpath');
      } else if(stat) {
        console.log('Defining gui path..');
        app.use(express.static(conf.viewpath));
      } else {
        console.log('ladia');
      }
    });
  }
});

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
