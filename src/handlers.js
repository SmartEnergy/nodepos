/**
 * @fileoverview Handles http request for positions,
 *               regions and actions 
 * @author andree andreek@tzi.de
 */
var  async      = require('async'),
     xml2js     = require('../lib/xml2js'),
     fs     = require('../lib/json2file');

/**
 *  PositionHandler
 */
function PosHandler(req, res, users) {
  
  var that = this;

  // parse json or xml
  this.parseBody = function(req, res, body) {
  
    var parsed = [];
    var content_type = req.headers['content-type'];
    
    switch(content_type) {
      case 'application/json':
        parsed = JSON.parse(body).users;
        that.push(parsed);
        break;
      case 'text/xml':
        parsed = parseUsers(body);
        that.push(parsed);
        break;
      default:
        res.writeHead(406);
        res.end();
        break;
    }
  }       

  // push parsed users
  this.push = function(parsed) {
    async.forEach(
      parsed,
      function(item, callback){
  //      console.log('Sent item.. ' + user);
        users.push(item, function(err){
          callback();
        });
      },
      function(err) {
      }    
    );
  }
  doPostRequest(req, res, this.parseBody);
}
exports.PosHandler = PosHandler;

/**
 *  Parse regions from json
 */
function RegionHandler(req, res, regions) {

  var that = this;

  this.parseBody  = function(req, res, body) {
  
    var parsed = [];
    var content_type = req.headers['content-type'];

    if(content_type == 'application/json') {
      parsed = JSON.parse(body).regions;
      that.push(parsed);
    }
    else {
      res.writeHead(406);
      res.end();
    }
  }

  this.push   = function(parsed) {
    async.forEach(
      parsed,
      function(item, callback){
        regions.push(item, function(err){
          callback();
        });
      },
      function(err) {
        res.writeHead(200);
        res.end();
      }    
    );
  }
  
  doPostRequest(req, res, this.parseBody);
}
exports.RegionHandler = RegionHandler;

/**
 * SceneHandler
 */
function SceneHandler(req, res, uri) {

  this.save = function(req, res, body) {
    var parse = JSON.parse(body);

    fs.writeFile(parse, function() {
        res.writeHead(200);
        res.end();
    })
  }

  this.read = function(req, res) {
    fs.readFile(function(results) {
      console.log(results);
      var jsonstr = JSON.stringify(results);
      res.writeHead(200,  { "Content-Type": 'application/json'
                          , "Content-Length": jsonstr.length
                          }
      );
      res.write(jsonstr);
      res.end();
    });
  };
  
  switch(uri) {
    case '/scenes/save':
      doPostRequest(req, res, this.save);
      break;
    case '/scenes':
      this.read(req, res);
      break;
    default:
      break;
  }
}
exports.SceneHandler = SceneHandler;

/**
 * KinectHandler
 */
function KinectHandler (req, res, kinects) {

  var that = this;

  this.parseBody  = function(req, res, body) {
  
    var parsed = [];
    var content_type = req.headers['content-type'];

    if(content_type == 'application/json') {
      parsed = JSON.parse(body).kinects;
      that.push(parsed);
    }
    else {
      res.writeHead(406);
      res.end();
    }
  };

  this.push   = function(parsed) {
    async.forEach(
      parsed,
      function(item, callback){
        kinects.push(item, function(err){
          callback();
        });
      },
      function(err) {
        res.writeHead(200);
        res.end();
      }    
    );
  }

  doPostRequest(req, res, this.parseBody);
}
exports.KinectHandler = KinectHandler;

/**
 *  Parse xml input to users
 */
function parseUsers(xmlstr) {
  var users = new Array();  

  var parser = new xml2js.Parser();

  parser.saxParser.onerror = function(err) {
    err.message = "[ERROR ON PARSING XML]\n";
  };
  parser.addListener('end', function(user){
    users.push(user);
  });

  parser.parseString(xmlstr);
  return users; 
};

/**
 *  Get body from post request
 */
function doPostRequest(req, res, callback) {
  if(req.method == 'POST') {
    var body = '';

    // Event to collect data
    req.on('data', function(data){
      body += data; 
    });

    // data collected
    req.on('end', function() {
      res.writeHead(200);
      res.end();
      callback(req, res, body);
    });
  } else {
    res.writeHead(405);            
    res.end();
  };
}
