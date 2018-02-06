'use strict';

import express from 'express';
import compression from 'compression';
import config from './config/environment';
import helmet from 'helmet';
import http from 'http';

/*const forceSSL = function() {
  return function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}*/
// ForceSSL middleware
//app.use(forceSSL());


// Setup server
var app = express(),
  server = http.createServer(app);
app.use(compression());
app.use(helmet());
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d', config.port);
  });
  server.timeout = 2700000;
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
