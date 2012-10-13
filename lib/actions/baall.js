var redis = require('redis').createClient(),
    Action  = require('../models/action').Action,
    BaallAction  = require('../models/action').BaallAction;

// all turn on/off baall devices
var devices = [
  { 
    id: '1/0/0',
    name: 'livingJack',
    type: '1.001'
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

}
exports.Baall = Baall;
