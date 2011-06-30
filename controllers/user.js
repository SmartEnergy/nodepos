var stores = require('../data/users'),
    util = require('util');

function configureApp(app) {

  var userStore = app.users = new stores.Users();
  
  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/users', index);

  app.post('/users/new', requireJson, create);

  /**
   * check if request is application/json
   */
  function requireJson(req, res, next) {
    if(req.is('*/json')) {
      next();
    } else {
      var msg = JSON.stringify({ success: false, msg: 'Use application/json' });
      res.writeHead(406, { "Content-Type": contentType,
                           "Content-Length": msg.length });
      res.write(msg);
      res.end();
    }
  }

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

    var user = req.body;

    if(userStore.isValid(user)) {
      userStore.push(user);
      msg = JSON.stringify({ success: true });
    } else {
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
