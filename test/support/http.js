/**
 * Name   : http.js
 * Author : Andree Klattenhof <andreek@tzi.de>
 * Desc   : HTTP Request abstraction for
 *          simple methods to use in test
 *          functions
 */
var http = require('http'),
    EventEmitter = require('events').EventEmitter,
    assert = require('assert');

/**
 * Initial function, starting server
 */
function Request(app) {
  var self = this;
  
  this.app = app;
  this.data = '';

  // start server
  if(!this.server) {
    this.server = this.app;
    this.server.listen(0, function() {
      self.addr = self.server.address();
      self.listening = true;
    });
  }

  return this;

}

Request.prototype.__proto__ = EventEmitter.prototype;

/**
 * Prepare request
 */
Request.prototype.request =  function(method, path) {
  this.method = method;
  this.path = path;
  return this;
}

/**
 * write data
 */
Request.prototype.write = function(data) {
  this.data = data;
  return this;
};

/**
 * except body / statuscode
 */
Request.prototype.except = function(body, fn) {
  var self = this;
  this.end(function(res) {
    if('number' === typeof body) {
      assert.equal(res.statusCode, body);
    } else {
      assert.equal(res.body, body);
    }
    fn();
  });
}

Request.prototype.end = function(fn) {
  var self = this;
  if(this.listening) {
    var req = http.request({
      host: this.addr.address,
      port: this.addr.port,
      path: this.path,
      method: this.method,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    req.write(this.data);

    req.on('response', function(res) {
      var buf = '';
      res.on('data', function(chunk) { buf += chunk });
      res.on('end', function() {
        res.body = buf;
        fn(res);
      });
    });
    
    req.end();
  } else {
    this.server.on('listening', function() {
      self.end(fn);
    });
  }

  return this;

}
module.exports = Request;
