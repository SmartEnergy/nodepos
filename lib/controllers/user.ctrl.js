var stores = require('../data/user.store'),
    async = require('async'),
    requireJson = require('../helpers').requireJson;

function configureApp(app) {

  var userStore = app.users = new stores.Users();
  
  /**
   * On new/update user check regions
   * and commands.
   */
  function checkRegions(key, user) {
    app.regions.checkUser(user, execCommands);

    function execCommands(err) {
      if(err === false) {
        app.commands.execAll(user);
      } else {
        app.logger.error('Failed to check regions for user '+user.id );
      }
    }
  };
  
  app.users.on('new', checkRegions);
  app.users.on('update', checkRegions);
  app.users.on('removed', function(key) {
    app.regions.checkUser({
      id: key,
      position: { x:0, y:0, z:0 },
      joints: []
    });
  });
  
  app.users.on('new', app.powerless.detect);
  app.users.on('update', app.powerless.detect);

  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/users', index);

  app.post('/users/new', requireJson, create);

  /**
   * Return all users
   */
  function index(req, res) {
    var callback = function(err, users) {
     
      if(err) {
        var jsonstr = 'Could not load users';
        res.writeHead(500, { "Content-Type": contentType
                         , "Content-Length": jsonstr.length});
        res.write(jsonstr);
        res.end();
      
      } else {
        var results = [];
        async.forEach(
            users
          , function(user, cb) {
              if(user.id) {        
                var result_user = {
                    id: user.id
                  , time: user.time
                  , positions: [ 
                  {
                      x: user.position.x*10
                    , y: user.position.y*10
                    , z: user.position.z*10
                    // Attributes for wlan-server/iBaall-app
                    , sectionId: 3
                    , significance: 0
                  }
                  ],
                    joints: user.joints
                };

                results.push(result_user);
                 
                cb(null);
              }
            }
          , function(err) {
              if(err) {
                var jsonstr = 'Could not load users';
                res.writeHead(500, { "Content-Type": contentType
                                 , "Content-Length": jsonstr.length});
                res.write(jsonstr);
                res.end();
              } else {
                var jsonstr = JSON.stringify({ size: results.length, users: results });
                res.writeHead(200, { "Content-Type": contentType
                                 , "Content-Length": jsonstr.length});
                res.write(jsonstr);
                res.end();
              }
            }        
        );
      }
    };

    app.users.toArray(callback);
  };

  /**
   * Post new user as json
   */
  function create(req, res) {

    req.on('error', function(e) {
      console.log('ERROR WITH REQUEST: '+e);
    });

    var msg = null;
    var status = 200;
    var isValid = true;
    var users = req.body.users;
    if(users && users.length > 0) {
      

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(userStore.isValid(user) === false) {
          isValid = false;
          status = 400;
        }
      };

      if(isValid === true) {

        msg = JSON.stringify({ success: true });

        users.forEach(function(val, index, array) {
          userStore.push(val);
        });
      } else {
        
        msg = JSON.stringify({ success: false });
      
      }
    } else {
      isValid = false;
      msg = JSON.stringify({ success: false });
      status = 400;
    }

    res.writeHead(status, { "Content-Type": contentType
                     , "Content-Length": msg.length});
    res.write(msg);
    res.end();
  };
};
exports.configureApp = configureApp;
