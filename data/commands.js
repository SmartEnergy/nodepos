var util = require('util'),
    Command = require('../models/command').Command,
    Store = require('./stores').Store;

/**
 * CommandStore
 */
function CommandStore () {

  Store.call(this, 'commands', 'name');
  
  this.actions = new Store('actions', 'name');
}
// inherit Store
util.inherits(CommandStore, Store);
exports.CommandStore = CommandStore;

/**
 * push new commands
 */
CommandStore.prototype.push = function(command, regions, actions, callback) {
  // TODO validate command
  var new_command = new Command(command.name, command.conditions, command.actions, 
                                regions, actions);
  
  Store.prototype.push.call(this, new_command, callback);
  
};

/**
 * update commands
 */
CommandStore.prototype.update = function(key, command, callback) {
  CommandStore.prototype.get.call(this, key, function(err, item) {
    item.removeRegionEvents();
    Store.prototype.update.call(this, key, command, callback);
  });
};

/**
 * remove commands
 */
CommandStore.prototype.update = function(key, callback) {
  CommandStore.prototype.get.call(this, key, function(err, item) {
    item.removeRegionEvents();
    Store.prototype.remove.call(this, key, callback);
  });
};


/**
 * execute all commands
 */
CommandStore.prototype.execAll = function(user) {
  for(var key in this.items) {
    this.items[key].exec(user);
  }
};