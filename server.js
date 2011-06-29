/**
 * @fileoverview This server is used to recognized if users
 *               are in a region. You can define some actions
 *               to execute scenes on dss or  baall if users
 *               entered a region for example.
 * @author andree andreek@tzi.de
 * @version 0.0.1
 */
var Socket        = require('./src/socket').Socket,
    Request       = require('./src/request').Request,
    async         = require('async'),
    http          = require('http'),
    data          = require('./src/data'),
    stores        = require('./src/stores'),
    util          = require('util');

// main..
var conf = process.argv[2];
var DEBUG = Boolean(process.argv[3]);
// Read configuration
var scene = new data.Scene();
if(typeof conf === 'undefined') {
  util.log( 'No configuration file given. Using default.' +
            ' All changes will be written to ./conf.json\n');
  conf = 'conf.json';
  configureStores(scene);
} else {
  scene.parseFromFile(conf, configureStores);
}

/**
 * Initialize stores
 */
function configureStores(scene) {
  // Stores for users and regions
  var userStore   = new stores.Users();
  var actionStore = new stores.Actions(
      'dssadmin', 'dssadmin', scene.dss, scene.baall
      );
  var regionStore = new stores.Regions(actionStore);
  var gestureStore = new stores.Store('gestures', 'name');
  var kinectStore = new stores.Store('kinects', 'id');

  // remove user from regions
  userStore.addListener('removed', function(key) {
    regionStore.removeUser(key);
  });

  // every three seconds check for user timeout
  setInterval(function() {
      async.map(      
        userStore.items,
        function(user, callback){
          userStore.remove(user.id, callback);
        },
        function(err, results){
        }
        );
  }, 3000);

  // start server..
  startServer(userStore, actionStore, regionStore, gestureStore, kinectStore, scene, afterServerStart);

  // read/add actions after server start
  function afterServerStart(actionStore) {
    util.log('Server is running on ' + scene.ip + ':' + scene.port);
    actionStore.readDsScenes();
    actionStore.readBaall();

    // add saved regions to store.
    for (var i = 0; i < scene.regions.length; i++) {
      var region = scene.regions[i];
      if(region.points === undefined) {
        regionStore.push(region, 'regionRectangle');
      } else {
        regionStore.push(region, 'regionPolygon');
      }
    };

  }

  /**
   * save current configuration
   */
  function shutdown() {
    console.log('\nShutdown server. Save regions.. please hold');
    scene.toFile(conf, regionStore, function(){
        process.exit();
        });
  }
  process.on('SIGINT', shutdown);
}

/**
 * Create server and sockets
 */
function startServer(userStore, actionStore, regionStore, gestureStore, kinectStore, scene, callback) {

  // Create server
  server = http.createServer(function(req, res){
      new Request(req, res, userStore, actionStore, regionStore, kinectStore, DEBUG);
      });

  // listen to 
  server.listen(scene.port);

  // Define socket.io connection
  var socket = new Socket(
      server, userStore, regionStore, actionStore, gestureStore, kinectStore, scene
      );

  callback(actionStore);
}
