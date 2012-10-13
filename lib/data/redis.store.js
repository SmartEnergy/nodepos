/**
 * Name         : persist.js
 * Author       : Andree < andreek@tzi.de > 
 * Description  : This file is used to persist regions and commands to a database
 *                (in this case redis.io). On events like new/update/removed we execute these
 *                actions on redis db, too.
 */
var redis = require("redis"),
    Rectangle = require('../models/regions').Rectangle,
    Polygon = require('../models/regions').Polygon,
    Command = require('../models/command').Command;

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
    app.logger.error("Error " + err);
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
          app.logger.error('Could not remove Command ' + key);
        } else {
          app.logger.info('Removed Command ' + key);
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
          app.logger.error('Could not remove Region ' + key);
      } else {
          app.logger.info('Removed Region ' + key);
        }

      });

    });
  }

  // load commands and regions 
  loadModels(REGIONKEY, app.regions, app, function() {
    loadModels(COMMANDKEY, app.commands, app, function() {
    });
  });
  
  configureRegions();
  configureCmds();

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
  if(model instanceof Command) {
    doPersist(key, model, COMMANDKEY);
  } else if( model instanceof Rectangle || model instanceof Polygon ) {
    doPersist(key, model, REGIONKEY);
  } else {
    console.log('No persist configuration found for '+ typeof(model));
  }

};

/**
 * update/set model
 */
function doPersist (key, model, hashkey) {


  var value = JSON.stringify(model);

  redisClient.hset(hashkey, key, value, function(err, reply) {
    if(err) console.log('Could not persist '+hashkey+' Model with key'+key);
  }); 

};

/**
 * loads models into a store
 */
function loadModels(key, store, app, callback) {

  redisClient.hkeys(key, function (err, keys) {

    if(err) {
      app.logger.error('Could not load models for ' +key);
    } else {
      app.logger.info('LOADED '+keys.length+" from "+key);
      
      keys.forEach(function (modelkey, i) {
        if(key === COMMANDKEY) {
          redisClient.hget(COMMANDKEY, modelkey, function(err, reply) {
            store.push(JSON.parse(reply), app.regions, app.actions, callback);      
          });
        } else {
          redisClient.hget(key, modelkey, function(err, reply) {
            store.push(JSON.parse(reply), callback);      
          });
        }
      });
    }

  });
}
