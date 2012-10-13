var powerless = require('../lib/powerless'),
    assert = require('assert');

var valId = setInterval(function() {
  powerless.detect(1, {
    id: '1',
    joints: [
      {
        type: 1,
        x: 0,
        y: 0,
        z: 60
      },
      {
        type: 2,
        x: 0,
        y: 0,
        z: 60
      },
      {
        type: 4,
        x: 0,
        y: 0,
        z: 60
      },
      {
        type: 24,
        x: 0,
        y: 0,
        z: 60
      },
      {
        type: 20,
        x: 0,
        y: 0,
        z: 60
      }
    ]
  });
}, 200);
describe('UserPowerless Detection', function() {
  it('should emit event warn', function(done) { 
    powerless.on('warn', function(user) {
      assert.equal(user.id, 1);
      done();
    });    
  }),
  it('should emit event emergencyCall', function(done) { 
    powerless.on('emergencyCall', function(user) {
      assert.equal(user.id, 1);
      done();
    });    
    
  }),
  it('should emit event powerless', function(done) { 
    powerless.on('powerless', function(user) {
      assert.equal(user.id, 1);
      clearInterval(valId);
      done();
    });    
    
  })
});
