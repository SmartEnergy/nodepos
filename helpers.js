/**
 * check if request is application/json
 */
function requireJson(req, res, next) {
  var contentType = 'application/json';
  if(req.is('*/json')) {
    next();
  } else {
    var msg = JSON.stringify({ success: false, msg: 'Use application/json' });
    res.writeHead(406, { "Content-Type": contentType,
                         "Content-Length": msg.length });
    res.write(msg);
    res.end();
  }
};
exports.requireJson = requireJson;
