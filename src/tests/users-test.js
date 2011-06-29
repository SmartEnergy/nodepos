var vows	= require('vows'),
    assert	= require('assert'),
    sys		= require('sys');
    Users	= require('../stores').Users;

var users = new Users();

var user_for_rm = new Object({
	id		: 	'user_for_rm',
	time		: 	(Number(new Date())/1000)-10,
	position	: 	new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
				 })
});

var user1 = new Object({
	id		: 	'user1',
	time		: 	(Number(new Date()) / 1000 )+10, 
  position	: 	new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
			  	})
});
var user_ = new Object({
	id		:	 'user_',
	time		: 	 (Number(new Date())/1000)+20, 
	position	:	 new Object({
					x	:	 0,
					y	:	 0,
					z	:	 0
			  	})
});
users.push(user1, function(){});
vows.describe('Users Store').addBatch({
	'An users store with two users': {
			topic: users,
			'should have a length of 1': function(topic) {
				assert.equal(topic.length, 1);
			},
			'should remove user': function(topic) {
				user1.time = user1.time-1000000;
				topic.remove(user1.id, function(err){
				    assert.equal(topic.length, 0);
                                });
			},
			'not remove user if it is in time': function(topic) {
        topic.push(user_, function(err){
			    topic.remove('user_', function(err){
				    assert.equal(topic.length, 1);
          });                                
        });	
			}
	},		
	'A new users store': {
			topic: new Users(),
			'should have a length of zero': function(topic) {
				assert.equal(topic.length, 0);
			},
			'should add two user': function(topic) {
                            
				var user_1 = new Object({
					id		:	'user_1',
					time		:	Number(new Date())/1000,
					position	:	new Object({
									x	:	0,
									y	:	0,
									z	:	0
					})
				});
				
				var user_2 = new Object({
					id		:	'user_2',
					time		:	Number(new Date())/1000,
					position	:	new Object({
									x	:	0,
									y	:	0,
									z	:	0
							})
				});
				topic.push(user_2, function(err) {
  				  topic.push(user_1, function(err) {
        	    assert.equal(topic.length, 2);
            });
          });
			},
			'should not add user out of time': function(topic) {
				var user_3 = new Object({
					id		:	'user_3',
					time		:	(Number(new Date())/1000)-100, 
					position	:	new Object({
									x	:	0,
									y	:	0,
									z	:	0
						
							})
				
				});

				topic.push(user_3, function(err) {
				    assert.equal(topic.length, 2);
                                });
			},
			'should update not add existing user': function(topic) {

				topic.get('user_1', function(err, item){
				    assert.equal(topic.length, 2);
				    assert.equal(item.position.x, 0);
				    assert.equal(item.position.y, 0);
				    assert.equal(item.position.z, 0);
                                });

				var user_1 = new Object({
					id		:	'user_1',
					time		:	Number(new Date())/1000,
					position	:	new Object({
									x	:	100,
									y	:	100,
									z	:	100
						
							})
				
				});

				topic.push(user_1, function(err) {
                                        
				    assert.equal(topic.length, 2);
			
				    exist_user = topic.items['user_1'];
				    
				    assert.equal(exist_user.position.x, 100);
				    assert.equal(exist_user.position.y, 100);
				    assert.equal(exist_user.position.z, 100);
				    assert.equal(exist_user.time, user_1.time);

        });
				
			},
			'should return json string with all users': function(topic) {
			
				var result = topic.toJson(function(err, result){
					assert.isString(result);
					assert.equal(JSON.parse(result).users.length, 2);
				});
			
			}
	}
}).export(module);
