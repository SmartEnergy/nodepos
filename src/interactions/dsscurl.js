/**
 * @fileoverview Curl with dss..
 * @author andree andreek@tzi.de
 */
var binding = require("../../build/default/dsscurl.node"),
    util    = require("util"),
    url     = require("url"),
    events  = require('events');

var HOST = 'https://smartenergy.uni-bremen.de:81';
var Connection = binding.Connection;
var cookie;
/**
 * read actions (scenes) from dss
 */
Connection.prototype.readActions = function(callback) {
  var url = HOST+'/json/property/query?query=%2Fapartment%2Fzones%2F*(ZoneID%2Cscenes)%2Fgroups%2F*(group)%2Fscenes%2F*(scene%2Cname)'

  var actions = JSON.parse(this.request(url, cookie));
  if(actions.ok === true) {
    callback(actions.result);
  }
}

/**
 * executes a scene on dss
 */ 
Connection.prototype.callScene = function(zoneId, sceneNumber, callback) {
  var url = HOST+'/json/zone/callScene?id=' 
            +zoneId+'&sceneNumber='+sceneNumber;
  var exec = JSON.parse(this.request(url, cookie));
  if(exec.ok === true && callback) callback(exec);
}

/**
 * Authenticate with dss
 */
Connection.prototype.login = function(user, pw, callback) {
  var url = HOST+'/json/system/login?user=' 
            +user+'&password='+pw;
  console.log(this.request(url, ''));
  var login = JSON.parse(this.request(url, ''));
  if(login.ok === true) {
    cookie = 'token='+login.result.token+'; path=/';
    if(callback) callback(true);
  } else {
    if(callback) callback(false);
  }
}
exports.Connection = Connection;

