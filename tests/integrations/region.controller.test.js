var assert = require('assert'),
    app = require('../../app'),
    Polygon = require('../../models/regions').Polygon;

/**
 * Fixtures
 */
var poly1 = JSON.stringify(new Polygon('polygon1', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 100, yMM: 100},{xMM: 0, yMM: 100}]));
var poly2 = JSON.stringify(new Polygon('polygon2', [{xMM: 0, yMM: 0},{xMM: 100, yMM: 0}, {xMM: 0, yMM: 100}]));

module.exports = {
  '[GET] /regions test': function(beforeExit) {
    var calls = 0;

    // valid request
    assert.response(
      app, 
      { 
        url: '/regions', 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      { 
        status: 200, 
        body: '{"size":0,"regions":[]}',
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
  '[POST] /regions/new': function(beforeExit) {
    var calls = 0;
    // post new kinect
    assert.response(
      app,
      {
        url: '/regions/new',
        method: 'POST',
        data: poly1,
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
        url: '/regions',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
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
  '[GET] /regions/:id/delete': function(beforeExit) {
    var calls = 0;

    // delete kinect
    assert.response(
      app,
      {
        url: '/regions/polygon1/delete',
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
        url: '/regions',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: '{"size":0,"regions":[]}',
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
  }
}
