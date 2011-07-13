var http    = require('http'),
    util    = require('util'),
    Action  = require('../models/action').Action;

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
  'kitchenette',
  'kitchenLeftCupboard',
  'kitchenRightCupboard',
  'bedroomRightBedHead',
  'bedroomRightBedFoot',
  'bathroomWashBasin', 
]

/**
 * Create baall actions
 */
var Baall = function (actionStore) {

  for(var i in devices) {
    var device = devices[i];
    
    var action = new Action(device, baallHandler);
    
    var baallHandler = function(value) {
      if(value === 'on') {
        ballrequest(this.name, '1');  
      } 
      else if(value === 'off') {
        ballrequest(this.name, '0');  
      }
      else {
        ballrequest(this.name, value);  
      }
    };

    actionStore.push(action);
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
