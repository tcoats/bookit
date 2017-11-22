// Generated by CoffeeScript 1.10.0
var whakaruru;

whakaruru = require('whakaruru/verbose');

whakaruru(function() {
  var app, bodyParser, compression, express, httpServer, i, len, mutunga, pjson, pod, pods, port;
  express = require('express');
  app = express();
  mutunga = require('http-mutunga');
  httpServer = mutunga(app);
  compression = require('compression');
  app.use(compression());
  bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  app.use(bodyParser.json({
    limit: '50mb'
  }));
  app.set('json spaces', 2);
  pods = [require('./server/auth'), require('./server/static'), require('./server/query'), require('./book/server'), require('./server/root')];
  for (i = 0, len = pods.length; i < len; i++) {
    pod = pods[i];
    pod(app, httpServer);
  }
  pjson = require('./package.json');
  port = 8080;
  return httpServer.listen(port, function() {
    var boundport, host, shutdown;
    host = httpServer.address().address;
    boundport = httpServer.address().port;
    shutdown = function() {
      console.log(pjson.name + "@" + pjson.version + " ōhākī waiting for requests to finish");
      return httpServer.close(function() {
        console.log(pjson.name + "@" + pjson.version + " e noho rā!");
        return process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    return process.on('SIGINT', shutdown);
  });
});
