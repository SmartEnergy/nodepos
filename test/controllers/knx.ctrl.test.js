var assert = require('assert'),
    TestServer = require('../support/eibdserver'),
    KNX = require('../../lib/controllers/knx.controller');
/*
var server = null;
var con = null;
var port = 6721;


describe('KNX Controller', function() {
  before(function(done) {
    server = new TestServer(port, function() {
      done();
    });
  });
  after(function(done) {
    if(server) server.end();
    done();
  });
  it('should write value 0 to device', function(done) {
    var con = new KNX({ host: 'localhost', port: port});
    con.once('data', function(action, src, dest, value) {
      assert.equal(action, 'Write');
      assert.equal(dest, '0/0/0');
      assert.equal(value, 0);
      done();
    });
    con.write('2/1/0', 0); 
  }),
  it('should write value 1 to device', function(done) {
    var con = new KNX({ host: 'localhost', port: port});
    con.once('data', function(action, src, dest, value) {
      assert.equal(action, 'Write');
      assert.equal(dest, '0/0/0');
      assert.equal(value, 1);
      done();
    });
    con.write('3/1/0', 1); 
  }),
  it('should write value 255 to device and update', function(done) {
    var con = new KNX({ host: 'localhost', port: port, save: 1});
    con.once('data', function(action, src, dest, value) {
      assert.equal(action, 'Write');
      assert.equal(dest, '0/0/0');
      assert.equal(value, 'ff');
      done();
    });
    con.write('4/1/0', 255); 
  }),
  it('should read value from device', function(done) {
    var con = new KNX({ host: 'localhost', port: port});
    con.once('data', function(action, src, dest, value) {
      assert.equal(action, 'Read');
      assert.equal(dest, '0/0/0');
      done();
    });
    con.read('0/1/0'); 
  }),
  it('should import device', function(done) {
    var con = new KNX({ host: 'localhost', port: port, save: 1});
    var device = {
        id: '3/1/1',
        name: 'upperRightDoor',
        type: '1.001',
        rule: {
          wait: 2,
        }
      };
    con.importDevice(device, function() {
      con.getDevices(function() {});
      con.write('3/1/1', 255, done); 
    });
  });
});*/
