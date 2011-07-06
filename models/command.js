/**
 * Command executes a interaction
 * with baall or digitalStrom, if all conditions are complied.
 */
function Command(name, conditions, actions, regionStore) {

  this.store = regionStore;
  this.name = name;
  this.conditions = conditions;
  this.actions = actions;

};
exports.Command = Command;

/**
 * Check if all conditions are complied
 */
Command.prototype.isComplied = function(user) {

  for (var i = 0; i < this.conditions.length; i++) {
    var condition = this.conditions[i];
    switch(condition.type) {
      case 'region':
        // TODO Support more regions at once
        var region = this.store.get(condition.values[0]);
        var idx = region.users.indexOf(user.id);
        if(idx === -1) {
          return false;
        }
        break;
      case 'gesture':
        if(user.gesture != condition.name) { 
          return false;
        }
        break;
      // TODO
      /*
      case 'time':
        break;
      */
      default:
        return false;
        break;
    }
  };
  return true; 
};

/**
 * execute this command
 */
Command.prototype.exec = function(user, callback) {
  if(this.isComplied(user) === true) {
    // TODO for loop actions and execute them
    console.log('DUMMY ACTION - not implemented yet');
    if(callback) callback(true);
  } else {
    if(callback) callback(false);
  }
};
