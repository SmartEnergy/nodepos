var stores = require('../data/stores'),
    util = require('util');

function configureApp(app) {
  
  var kinectStore = app.kinects = new stores.Store('kinects', 'id');

  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/kinects', index);

  app.post('/kinects/new', requireJson, create);

  app.get('/kinects/:id/delete', requireJson, del);

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
   * Return all connected kinects
   */
  function index(req, res) {
    var callback = function(err, result) {
      res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": result.length});
      res.write(result);
      res.end();
    };

    app.kinects.toJson(callback);
  };

  /**
   * Post new kinect as json
   */
  function create(req, res) {
    var msg = null;
    var status = 200;

    var kinect = req.body;

    // TODO validate kinect object
    if(kinect.angle === 0) {
      kinectStore.push(kinect);
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

  /**
   * Delete kinect 
   */
  function del(req, res) {
    var msg = null;
    var status = 200;
    var id = req.params.id;

    var callback = function(err, method, id) {
      if(err) {
        msg = JSON.stringify({ success: false, msg: "Kinect was not found" });
        status = 404;
      } else {
        msg = JSON.stringify({ success: true });
      }
      res.writeHead(status, { "Content-Type": contentType
                       , "Content-Length": msg.length});
      res.write(msg);
      res.end();
    };

    // remove kinect 
    kinectStore.remove(id, callback);
  };
};
exports.configureApp = configureApp;
