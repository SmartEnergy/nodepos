var stores = require('../data/stores'),
    requireJson = require('../helpers').requireJson;
    util = require('util');

function configureApp(app) {
  
  var kinectStore = app.kinects = new stores.Store('kinects', 'id');

  // validate kinect 
  kinectStore.isValid = function(kinect) {
    if( undefined === kinect || undefined === kinect.x || undefined === kinect.y || undefined === kinect.angle) {
      return false;
    } 
    return true;
  };
  
  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/kinects', index);

  app.post('/kinects/new', requireJson, create);

  app.get('/kinects/:id/delete', requireJson, del);

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

    var kinects = req.body.kinects;
    var isValid = true;


    for (var i = 0; i < kinects.length; i++) {
      var kinect = kinects[i];
      if(kinectStore.isValid(kinect) === false) {
        msg = JSON.stringify({ success: false });
        isValid = false;
        status = 400;
      }
    };

    if(isValid === true) {

      msg = JSON.stringify({ success: true });

      kinects.forEach(function(val, index, array) {
        kinectStore.push(val);
      });
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
