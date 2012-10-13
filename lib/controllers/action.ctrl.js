var requireJson = require('../helpers').requireJson;

/**
 * ActionController
 *
 *  [GET] /actions
 */
function configureApp (app) {

  app.get('/actions', function(req, res) {


    var callback = function(err, result) {
      if(err != null) {
        var msg = "[GET /actions] Could not read actions from store ";
        app.responseError(res, 500, msg); 
        app.logger.error(msg+err);
      } else {
        var result = JSON.stringify(result);
        res.writeHead(200, { "Content-Type": 'application/json'
                         , "Content-Length": result.length});
        res.write(result);
        res.end();
      }
    };

    app.knx.getDevices(callback);
  });

};
exports.configureApp = configureApp;
