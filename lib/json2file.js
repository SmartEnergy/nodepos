var sys   = require('sys'),
    fs    = require('fs'),
    async = require('async');

/*
 * write json to txtfiles
 * for temp persistence for webgui objects.
 */
function writeFile(name, object, callback) {
  var filename = name;
  object = JSON.stringify(object);
  fs.writeFile( 
      filename
    , object
    , encoding='utf8'
    , function(err) {
        if(err) throw err;
        console.log('Saved configuration in ' + filename);
        if(callback) callback();
    }
  );
}
exports.writeFile = writeFile;

function readFile(filename, callback) {
  fs.readFile(
      filename
    , encoding='utf8'
    , function(err, data) {
        callback(err, data);
    }
  );
}
exports.readFile = readFile;

function readRegions(callback) {
  fs.readFile(
      './json/regions.json'
    , encoding='utf8'
    , function(err, data) {
      callback(data);
    }
  );
}
exports.readRegions = readRegions;
