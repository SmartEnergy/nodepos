var vows	= require('vows'),
    assert	= require('assert'),
    Store	= require('../stores').Store;

var store = new Store("test", "some");
var item = new Object({
   some         : 'one',
   changed      : 0       
});
var two = new Object({
   some         : 'two',
   changed      : 0       
});
var three = new Object({
   some         : 'three',
   changed      : 0       
});
store.push(item, function(){});
store.push(three, function(){});

vows.describe('Store').addBatch({
        'do': {
                    'new item': {
                        topic: function() {
                            // test firing event
                            store.on('new', function(key, item){
                                assert.equal(store.items['two'], item); 
                            });

                            // push new item
                            store.push(two, this.callback);
                        },
                        'should have three items': function(err) {
                            assert.equal(store.length, 3);                      
                        },
                        'stored item should be equal to pushed item': function(err) {
                            store.get('two', function(err, item) {
                                assert.equal(store.items['two'], item); 
                            });
                        } 
                    },
                    'existing item': {
                        topic: function() {
                            update_item = new Object({
                                some: 'two',
                                changed: 1
                            });

                            store.on('update', function(key, item){
                               assert.equal(store.items[key], update_item);     
                            });

                            store.push(update_item, this.callback);
                        },
                        'should have three items': function(err) {
                            assert.equal(store.length, 3);                      
                        },
                        'should update existing item': function(err) {
                            store.get('two', function(err, result){
                               assert.equal(result.changed, update_item.changed);     
                            });             
                        }
                    },
                    'remove':  {
                        topic: store,
                        'one item': function(topic) {

                            store.on('remove', function(key) {
                                assert.equal('three', key);
                            });

                            store.remove('three', function(err){
                                assert.equal(store.length, 2);
                            });
                        }
                    }
        },
	'when call toArray': {
                        topic: function(){
                            store.toArray(this.callback);
                        },
                        'return an array': function(err, results){
                            assert.isArray(results);
                        }
        },
        'when call toJson': {
                        topic: function(){
                            store.toJson(this.callback);
                        },
                        'should return string': function(err, result) {
                            assert.isString(result);
                        },
                        'should return an array of items': function(err, result) {
                            var obj = JSON.parse(result);
                            assert.isArray(obj.test);
                        },
                        'should return size of items': function(err, result) {
                            var obj = JSON.parse(result);
                            assert.equal(obj.size, 2);
                        }
        }
}).export(module);
