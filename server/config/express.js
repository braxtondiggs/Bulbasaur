/**
 * Express configuration
 */

'use strict';

import favicon from 'serve-favicon';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import path from 'path';

import config from './environment';

export default function(app) {
  app.use(favicon(path.join(config.root, 'dist', 'favicon.ico')));
  app.set('views', `${config.root}/server/views`);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
}
