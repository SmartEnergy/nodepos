var util = require('util'),
    Command = require('../models/command').Command,
    Store = require('./stores').Store;

/**
 * CommandStore
 */
function CommandStore () {

  Store.call(this, 'commands', 'name');
  
}
// inherit Store
util.inherits(CommandStore, Store);
exports.CommandStore = CommandStore;

/**
 * push new commands
 */
CommandStore.prototype.push = function(command, callback) {
  // TODO validate command
  var new_command = new Command(command.name, command.conditions, command.actions);
  Store.prototype.push.call(this, new_command, callback);
};

/**
 * execute all commands
 */
CommandStore.prototype.execAll = function(user) {
  for(var key in this.items) {
    this.items[key].exec(user);
  }
};
