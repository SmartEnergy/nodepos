/**
 * Command executes actions if all conditions
 * are complied.
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
        else if(condition.empty && condition.empty === true ) {
          if(region.users.length != 0) return false;
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
Command.prototype.exec = function(user, store, callback) {
  if(this.isComplied(user) === true) {
    this.actions.forEach(function(val, index, array) {
        store[val.name].play(user, val.category, val.values);
    });
    if(callback) callback(true);
  } else {
    if(callback) callback(false);
  }
};
