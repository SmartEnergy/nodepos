var eibd = require('eibd'),
    async = require('async'),
    events = require('events'),
    redis = require('redis'),
    sys = require('sys');

/**
 * writing value to device
 */
function write(id, value, callback) {
  var self = this;
  self.checkWritable(id, function(err, result) {
    if(result === false) {
      var socket = (new eibd());
      socket.socketRemote(
        self.opts,
        function() {
          var address = socket.str2addr(id);
          socket.openTGroup(address, 1, function(err) {
            if(err) {
              if(callback) { 
                if(callback) callback(err);
              }
            } else {
              var data = new Array(2);
              data[0] = 0;
              data[1] = 0x80 | value;
              if(value > 1) {
                data[1] = 0x80;
                data.push(0xff&value);
              }

              // check if wait rule is defined
              self.redis.get('rules:wait:'+id, function(err, time) {
                if(err) { 
                  if(callback) { 
                    if(callback) callback(err);
                  }
                }
                if(time) {
                    self.redis.set('active:'+id, 1, function(err) {
                    if(err) { 
                      if(callback) callback(err);
                    }
                    self.redis.expire('active:'+id, time);
                  })
                }
                socket.sendAPDU(data, callback);
              })
            }
          });
        }
      );
    } else {
      console.log('Could not write device. write will never happen...!!!');
    }
  });
}

/**
 * reading value from device
 */
function read(id, callback) {
  var socket = (new eibd());
  socket.socketRemote(
    this.opts,
    function() {
      var address = socket.str2addr(id);
      socket.openTGroup(address, 0, function(err) {
        if(err) { 
          if(callback) callback(err);
        } else {
          var data = new Array(2);
          data[0] = 0;
          data[1] = 0;
          socket.sendAPDU(data, callback);
        }
      });
    }
  );
}

/**
 * listening for values changes
 */
function socketlisten() {
  var self = this;
  var socket = (new eibd());
  socket.socketRemote(
    this.opts,
    function() {
      socket.openGroupSocket(0, function(action, src, dest, value) {
        dest = socket.addr2str(dest, true);
        src = socket.addr2str(src);
        if(value != null) {
          if(value != 0 || value != 1) {
            value = parseInt(value, 16);
          }
          self.emit('data', action, src, dest, value);
        }
      }
    );
  });
}

/**
 * KNX Controller
 */
function KNX(opts) {
  
  events.EventEmitter.call(this); 

  this.opts = opts;
  
  this.redis = redis.createClient();

  this.socketlisten();
  this.on('data', this.updateStatus);
}
sys.inherits(KNX, events.EventEmitter);
module.exports = KNX;

KNX.prototype.write = write;
KNX.prototype.read = read;
KNX.prototype.socketlisten = socketlisten;

KNX.prototype.checkWritable = function(id, callback) {
  this.redis.get('active:'+id, function(err, item) {
    if(err) {
      if(callback) callback(err);
    }
    if(item === '1') {
      if(callback) callback(err, true);
    } else {
      if(callback) callback(err, false);
    }
  });
}

KNX.prototype.getDevice = function(id, callback) {
  var device = {
    id: id
  };
  var self = this;
  self.redis.get('devices:'+id+':name', function(err, value) {
    if(err) {
      if(callback) callback(err);
    }
    device.name = value;
    self.redis.get('devices:'+id+':type', function(err, type) {
      if(err) {
        if(callback) callback(err);
      }
      device.type = type;
      self.redis.get('devices:'+id+':value', function(err, value) {
        if(err) { 
          if(callback) callback(err);
        }
          
        if(type != '5.xxx') {
          if(value === '0') {
            value = 'Off';
          } else if(value === '1') {
            value = 'On';
          }
        }

        device.value = value;
        
        if(callback) callback(null, device);

      })
    });
  });
  
}

KNX.prototype.getDevices = function(callback) {

  var self = this;
  this.redis.keys('devices:*/*/*:id', function(err, keys) {
    
    if(err) {
      if(callback) callback(err);
    }
    
    async.map(
      keys,
      function(item, callback) {
        self.redis.get(item, function(err, id) {   
          if(err) {
            if(callback) callback(err);
          }
          self.getDevice(id, callback);
        });
      },
      callback
    );

  });
}

KNX.prototype.importWaitRule = function(device, callback) {
  var self = this;
  self.redis.set(
    'rules:wait:'+device.id,
    device.rule.wait,
    function(err) {
      if(callback) { 
        if(callback) callback(err);
      }
    }
  );
}

/**
 * import/updating device
 */
KNX.prototype.importDevice = function(device, callback) {
  var self = this; 

  if(device.rule) self.importWaitRule(device);

  self.redis.set(
    'devices:'+device.id+':id',
    device.id,
    function(err) {
      if(err) {
        if(callback) { 
          if(callback) callback(err);
        }
      }
  
      self.redis.set(
        'devices:'+device.id+':type',
        device.type,
        function(err) {

          if(err) callback(err);

          self.redis.set(
            'devices:'+device.id+':name',
            device.name,
            function(err) {
              if(err) {
                if(callback) callback(err);
              }
              self.read(device.id, function() {});
              if(callback) callback(null);
            }
          );
        }
      );
    }
  );
};

/**
 * updating status of device in redis
 */
KNX.prototype.updateStatus = function(action, src, dest, value) {
  if(action === 'Write' || action === 'Response') {
    var id = dest;
    var self = this;
    this.redis.get('devices:'+id+':type', function(err, type) {
      var key = 'devices:'+id+':value';
      if(type != '5.xxx') {
        if(value === '0') {
          value = 'Off';
        } else if(value === '1') {
          value = 'On';
        }
      }
      self.redis.set(key, value, function(err) {
        if(err) console.log('Can\'t save status: ' + err);
      });
    });
  }
};
