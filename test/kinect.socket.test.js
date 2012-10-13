var net = require('net'),
    app = require('../'),
    assert = require('assert');
/*
function request(client, object, cmd, data) {
  var request = {
    object: object,
    cmd: cmd,
    data: data  
  };
  
  client.write(JSON.stringify(request));

};

describe('Kinect Controller', function() {
  describe('[GET] Kinects', function() {
     
    it('should response with ok and zero kinects', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
          assert.equal("OK", answer.status);
          assert.equal(0, answer.results.length);
          done();
        }
      });
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(client, "kinect", "index", null);

    }),
    
    it('should response with INVALID REQUEST and Object not found', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
          assert.equal("INVALID_REQUEST", answer.status);
          assert.equal("Object not found", answer.results);
          done();
        }
      });
    
      client.on('error', function(err) {
        assert.equal(null, err);
        done();
      });
        
      request(client, "kitchen", "index", null);
    }),
    it('should response with INVALID REQUEST and cmd not found', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
          assert.equal("INVALID_REQUEST", answer.status);
          assert.equal("cmd not found", answer.results);
          done();
        }
      });
    
      client.on('error', function(err) {
        assert.equal(null, err);
        done();
      });
        
      request(client, "kinect", "foo", null);
    }),
    it('should add new kinect', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');

      function checkKinect(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
          assert.equal("OK", answer.status);
          assert.equal(1, answer.results.length);
          done();
        }
      
      }

      function addCb(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("OK", answer.status);
        assert.equal(null, answer.results);
        client.removeAllListeners();
        client.on('data', checkKinect);
      
        request(client, "kinect", "index", null);

      }

      client.on('data', addCb);
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client, 
        "kinect", 
        "new", 
        [ {
            id: 1,
            x: 10,
            y: 10,
            z: 10, 
            angle: 0
          }
        ]
      );

    }),
    it('should response with on removing invalid id', function(done) {
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');

      function delKinect(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
        assert.equal("INVALID_REQUEST", answer.status);
        assert.equal(null, answer.results);
        done();
        } 
      
      }
      client.on('data', delKinect);
      request(client, "kinect", "delete", 335);
    }),
    it('should remove kinect', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');

      function delKinect(data) {
        var answer = JSON.parse(data.toString());
        if(answer.status) {
          assert.equal("OK", answer.status);
          assert.equal(null, answer.results);
          done();
        }
      
      }

      function addCb(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("OK", answer.status);
        assert.equal(null, answer.results);
        client.removeAllListeners();
        client.on('data', delKinect);
        request(client, "kinect", "delete", 15);

      }

      client.on('data', addCb);
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client, 
        "kinect", 
        "new", 
        [ {
            id: 15,
            x: 10,
            y: 10,
            z: 10, 
            angle: 0
          }
        ]
      );

    }),
    it('should response with err on new kinect', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("INVALID_REQUEST", answer.status);
        assert.equal("invalid data", answer.results);
        done();
      });
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client, 
        "kinect", 
        "new", 
        [ {
            id: 1,
            z: 10, 
            angle: 0
          }
        ]
      );

    })

  });
});
*/
