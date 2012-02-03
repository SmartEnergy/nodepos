var requireJson = require('../helpers').requireJson,
    util = require('util');

/**
 * ActionController
 *
 *  [GET] /actions
 */
function configureApp (app) {

  app.get('/actions', function(req, res) {
    var callback = function(err, result) {
      res.writeHead(200, { "Content-Type": 'application/json'
                       , "Content-Length": result.length});
      res.write(result);
      res.end();
    };

    app.actions.toJson(callback);
  });

};
exports.configureApp = configureApp;
