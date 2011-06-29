var express = require('express'),
    kinect = require('./controllers/kinect'),
    user = require('./controllers/user'),
    util = require('util');

// TODO: /regions /regions/update/ID /regions/new
// TODO: / ('Tobis guuuuuuuuui..')
// TODO: /status ('simple status page')

// create simple http server
var app = module.exports = express.createServer();

// server configuration
app.use(express.bodyParser());
app.use(express.methodOverride());

// boot kinect controller 
kinect.configureApp(app);

// boot user controller
user.configureApp(app);

// boot region controller

if(!module.parent) {
  // listen on port 8000
  app.listen(8000);
  console.log('Express server listening on port %d, environment: %s'
              , app.address().port, app.settings.env);
} 
