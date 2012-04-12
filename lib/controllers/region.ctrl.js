var stores = require('../data/regions.store'),
    requireJson = require('../helpers').requireJson;

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
      if(!err) {
        res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": result.length});
        res.write(result);
        res.end();
      } else {
        var msg = "[GET /regions] Could not read regions from store ";
        app.responseError(res, 500, msg); 
        app.logger.error(msg+err);
      }
    };

    app.regions.toJson(callback);
  };

  /**
   *  create new region of type polygon
   *  and rectangle
   */
  function create(req, res) {
    var newRegion = req.body;
    var isValid = app.regions.isValid(newRegion);

    if(isValid) {
      app.regions.push(newRegion);
      var msg = JSON.stringify({ success: true });
      res.writeHead(200, { "Content-Type": contentType
                       , "Content-Length": msg.length});
      res.write(msg);
      res.end();
    } else {
      var msg = JSON.stringify({ success: false, msg: "This is not a valid region" });
      app.responseError(res, 400, "Could not accept request"); 
    }
    
  }

  /**
   * delete an existing region 
   */
  function del (req, res) {
    var id = req.params.id;

    var callback = function(err, method, id) {
      if(err) {
        var msg = JSON.stringify({ success: false, msg: "Region was not found" });
        app.responseError(res, 404, msg);
        app.logger.error("[DEL /region/"+id+"] Could not remove region "+err)
      } else {
        var msg = JSON.stringify({ success: true });
        res.writeHead(200, { "Content-Type": contentType
                         , "Content-Length": msg.length});
        res.write(msg);
        res.end();
      }
    };

    // remove region
    regionStore.remove(id, callback);
  }
};
exports.configureApp = configureApp;
