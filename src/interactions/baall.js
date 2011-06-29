/**
 * @fileoverview This server is used to recognized if users
 *               are in a region. You can define some actions
 *               to execute scenes on dss or  baall if users
 *               entered a region for example.
 * @author andree andreek@tzi.de
 * @version 0.0.1
 */
var http    = require('http'),
    util    = require('util'),
    data    = require('../data');

// all turn on/off baall devices
var devices = [
  'livingJack1',
  'livingJack2',
  'livingLight1',
  'livingLight2',
  'upperLeftDoor',
  'upperRightDoor',
  'kitchenJack',
  'kitchenLight',
  'kitchenFridgeBoard1',
  'kitchenFridgeBoard2',
  'kitchenFridgeBoard3',
  'kitchenFridgeBoard4',
  'bedroomJack1',
  'bedroomJack2',
  'bedroomLight1',
  'bedroomLight2',
  'lowerLeftDoor',
  'lowerRightDoor',
  'bathroomLight',
  'bathroomDoor',
  'corridorLight', 
]

/**
 * Create baall actions
 */
var Baall = function (actionStore) {


  for(var i in devices) {
    var device = devices[i];
    // turn on
    var actionOn = new data.Action(device+'_on', function() {
      ballrequest(this.name.replace('_on', ''), '1');
    });

    // turn off
    var actionOff = new data.Action(device+'_off', function() {
      ballrequest(this.name.replace('_off', ''), '0');
    });

    actionStore.push(actionOn);
    actionStore.push(actionOff);
  }
}
exports.Baall = Baall;


function ballrequest(name, value) {
  // execute update..
  var client = http.createClient(80, 'baall-server.informatik.uni-bremen.de');

  var headers = {
    'Host': 'baall-server.informatik.uni-bremen.de',
    'Content-Type': 'text/plain',
    'Content-Length': 0
  };
  var req = client.request('GET', '/update.php?value='+value+'&name='+name, headers);
  req.write('');
  req.end();
} 

