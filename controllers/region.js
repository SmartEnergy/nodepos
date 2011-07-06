var stores = require('../data/regions'),
    util = require('util');

function configureApp(app) {

  var regionStore = app.regions = new stores.RegionStore();
  
  // response content type
  var contentType = 'application/json';

  // Routes
  app.get('/regions', index);

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

};
exports.configureApp = configureApp;
