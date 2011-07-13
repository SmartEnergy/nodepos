/**
 * @fileoverview Curl with dss..
 * @author andree andreek@tzi.de
 */
var Connection = require("../build/default/dsscurl.node").Connection,
    util    = require("util"),
    url     = require("url"),
    Action  = require('../models/action').Action;
    events  = require('events');

var HOST = 'https://smartenergy.uni-bremen.de:81';
var USERNAME = 'json';
var PASSWORD = 'c4a30c1db46b568eb87f3631360a74fe';

var dssUser = 'dssadmin';
var dssPw = 'dssadmin';

var cookie;
/**
 * read actions (scenes) from dss
 */
Connection.prototype.readActions = function(store, callback) {
  //var url = HOST+'/json/property/query?query=%2Fapartment%2Fzones%2F*(ZoneID%2Cscenes)%2Fgroups%2F*(group)%2Fscenes%2F*(scene%2Cname)'

  //var actions = JSON.parse(this.request(url, cookie, USERNAME, PASSWORD));
  //if(actions.ok === true) {
  //  callback(actions.result);
  //}

  var self = this;

  var scenes = [];

  for(var i in scenes) {
    var scene = scenes[i];
    
    var action = new Action('dss_'+scene.number, dssHandler);
    
    var dssHandler = function(value) {
      this.login(function(result) {
        if(result === true) {
          self.callScene(scene.zoneId, scene.number);
        }
      });
    };

    store.push(action);
  }

}

/**
 * executes a scene on dss
 */ 
Connection.prototype.callScene = function(zoneId, sceneNumber, callback) {
  var url = HOST+'/json/zone/callScene?id=' 
            +zoneId+'&sceneNumber='+sceneNumber;
  var exec = JSON.parse(this.request(url, cookie, USERNAME, PASSWORD));
  if(exec.ok === true && callback) callback(exec);
}

/**
 * Authenticate with dss
 */
Connection.prototype.login = function(callback) {
  var url = HOST+'/json/system/login?user=' 
            +dssUser+'&password='+dssPw;
  console.log(this.request(url, ''));
  var login = JSON.parse(this.request(url, '', USERNAME, PASSWORD));
  if(login.ok === true) {
    cookie = 'token='+login.result.token+'; path=/';
    if(callback) callback(true);
  } else {
    if(callback) callback(false);
  }
}
exports.Connection = Connection;

