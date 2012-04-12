var stores = require('../data/store'),
    requireJson = require('../helpers').requireJson;

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
      if(err) {
        var msg = "[GET /kinects] Could not read kinects from store ";
        app.responseError(res, 500, msg); 
        app.logger.error(msg+err);
      } else {
        res.writeHead(200, { "Content-Type": contentType
                         , "Content-Length": result.length});
        res.write(result);
        res.end();
      }
    };

    app.kinects.toJson(callback);
  };

  /**
   * Post new kinect as json
   */
  function create(req, res) {
    var kinects = req.body.kinects;
    var isValid = true;

    for (var i = 0; i < kinects.length; i++) {
      var kinect = kinects[i];
      if(kinectStore.isValid(kinect) === false) {
        isValid = false;
      }
    };

    if(isValid === true) {

      kinects.forEach(function(val, index, array) {
        kinectStore.push(val);
      });

      var msg = JSON.stringify({success: true });
      res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": msg.length});
      res.write(msg);
      res.end();

    } else {
      var msg = "[POST /kinects] No valid kinect";
      app.responseError(res, 500, msg);
      app.logger.error(msg);
    }
    
  };

  /**
   * Delete kinect 
   */
  function del(req, res) {
    var id = req.params.id;

    var callback = function(err, method, id) {
      if(err) {
        msg = JSON.stringify({ success: false, msg: "Kinect was not found" });
        app.responseError(res, 500, msg);
        app.logger.error("[DEL /kinect/"+id+"] Error: "+err);
      } else {
        var msg = JSON.stringify({ success: true });
        res.writeHead(200, { "Content-Type": contentType
                         , "Content-Length": msg.length});
        res.write(msg);
        res.end();
      }
    };

    // remove kinect 
    kinectStore.remove(id, callback);
  };
};
exports.configureApp = configureApp;
