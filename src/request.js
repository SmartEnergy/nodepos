/**
 * @fileoverview Callback for http requests.
 * @author andree andreek@tzi.de
 */
var PosHandler    = require('./handlers').PosHandler,
    RegionHandler = require('./handlers').RegionHandler,
    SceneHandler  = require('./handlers').SceneHandler,
    KinectHandler  = require('./handlers').KinectHandler,
    url           = require('url');

var INTERNAL_ERROR = "Internal error\n";
var NOT_FOUND = "Not found.\n";

/**
 * http request callback.
 */
function Request(req, res, userStore, actionStore, regionStore, kinectStore, DEBUG) {
  var self = this;	
  
  // if not in debug fetch exceptions
  if(DEBUG === false) {
    // all errors call this listener
    process.on('uncaughtException', function(err) { 
      res.writeHead(500,  { "Content-Type": "text/plain"
                          , "Content-Length": INTERNAL_ERROR.length
                          });
      res.write(INTERNAL_ERROR);
      res.end();
    });
  }

  var uri = url.parse(req.url).pathname;
  switch(uri) {
    case '/users':
      userStore.toJson(storeToJsonCb);
      break;	
    case '/users/new':
      new PosHandler(req, res, userStore);
      break;
    case '/regions':
      regionStore.toJson(storeToJsonCb);
      break;	
    case '/regions/new':
      new RegionHandler(req, res, regionStore);
      break;
    case '/actions':
      actionStore.toJson(storeToJsonCb);
      break;
    case '/scenes':
      new SceneHandler(req, res, uri);
      break;
    case '/scenes/save':
      new SceneHandler(req, res, uri);
      break;
    case '/kinects':
      kinectStore.toJson(storeToJsonCb);
      break;
    case '/kinects/new':
      new KinectHandler(req, res, kinectStore);
      break;
    default:
      do404(res);
      break;
  }
  // To json callback
  function storeToJsonCb(err, result) {
    res.writeHead(200, { "Content-Type": "application/json"
                       , "Content-Length": result.length});
    res.write(result);
    res.end();
  }

  // response 404 error
  function do404(res) {
    res.writeHead(404, { "Content-Type": "text/plain"
                     , "Content-Length": NOT_FOUND.length});
    res.write(NOT_FOUND);
    res.end();
  }
};
exports.Request = Request;
