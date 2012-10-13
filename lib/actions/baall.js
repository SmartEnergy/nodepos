var redis = require('redis').createClient(),
    Action  = require('../models/action').Action,
    BaallAction  = require('../models/action').BaallAction;

// all turn on/off baall devices
var devices = [
  { 
    id: '1/0/0',
    name: 'livingJack1',
    type: '1.001'
  },
  {
    id: '1/0/1',
    name: 'livingJack2',
    type: '1.001'
  },
  {
    id: '0/2/0',
    name: 'livingLight1',
    type: '1.001'
  },
  {
    id: '0/2/1',
    name: 'livingLight2',
    type: '1.001'
  },
  {
    id: '0/0/2',
    name: 'kitchenJack',
    type: '1.001'
  },
  {
    id: '0/0/1',
    name: 'kitchenLight',
    type: '1.001'
  },
  {
    id: '1/1/0',
    name: 'bedroomJack1',
    type: '1.001'
  },
  {
    id: '1/1/1',
    name: 'bedroomJack2',
    type: '1.001'
  },
  {
    id: '0/1/0',
    name: 'bedroomLight1',
    type: '1.001'
  },
  {
    id: '0/1/1',
    name: 'bedroomLight2',
    type: '1.001'
  },
  {
    id: '0/4/0',
    name: 'bathroomLight',
    type: '1.001'
  },
  {
    id: '0/4/1',
    name: 'corridorLight',
    type: '1.001'
  },
  {
    id: '3/1/0',
    name: 'upperLeftDoor',
    type: '1.001',
    rule: {
      wait: 7,
      queue: true
    }
  },
  {
    id: '3/1/1',
    name: 'upperRightDoor',
    type: '1.001',
    rule: {
      wait: 7,
      queue: true
    }
  },
  {
    id: '3/0/0',
    name: 'lowerLeftDoor',
    type: '1.001',
    rule: {
      wait: 7,
      queue: true
    }
  },
  {
    id: '3/0/1',
    name: 'lowerRightDoor',
    type: '1.001',
    rule: {
      wait: 7,
      queue: true
    }
  },
  {
    id: '3/2/0',
    name: 'bathroomDoor',
    type: '1.001',
    rule: {
      wait: 7,
      queue: true
    }
  },
  {
    id: '2/1/6',
    name: 'cupboard',
    type: '5.xxx'
  },
  {
    id: '2/1/5',
    name: 'microwaveBoard',
    type: '5.xxx'
  },
  {
    id: '2/1/4',
    name: 'kitchenet',
    type: '5.xxx'
  },
  {
    id: '0/2/4',
    name: 'livingLight3',
    type: '5.xxx'
  },
  {
    id: '2/2/5',
    name: 'bedroomRightBedFoot',
    type: '5.xxx'
  },
  {
    id: '2/2/1',
    name: 'bedroomRightBedHead',
    type: '5.xxx'
  },
  {
    id: '2/0/2',
    name: 'basin',
    type: '5.xxx'
  },
  {
    id: '2/0/5',
    name: 'bathroomToilet',
    type: '5.xxx'
  }
]

/**
 * Create baall actions
 */
var Baall = function (actionStore, app) {

  for(var i in devices) {
    var device = devices[i];
    
    var action = new BaallAction(device, app.knx);
    actionStore.push(action);

    app.knx.importDevice(device, function(err) {
      if(err) console.log(err);
    });
    
  }

  var i = -1;
  // Get statuses for all devices
  var intervalId = setInterval(function() {
    i++;
    if(i < devices.length) {
      app.knx.read(devices[i].id, function() {});
    } else {
      clearInterval(intervalId);
    }
  }, 1200);

}
exports.Baall = Baall;
