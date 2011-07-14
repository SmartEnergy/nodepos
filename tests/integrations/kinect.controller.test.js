var assert = require('assert'),
    app = require('../../app');

/**
 * TEST Kinect Controller
 *  /kinects/new
 *  /kinects
 *  /kinects/:ID/delete
 */
module.exports = {
  '[GET] /kinects test': function(beforeExit) {
    var calls = 0;

    // valid request
    assert.response(
      app, 
      { 
        url: '/kinects', 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      { 
        status: 200, 
        body: '{"size":0,"kinects":[]}',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      function(res) {
        ++calls;
        assert.ok(res);
      }
    );

    beforeExit(function(){
      assert.equal(1, calls);
    });
  },
  '[POST] /kinects/new': function(beforeExit) {
    var calls = 0;
    // post new kinect
    assert.response(
      app,
      {
        url: '/kinects/new',
        method: 'POST',
        data: JSON.stringify({ kinects: [ { id: "0X0000", x: 0, y: 0, angle: 0 } ] }),
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: '{"success":true}'
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );


    // get kinects
    assert.response(
      app,
      {
        url: '/kinects',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: '{"size":1,"kinects":[{"id":"0X0000","x":0,"y":0,"angle":0}]}'
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );

    beforeExit(function(){
      assert.equal(2, calls);
    });
  },
  '[POST] /kinects/new wrong data': function(beforeExit) {
    var calls = 0;
    
    // post invalid kinect
    assert.response(
      app,
      {
        url: '/kinects/new',
        method: 'POST',
        data: JSON.stringify({ kinects: [ { id: "0X0000", angle: 0 } ] }),
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 400,
        body: '{"success":false,"msg":"This is not a valid kinect"}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );
    
    beforeExit(function(){
      assert.equal(1, calls);
    });
  },
  '[POST] /kinects/new wrong content type': function(beforeExit) {
    var calls = 0;

    // wrong contentType
    assert.response(
      app,
      {
        url: '/kinects/new',
        method: 'POST',
      },
      {
        status: 406,
        body: '{"success":false,"msg":"Use application/json"}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );
    
    beforeExit(function(){
      assert.equal(1, calls);
    });
  },
  '[GET] /kinects/:id/delete': function(beforeExit) {
    var calls = 0;

    // delete kinect
    assert.response(
      app,
      {
        url: '/kinects/0X0000/delete',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: '{"success":true}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );
   
    // get kinects 
    assert.response(
      app,
      {
        url: '/kinects',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: '{"size":0,"kinects":[]}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );

    beforeExit(function(){
      assert.equal(2, calls);
    });
  },
  '[GET] /kinects/:id/delete with wrong id': function(beforeExit) {
    var calls = 0;

    // delete kinect
    assert.response(
      app,
      {
        url: '/kinects/0X0000/delete',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 404,
        body: '{"success":false,"msg":"Kinect was not found"}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      function(res) {
        ++calls;
        assert.ok(res);
      }      
    );
   
    beforeExit(function(){
      assert.equal(1, calls);
    });
  }
}
