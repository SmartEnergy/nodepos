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
        
              var result_user = {
                  id: user.id
                , time: user.time
                , positions: [ 
                {
                    x: user.position.x
                  , y: user.position.y
                  , z: user.position.z
                  // Attributes for wlan-server/iBaall-app
                  , sectionId: 3
                  , significance: 0
                }
                ]
              };

              results.push(result_user);
              
              cb(null);
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
    var msg = null;
    var status = 200;
    
    var users = req.body.users;
    var isValid = true;

    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if(userStore.isValid(user) === false) {
        msg = JSON.stringify({ success: false });
        isValid = false;
        status = 400;
      }
    };

    if(isValid === true) {

      msg = JSON.stringify({ success: true });

      users.forEach(function(val, index, array) {
        userStore.push(val);
      });
    }

    res.writeHead(status, { "Content-Type": contentType
                     , "Content-Length": msg.length});
    res.write(msg);
    res.end();
  };
};
exports.configureApp = configureApp;
