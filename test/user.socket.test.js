var net = require('net'),
    app = require('../'),
    assert = require('assert');

function request(client, object, cmd, data) {
  var request = {
    object: object,
    cmd: cmd,
    data: data  
  };
  
  client.write(JSON.stringify(request));

};

describe('KinectSocket', function() {
  describe('Add Users', function() {
     
    it('should response with ok', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("OK", answer.status);
        assert.equal(null, answer.results);
        done();
      });
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client,
        "user",
        "new",
        [
          {
            id		: 	'user1',
            time		: 	(Number(new Date()) / 1000 )+5, 
            gesture : null, 
            position	: {
                    x	:	 0,
                    y	:	 0,
                    z	:	 0
            },
            joints: [
              { name: "foo", x:0, y:0, z:0 }
            ]
                    
           }   
         ]
       );

    }),
    it('should response with error no data', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("INVALID_REQUEST", answer.status);
        assert.equal("no data", answer.results);
        done();
      });
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client,
        "user",
        "new",
        [ ]
       );

    }),
    it('should response with error invalid users', function(done) {
    
      var client = new net.Socket();
      client = client.connect(8001, 'localhost');
      client.on('data', function(data) {
        var answer = JSON.parse(data.toString());
        assert.equal("INVALID_REQUEST", answer.status);
        assert.equal("invalid users", answer.results);
        done();
      });
    
      client.on('error', function(err) {
        console.log(err);
        done();
      });
      
      request(
        client,
        "user",
        "new",
        [ {}, {}]
       );

    })
  })
});
