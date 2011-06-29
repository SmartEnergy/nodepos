var http        = require('http'),
    sys         = require('sys'),
    util         = require('util');

var HOST = 'localhost';
var PORT = '8000';

// Define 3 users..
var one = new Object({
        id              : '1',
        gesture         : 'Click',
        position        : new Object({
            x           : 10,
            y           : 10,
            z           : 10 
        }),    
	time            : Number(new Date())/1000
});

var two = new Object({
        id              : '2',
        gesture         : '',
        position        : new Object({
            x           : 20,
            y           : 20,
            z           : 20 
        }),    
	time            : Number(new Date())/1000
});

var three = new Object({
        id              : '3',
        gesture         : '',
        position        : new Object({
            x           : 30,
            y           : 30,
            z           : 30 
        }),    
	time            : Number(new Date())/1000
        
})
var users = [one, two, three];
var count = 0;
function update_user(user) {
    if(user.time == 0) return user;
    user.time           = (Number(new Date())/1000)+10;
    // our example area in poshandler.doExample()
    // is in range of 50-100. We search a random
    // number for range 0-100.
    user.position.x     = Math.floor(Math.random()*10000);
    user.position.y     = Math.floor(Math.random()*5000);
    return user;
}

/*
 * Sending request and modify users
 */
function test_position_request(client) {
    var url = 'http://' + HOST + ':' + PORT + '/users/new';
    var rq = client.request("POST", url, { 'Content-Type': 'application/json'});
    

    var random_user = Math.floor(Math.random()*users.length);
    if(typeof users[random_user] != 'undefined')   users[random_user].time = (Number(new Date())/1000)-10;
    var random_user = Math.floor(Math.random()*users.length);
    if(typeof users[random_user] != 'undefined')   users[random_user].time = (Number(new Date())/1000)-10;
    var random_user = Math.floor(Math.random()*users.length);
    var random_user = Math.floor(Math.random()*users.length);
    if(typeof users[random_user] != 'undefined')   users[random_user].time = (Number(new Date())/1000)-10;
    var random_user = Math.floor(Math.random()*users.length);
    // updating user time and position..
    count++;
    new_user    = new Object({
                id              : count.toString(),
                gesture         : 'Click',
                position        :       new Object({
                        x       :       10,
                        y       :       10,
                        z       :       10,
                    }),
                time    :       Number(new Date())/1000
    });

    //users = [one, two, three, old, old_two, new_user];
    users.push(new_user);
    var rq_object = new Object({
        users: users        
    })
    var body = JSON.stringify(rq_object);
    console.log(body);
    rq.write(body);
    rq.end();
    
    for(var user in users) {
        update_user(users[user]);
    }
}

/*
 * Main function.. parsing args.
 */
function main() {
    // create client
    var client  = http.createClient(PORT, HOST);
    // sending every second a request with three users 
    setInterval(function(){
        util.log('Sending request..');
        test_position_request(client);
    }, 250);
    test_position_request(client);
}
// execute main
main();
