var util = require('util'),
    Rectangle = require('../models/regions').Rectangle,
    Polygon = require('../models/regions').Polygon,
    Store = require('./stores').Store;

/**
 * RegionStore
 */
function RegionStore () {

  Store.call(this, 'regions', 'name');
  
}
// inherit Store
util.inherits(RegionStore, Store);
exports.RegionStore = RegionStore;

/**
 * validate regions
 */
RegionStore.prototype.isValid = function(region) {

  if(region != undefined || region.type != undefined) {
    var type = region.type;

    switch(type) {
      case 'polygon':
        if(region.name === undefined || region.points === undefined) {
          return false;
        }        
        return true;
        break;
      case 'rectangle':
        if(   region.name === undefined || parseInt(region.posX) === undefined || parseInt(region.posY) === undefined
           || parseInt(region.height) === undefined || parseInt(region.width) === undefined) {
          return false;
        }        
        return true;
        break;
      default:
        return false;
        break;
    }
  } 
  return false;
}

/**
 * push new regions
 */
RegionStore.prototype.push = function(region, callback) {
  
  if(this.isValid(region)) {

    switch(region.type) {
      case 'rectangle':
        var rec = new Rectangle(region.name, region.posX, region.posY, region.width, region.height);
        Store.prototype.push.call(this, rec, callback);
        break;
      case 'polygon':
        var poly = new Polygon(region.name, region.points);
        Store.prototype.push.call(this, poly, callback);
        break;
      default:
        callback(true, null, null);
        break;
    }
  } else {
    callback(true, null, null);
  }

};
