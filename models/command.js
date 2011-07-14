var util = require('util');
/**
 * Command executes actions if all conditions
 * are complied.
 */
function Command(name, conditions, actions, regionStore, actionStore) {

  var self = this;
  
  this.store = regionStore;
  this.actionStore = actionStore;
  this.name = name;
  this.conditions = conditions;
  this.actions = actions;

  conditions.forEach(function(condition, index, array) {
    switch(condition.type) {
      case 'region':
        var region = self.store.get(condition.values[0]);
        console.log(util.inspect(region));
        if(condition.name === 'userIn') region.addListener('userIn', function(user) {
          console.log('USSSSSSSSSSEEEEEEEEEEEEEEERIIIIIIIIIIIIIIIIIN');
          //self.exec(user);
        });
        if(condition.name === 'userOut') region.addListener('userOut', self.exec);
        break;
      default:
        break;
    }
  });
};
exports.Command = Command;

/**
 * Check if all conditions are complied
 */
Command.prototype.isComplied = function(user) {
  for (var i = 0; i < this.conditions.length; i++) {
    var condition = this.conditions[i];
    console.log('Condition category ' + condition.category);
    switch(condition.category) {
      case 'Regions':
        if(condition.name === 'userAlreadyIn') {
          var region = this.store.get(condition.values[0]);
          var idx = region.users.indexOf(user.id);
          if(idx === -1) {
            return false;
          }
          else if(condition.empty && condition.empty === true ) {
            if(region.users.length != 0) return false;
          }
        } else {
          return false;
        }
        break;
      case 'Gestures':
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
  var self = this;
  if(Command.prototype.isComplied.call(this, user) === true) {
    self.actions.forEach(function(val, index, array) {
        self.actionStore.items[val.name].play(user, val.category, val.values);
    });
    if(callback) callback(true);
  } else {
    if(callback) callback(false);
  }
};
