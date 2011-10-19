var http    = require('http'),
    util    = require('util'),
    BaallAction  = require('../models/action').BaallAction;

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
  'microwaveBoard', 
  'kitchenet',
  'cupboard',
  'basin' 
]

/**
 * Create baall actions
 */
var Baall = function (actionStore) {

  for(var i in devices) {
    var device = devices[i];
    
    var action = new BaallAction(device);
    
    actionStore.push(action);
  }
}
exports.Baall = Baall;
