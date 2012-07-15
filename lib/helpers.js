/**
 * Name         : helpers.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Some functions like config parser, verify content-type
 *                for each request or notify wlan server.
 */

/**
 * check if request is application/json
 */
function requireJson(req, res, next) {
  var contentType = 'application/json';
  if(req.headers['content-type'] === contentType) {
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
 * Response error to json
 */
function responseError (res, code, msg) {
  var result = msg;
  res.writeHead(
    code,
    { "Content-Type": "application/json"
    , "Content-Length": result.length
    }
  );
  res.write(result);
  res.end();
}
exports.responseError = responseError;

/**
 * parse config file and configuring server
 */
var fs = require('fs');
function readConfig (conf, app, exp, persist) {
  var results = fs.readFileSync(conf, encoding='utf8'); 
  var conf = JSON.parse(results);
  
  /**
   * Configure port 
   */
  if(conf.port) {
    app.set('port', conf.port);
  } else {
    // default port
    app.set('port', 8000);
  }

  /**
   * Configure database
   */
  if(conf.persist === true) {
  
    // persisting
    persist.configurePersist(app);

  }

  /**
   * Configure path to KinectController
   */
  fs.stat(conf.kinectpath, function(err, stat) {
    if(err) {
      app.logger.warn('Could not select path to KinectController');
    } else if(stat) {
      app.set('kinectpath', conf.kinectpath);
    }
  });
  
  /**
   * Configure path to webgui
   */
  fs.stat(conf.viewpath, function(err, stat) {
    if(err) {
      app.logger.warn('Could not select viewpath');
    } else if(stat) {
      app.logger.info('Defining gui path..');
      app.use(exp.static(conf.viewpath));
    }
  });

  /**
   * Configure wlanNotify
   */
  if(conf.wlanNotify == true && conf.wlanInterv > 0) { 
    startWlanNotify(
        app,
        conf.wlanHost,
        conf.wlanPort,
        conf.wlanPath,
        conf.wlanInterv
    );  
  }
}
exports.readConfig = readConfig;

/**
 * Sending every second all 
 * user objects to WLAN-Server
 */
var jsonxml = require('jsontoxml');
var http = require('http');
function startWlanNotify (app, host, port, path, ms) {
  
  setInterval(function() {
    var users = app.users.toArray(function(err, users) {
      if(err) {
        app.logger.error("Cannot read users");  
      } else {
        
        for(var i in users) {
          var user = users[i];

          var xmlUser = {
            id: user.id,
            position: user.position,
            time: user.time,
          }
          // required property for wlan server
          xmlUser.position.sectionId = 3;

          // convert object to xml
          var xml_str = jsonxml.obj_to_xml(xmlUser);

          // TODO SEND POST REQ
          var req_opt = {
            host: host,
            port: port,
            path: path,
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml',
              'Content-Length': xml_str.length
            }
          }

          var req = http.request(req_opt, function(res) {
          });

          req.write(xml_str);
          req.end();
        }

      }
    }); 
  }, ms);

}
exports.startWlanNotify = startWlanNotify;

/**
 * Start a process as a child
 */
exports.startProc = function(cmd, callback) {
  var spawn = require('child_process').spawn;

  var child = spawn(cmd);
  var stderr = "";
  child.stderr.on('data', function (data) {
      stderr += data;
  });

  child.on('exit', function(code) {
    if(code == 0) {
      callback(null, child);
    } else {
      var err = new Error("Error: "+stderr);
      callback(err, child);
    }
  });

  return child;
}
