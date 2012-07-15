/**
 * Name         : dstrom.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : DigitalStrom Api
 */
var https = require('https');

/**
 * verify response
 */
function checkResponse(res, callback) {
  res.on('data', function(data) {
    var data = JSON.parse(data.toString());
    if(data.ok === true) {
      callback(true);
    } 
    callback(false, data.message);
  });
}

/**
 * Handle https requests to
 * digitalstrom server
 */
function DigitalStrom() {

  // TODO move to conf.json
  this.host = 'smartenergy.uni-bremen.de';
  this.port = 8080;
  
  this.dsUser = 'dssadmin';
  this.dsPw = 'dssadmin';

  this.token = null;

  this.devices = [];

}
exports.DigitalStrom = DigitalStrom;

/**
 * get request options
 */
DigitalStrom.prototype.getOptions = function(method, path) {
  var options = {
    host: this.host,
    port: this.port,
    path: path,
    method: method
  };

  // set cookie if token is defined
  if(this.token != null) {
    options.headers = {
      Cookie: this.token
    }
  }
  return options; 
}

DigitalStrom.prototype.request = function(url, callback) {
  var req = https.request(this.getOptions('GET', url), function(res) {
    checkResponse(res, function(result, msg) {
      if(result === false) console.log(msg);

      if(callback) callback(result);
    });
  });
  
  req.end();

  req.on('error', function(e) {
      console.error(e);
  });
}

/**
 * toggle device
 */
DigitalStrom.prototype.turnDevice = function(device, val, callback) {
  var url = '/json/device/turn'+val+'?dsid='+device.id;
  this.request(url, callback);
}

/**
 * turn device off
 */
DigitalStrom.prototype.turnOff = function(device, callback) {
  this.turnDevice(device, 'Off', callback);
}

/**
 * turn device on
 */
DigitalStrom.prototype.turnOn = function(device, callback) {
  this.turnDevice(device, 'On', callback);
}
/**
 * call scene
 */
DigitalStrom.prototype.callScene = function(id, number, callback) {
  var url = '/json/zone/callScene=?id='+id+'&sceneNumber='+number;
  this.request(url, callback);
}

/**
 * login to ds-server
 */
DigitalStrom.prototype.login = function(callback) {
  var url = '/json/system/login?user=' 
            +this.dsUser+'&password='+this.dsPw;

  var self = this;
  function saveToken(data) {
    var data = JSON.parse(data.toString());
    if(data.ok === true) {
      self.token = data.result.token;
    } else {
      self.token = null;
      console.log('Could not authenticate');
    }
    if(callback) callback();
  }

  var req = https.request(this.getOptions('GET', url), function(res) {
    res.on('data', saveToken);
  });
  
  req.end();

  req.on('error', function(e) {
      console.error(e);
  });
}
