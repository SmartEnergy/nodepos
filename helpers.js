/**
 * check if request is application/json
 */
function requireJson(req, res, next) {
  var contentType = 'application/json';
  if(req.is('*/json')) {
    next();
  } else {
    var msg = JSON.stringify({ success: false, msg: 'Use application/json' });
    res.writeHead(406, { "Content-Type": contentType,
                         "Content-Length": msg.length });
    res.write(msg);
    res.end();
  }
};
exports.requireJson = requireJson;

/**
 * parse config file and configuring server
 */
var fs = require('fs');
function readConfig (conf, app, exp, persist) {

  fs.readFile(conf, encoding='utf8', function(err, results){
    if(err === null) {
      var conf = JSON.parse(results);

      /**
       * Configure database
       */
      if(conf.persist === true) {
      
        // persisting
        persist.configurePersist(app);

      }
      
      /**
       * Configure path to webgui
       */
      fs.stat(conf.viewpath, function(err, stat) {
        if(err) {
          console.log('Error on selecting viewpath');
        } else if(stat) {
          console.log('Defining gui path..');
          app.use(exp.static(conf.viewpath));
        } else {
          console.log('ladia');
        }
      });
    }

  });
}
exports.readConfig = readConfig;

/**
 * event listener for new users in regions
 */
function checkRegions(key, user) {

  app.regions.checkUser(user, execCommands);

  function execCommands(err) {
    if(err === false) app.commands.execAll(user);
  }
};
exports.checkRegions = checkRegions;
