var requireJson = require('../helpers').requireJson,
    CommandStore = require('../data/command.store').CommandStore;

/**
 * CommandController
 *
 * Configure routes and handles CRUD requests
 * for commands
 *
 *  [GET] /commands
 *  [POST] /commands/new
 *  [GET] /commands/:ID/delete
 */
function configureApp (app) {
  
  // command store
  var cmdStore = app.commands = new CommandStore();
  var actionStore = app.actions = app.commands.actions;

  // content type
  var contentType = 'application/json';

  // Routes
  app.get('/commands', index);
  app.post('/commands/new', requireJson, create);
  app.get('/commands/:id/delete', requireJson, del);

  /**
   * return all existing commands 
   */
  function index (req, res) {
  
    var callback = function(err, result) {
      if(err) {
        var msg = "Could not read commands from store ";
        app.responseError(res, 500, msg); 
        app.logger.error(msg+err);
      } else {
        res.writeHead(200, { "Content-Type": contentType
                         , "Content-Length": result.length});
        res.write(result);
        res.end();
      }
    };

    cmdStore.toJson(callback);
  
  };

  /**
   * Add new commmand
   */
  function create (req, res) {
    var msg = "";
    var status = 200;

    var newCmd = req.body;
//    var isValid = app.commands.isValid(newCmd);

//    if(isValid) {
      app.commands.push(newCmd);
      msg = JSON.stringify({ success: true });
//    } else {
//        msg = JSON.stringify({ success: false, msg: "This is not a valid command" });
      
//    }
    
    res.writeHead(status, { "Content-Type": contentType
                     , "Content-Length": msg.length});
    res.write(msg);
    res.end();
  
  };
 
  /**
   * Delete command
   */ 
  function del (req, res) {
    var id = req.params.id;

    var callback = function(err, method, id) {
      if(err) {
        var msg = "[DEL /command/"+id+"] Command was not found ";
        app.responseError(res, 500, msg); 
        app.logger.error(msg+err);
      } else {
        var msg = JSON.stringify({ success: true });
        res.writeHead(200, { "Content-Type": contentType
                         , "Content-Length": msg.length});
        res.write(msg);
        res.end();
      }
    };

    // remove command
    cmdStore.remove(id, callback);
  };
}
exports.configureApp = configureApp;
