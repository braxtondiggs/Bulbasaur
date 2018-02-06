'use strict';
/*eslint no-process-env:0*/

import path from 'path';
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.ip ||
    undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080
};
module.exports = all;
