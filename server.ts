import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { existsSync, readFileSync } from 'fs';

import bootstrap from './src/main.server';

// The Express server
const server = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(browserDistFolder, 'index.html');

let template: string;
try {
  template = readFileSync(indexHtml, 'utf8');
} catch (error) {
  console.error('Could not read index.html:', error);
  process.exit(1);
}

server.set('view engine', 'html');
server.set('views', browserDistFolder);

// Serve static files from /browser
server.get('**/*.@(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)', express.static(browserDistFolder, {
  maxAge: '1y',
  etag: false,
}));

// All regular routes use the Angular Universal engine
server.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;
  const url = `${protocol}://${headers.host || 'localhost'}${originalUrl}`;
  
  renderApplication(bootstrap, {
    document: template,
    url: url,
    platformProviders: [
      { provide: APP_BASE_HREF, useValue: baseUrl },
    ],
  })
    .then((html: string) => {
      res.send(html);
    })
    .catch((err: any) => {
      console.error('SSR Error:', err);
      next(err);
    });
});

const port = process.env['PORT'] || 4000;

// Start up the Node server
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});