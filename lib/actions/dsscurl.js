/**
 * @fileoverview Curl with dss..
 * @author andree andreek@tzi.de
 */
var Connection = require("../build/default/dsscurl.node").Connection,
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

  var scenes = [{name:'licht1', id: '3504175fe000000000004c06'},
                {name:'licht2', id: '3504175fe000000000004bca'}, 
                {name:'licht3', id: '3504175fe000000000005932'}];

  for (var i = 0; i < scenes.length; i++) {
    var scene = scenes[i];
    
    var dssOnHandler = function(value) {
      
      this.login(function(result) {
          if(result === true) {
            if(value === 'On') {
              self.turnOn(scene);
            }
            else {
              self.turnOff(scene);
            }
          }

        });
    };
    
    var action = new Action(scene.name, dssOnHandler);
    

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
 * turn on device
 */ 
Connection.prototype.turnOn = function(dsid) {
  var url = HOST+'/json/device/turnOn?dsid='+dsid;
 
  var exec = JSON.parse(this.request(url, cookie, USERNAME, PASSWORD));
  if(exec.ok === true && callback) callback(exec);
}

/**
 * turn off device
 */ 
Connection.prototype.turnOff = function(dsid) {
  var url = HOST+'/json/device/turnOff?dsid='+dsid;
 
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

