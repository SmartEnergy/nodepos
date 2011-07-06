var express = require('express'),
    kinect = require('./controllers/kinect'),
    user = require('./controllers/user'),
    region = require('./controllers/region'),
    util = require('util');

// create server
var app = module.exports = express.createServer();

// server configuration
app.use(express.bodyParser());
app.use(express.methodOverride());

// boot controllers 
kinect.configureApp(app);
user.configureApp(app);
region.configureApp(app);

if(!module.parent) {
  // listen on port 8000
  app.listen(8000);
  console.log('Express server listening on port %d, environment: %s'
              , app.address().port, app.settings.env);
} 
