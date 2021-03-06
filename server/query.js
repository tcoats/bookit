// Generated by CoffeeScript 1.10.0
module.exports = function(app) {
  var Exe, Store, buildqueries;
  Store = require('odoql-store');
  Exe = require('odoql-exe');
  buildqueries = require('odoql-exe/buildqueries');
  return app.post('/query', function(req, res, next) {
    var exe, run, store;
    store = Store();
    require('../book/server').query(req, store);
    exe = Exe().use(store);
    run = buildqueries(exe, req.body.q);
    return run(function(errors, results) {
      var _, error;
      if (errors == null) {
        return res.send(results);
      }
      for (_ in errors) {
        error = errors[_];
        if (error.stack != null) {
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
      res.status(500);
      return res.send(errors);
    });
  });
};
