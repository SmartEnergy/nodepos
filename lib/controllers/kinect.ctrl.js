var stores = require('../data/store'),
    requireJson = require('../helpers').requireJson;

function configureApp(app) {
  
  var kinectStore = app.kinects = new stores.Store('kinects', 'id');
  var kinectChild = null;

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
  
  app.post('/kinects/start', startKinect);
  app.post('/kinects/stop',  stopKinect);
  app.get('/kinects/status',  statusKinect);

  app.get('/kinects/:id/delete', requireJson, del);

  /**
   * start kinect controller
   */
  function startKinect (req, res) {
    var result = undefined;
    
    if(!kinectChild) {
      var cmd = app.set('kinectpath');
      kinectChild = app.startProc(cmd, function(err, child) {
        if(err) {
          app.logger.error('Error occured on executing KinectController:\n'+err);
        }
        kinectChild = null;
      }); 
      // save child to be able to kill this
      result = { success: true };
    } else {
      result = { success: false, error: "KinectController is already running"};
    }

    result = JSON.stringify(result);

    res.writeHead(200, { "Content-Type": contentType
                     , "Content-Length": result.length});
    res.write(result);
    res.end();
  };

  /**
   * stop kinect controller
   */
  function stopKinect (req, res) {
    var result = null;
    if(kinectChild) {
      kinectChild.kill('SIGINT');
      result = { success: true };
    } else {
      result = { success: false, error: "KinectController not running" };
    }
    result = JSON.stringify(result);

    res.writeHead(200, { "Content-Type": contentType
                     , "Content-Length": result.length});
    res.write(result);
    res.end();
  };

  /**
   * status of kinect controller
   */
  function statusKinect(req, res) {
    var result = { isRunning: false }
    
    if(kinectChild) {
      result = { isRunning: true }
    } 
    
    result = JSON.stringify(result);

    res.writeHead(200, { "Content-Type": contentType
                     , "Content-Length": result.length});
    res.write(result);
    res.end();
  }
  
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
