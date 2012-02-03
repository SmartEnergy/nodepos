var stores = require('../data/regions'),
    requireJson = require('../helpers').requireJson,
    util = require('util');

/**
 * RegionController
 *
 * Configure routes and handles CRUD requests
 * for regions
 *
 *  [GET]   /regions
 *  [POST]  /regions/new 
 *  [GET]   /regions/:ID/delete
 *
 */
function configureApp(app) {

  var regionStore = app.regions = new stores.RegionStore();
  
  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/regions', index);
  
  app.post('/regions/new', requireJson, create);
  
  app.get('/regions/:id/delete', requireJson, del);

  /**
   * Return all regions
   */
  function index(req, res) {
    var callback = function(err, result) {
      res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": result.length});
      res.write(result);
      res.end();
    };

    app.regions.toJson(callback);
  };

  /**
   *  create new region of type polygon
   *  and rectangle
   */
  function create(req, res) {
    var msg = "";
    var status = 200;

    var newRegion = req.body;
    var isValid = app.regions.isValid(newRegion);

    if(isValid) {
      app.regions.push(newRegion);
      msg = JSON.stringify({ success: true });
    } else {
        msg = JSON.stringify({ success: false, msg: "This is not a valid region" });
      
    }
    
    res.writeHead(status, { "Content-Type": contentType
                     , "Content-Length": msg.length});
    res.write(msg);
    res.end();
  }

  /**
   * delete an existing region 
   */
  function del (req, res) {
    var msg = null;
    var status = 200;
    var id = req.params.id;

    var callback = function(err, method, id) {
      if(err) {
        msg = JSON.stringify({ success: false, msg: "Region was not found" });
        status = 404;
      } else {
        msg = JSON.stringify({ success: true });
      }
      res.writeHead(status, { "Content-Type": contentType
                       , "Content-Length": msg.length});
      res.write(msg);
      res.end();
    };

    // remove region
    regionStore.remove(id, callback);
  }
};
exports.configureApp = configureApp;
