var fs = require('fs'),
    http = require('http');

var HOST = 'localhost';
var PORT = '8000';
// reading csv file and create an array of users
fs.readFile('scripts/kinect_users.csv', encoding='utf8', function(err, data){
  var users = [];
  var lines = data.replace('\r', '').split('\n');
  
  for (var i = 0; i < lines.length; i++) {
    var splitline = lines[i].split(',');
    var id = splitline[0];
    var x = 2230 + parseInt(splitline[1]); // + 2230;
    var y = 580 + parseInt(splitline[3]); // + 580;

    var user = new Object({
      id: id,
      position: new Object({
        x:  x,
        y:  y,
        z:  0 
      }),
      time: 0
    });

    users.push(user);

  };
  send_user(users);
});

function send_user(users) {
  var client  = http.createClient(PORT, HOST);
  var url = 'http://' + HOST + ':' + PORT + '/users/new';
  
  var i = 0;
  
  setInterval(function() {
    if(i < users.length) {
      var rq = client.request("POST", url, { 'Content-Type': 'application/json'});
      var user = users[i];
      user.time = Number(new Date())/1000;
      var rq_object = new Object({
        users: [user]
      });
      rq.write(JSON.stringify(rq_object));
      rq.end();
      i++;
    } else {
      process.exit();
    }
  }, 30);  
}
