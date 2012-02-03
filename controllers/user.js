var stores = require('../data/users'),
    requireJson = require('../helpers').requireJson;
    util = require('util');

function configureApp(app) {

  var userStore = app.users = new stores.Users();
  
  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/users', index);

  app.post('/users', requireJson, create);

  /**
   * Return all users
   */
  function index(req, res) {
    var callback = function(err, result) {
      res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": result.length});
      res.write(result);
      res.end();
    };

    app.users.toJson(callback);
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
