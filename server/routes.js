'use strict';

import errors from './components/errors';
import express from 'express';
import path from 'path';

export default function(app) {
  app.route('/:url(api|compoents|app|assets)/*').get(errors[404]);

  app.use(express.static(path.join(__dirname, '../dist')));

  // All other routes should redirect to the index.html
  app.route('/*').get((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}
