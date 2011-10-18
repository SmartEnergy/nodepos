var redis = require("redis"),
    winston = require("winston"),
    Rectangle = require('./models/regions').Rectangle,
    Polygon = require('./models/regions').Polygon,
    Command = require('./models/command').Command;

// redis keys
var REGIONKEY = 'regions';
var COMMANDKEY = 'commands';

/**
 * Persisting models with redis-server
 * This getting refactored soon!
 */
function configurePersist(app) {
  
  redisClient = redis.createClient();

  redisClient.on("error", function (err) {
    winston.error("Error " + err);
  });
 
  /**
   * register event-listener for commands
   */
  function configureCmds() {
    app.commands.addListener('new', persistModel);
    app.commands.addListener('update', persistModel);
    app.commands.addListener('removed', function(key) {

      redisClient.hdel(COMMANDKEY, key, function(err) {
        
        if(err) {
          winston.error('Could not remove Command ' + key);
        } else {
          winston.info('Removed Command ' + key);
        }

      });

    });
  }

  /**
   * register event-listener for regions
   */
  function configureRegions() {
    app.regions.addListener('new', persistModel);
    app.regions.addListener('update', persistModel);
    app.regions.addListener('removed', function(key) {

      redisClient.hdel(REGIONKEY, key, function(err) {
        
        if(err) {
          winston.error('Could not remove Region ' + key);
      } else {
          winston.info('Removed Region ' + key);
        }

      });

    });
  }

  // load commands and regions 
  loadModels(REGIONKEY, app.regions, app, configureCmds);
  loadModels(COMMANDKEY, app.commands, app, configureRegions);

  // housekeeping
  process.on('SIGINT', function() {
    redisClient.quit();
    process.exit();
  });
};
exports.configurePersist = configurePersist;

/**
 * persisting model
 */ 
function persistModel(key, model) {
  winston.info(typeof model);
  if(model instanceof Command) {
    doPersist(key, model, COMMANDKEY);
  } else if( model instanceof Rectangle || model instanceof Polygon ) {
    doPersist(key, model, REGIONKEY);
  } else {
    winston.warn('No persist configuration found for '+ typeof(model));
  }

};

/**
 * update/set model
 */
function doPersist (key, model, hashkey) {

  winston.info('Persisting '+hashkey+' Model with key: '+key);

  var value = JSON.stringify(model);

  redisClient.hset(hashkey, key, value, function(err, reply) {
    if(err) winston.error('Could not persist '+hashkey+' Model with key'+key);
  }); 

};

/**
 * loads models into a store
 */
function loadModels(key, store, app, callback) {

  redisClient.hkeys(key, function (err, keys) {

    if(err) {
      winston.error('Could not load models for ' +key);
    } else {
      winston.info('LOADED '+keys.length+" from "+key);
      
      keys.forEach(function (modelkey, i) {
        if(key === COMMANDKEY) {
          redisClient.hget(COMMANDKEY, modelkey, function(err, reply) {
            store.push(JSON.parse(reply), app.regions, app.actions);      
          });
        } else {
          redisClient.hget(key, modelkey, function(err, reply) {
            store.push(JSON.parse(reply));      
          });
        }
      });
    }

    if(callback) callback();
  });
}
