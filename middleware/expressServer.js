const http = require("http");
const express = require("express");
const OpenApiValidator = require('express-openapi-validator');
var bodyParser = require('body-parser');
const { logger } = require('../utils/logger');
const { router } = require("../routes/routes");
const { handleErrorResponse } = require("../utils/error");

class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: './api/openApi.yaml',
        validateRequests: true,
        validateResponses: {
          onError: (err, json, req) => {
            handleErrorResponse(err, req, req.res);
          }
        },
      }),
    );
    this.app.use((err, req, res, next) => {
      handleErrorResponse(err, req, res);
    });
    // routes API
    this.app.use('/', router)
  }

  launch() {
    http.createServer(this.app).listen(this.port);
    logger.info(`Listening on port ${this.port}`);
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      logger.info(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
