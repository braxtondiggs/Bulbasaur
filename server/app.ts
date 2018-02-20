'use strict';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as favicon from 'serve-favicon';

class App {
  public express: express.Application;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(express.static('dist'));
    this.express.use(favicon('./dist/favicon.ico'));
    this.express.use(helmet());
    this.express.use(compression());
  }

  private routes(): void {
    // TODO: add routes
  }
}
export default new App().express;
