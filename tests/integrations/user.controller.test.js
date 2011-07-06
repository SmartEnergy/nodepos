var assert = require('assert'),
    app = require('../../app');

/**
 * TEST User Controller
 *  /users/new
 *  /users
 */
module.exports = {
  '[GET] /users test': function(beforeExit) {
    var calls = 0;

    // valid request
    assert.response(
      app, 
      { 
        url: '/users', 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      }, 
      { 
        status: 200, 
        body: '{"size":0,"users":[]}',
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
  '[POST] /users/new': function(beforeExit) {
    var calls = 0;
    var user = {
      id		: 	'user1',
      time		: 	(Number(new Date()) / 1000 )+10,
      gesture : null, 
      position	: 	new Object({
              x	:	 0,
              y	:	 0,
              z	:	 0
              })
    };
    // post new user
    assert.response(
      app,
      {
        url: '/users/new',
        method: 'POST',
        data: JSON.stringify(user),
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

    // get users
    assert.response(
      app,
      {
        url: '/users',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 200,
        body: JSON.stringify({ size: 1, users: [user]})
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
  '[POST] /users/new wrong data': function(beforeExit) {
    var calls = 0;
    
    // post invalid users
    assert.response(
      app,
      {
        url: '/users/new',
        method: 'POST',
        data: '{"id":"foo"}',
        headers: {
          'Content-Type': 'application/json'
        } 
      },
      {
        status: 400,
        body: '{"success":false}',
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
  '[POST] /users/new wrong content type': function(beforeExit) {
    var calls = 0;

    // wrong contentType
    assert.response(
      app,
      {
        url: '/users/new',
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
  }
}
