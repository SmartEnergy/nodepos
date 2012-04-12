#!/usr/bin/env node
/**
 * Name         : send_user.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : Script that simulates sending users to nodePos
 *                with data from a csv-file.
 */
var fs = require('fs'),
    http = require('http');

var HOST = 'localhost';
var PORT = 8000;
var CSVFILE = 'scripts/kinect_users.csv';

/**
 * send users to server
 */
function sendUsers (users) {

  var options = {
    host: HOST,
    port: PORT,
    path: '/users/new',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var i = 0;

  // sending every 30ms one user
  setInterval(function() {
    if(i < users.length) {
      var user = users[i];
      user.time = Number(new Date())/1000;
      user.gesture = '';

      var reqStr = JSON.stringify({ users: [user] });

      var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });

      req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
      });

      req.write(reqStr);
      req.end();

      i++;    
      console.log('SEND USER');
    } else {
      process.exit();
    }
  }, 30);
};

/**
 * parse users from csv file
 */
function parseUsers(err, data) {
  
  if(err) {
    console.log('Could not read csvfile: ' + err);
    process.exit();
  }

  var users = [];

  // Split data into rows
  var rows = data.replace('\r', '').split('\n');

  // Create user object for every row
  for(var i = 0; i < rows.length; i++) {

    // Split row into columns
    var columns = rows[i].split(',');

    // extract data
    var id = columns[0];
    var x = 2230 + parseInt(columns[1]);
    var y = 580 + parseInt(columns[3]);

    var user = {
      id: id,
      position: {
        x: x,
        y: y,
        z: 0
      },
      time: 0
    }

    users.push(user);
  }

  sendUsers(users);
};

// read csv file and send users to server
fs.readFile(CSVFILE, encoding='utf8', parseUsers);
