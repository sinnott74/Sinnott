/**
 * Module dependencies.
 */
import path from "path";
import express from "express";
import helmet from "helmet";
import cfenv from "cfenv"; // cloud foundry environment variables
import forceHttpsMiddleware from "./middleware/forceHttps";
import compression from "compression";
import bodyParser from "body-parser";
import Auth from "./core/Auth";
import { Request, Response } from "express";
import routes from "./routes";

/**
 * Adds Sync support to express routers
 */
require("express-async-errors");

/**
 * Create Express server.
 */
const expressApp = express();

/**
 * Force https when not localhost
 */
if (!cfenv.getAppEnv().isLocal) {
  expressApp.use(forceHttpsMiddleware);
}

/**
 * Use helmet for security
 */
expressApp.use(helmet());

/**
 * Body parser
 */
expressApp.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
expressApp.use(bodyParser.json()); // parse application/json

/**
 * Express Validator.
 * Must be set directly after body parser
 */
//expressApp.use(expressValidator());

// prevents express setting x-powered-by header
expressApp.disable("x-powered-by");

/**
 * Initialize passport
 */
expressApp.use(Auth.initialize());

/**
 * use compression
 */
expressApp.use(compression());

// Define static assets path - i.e. styles, scripts etc.
expressApp.use(
  "/",
  express.static(path.join(__dirname, "../../webclient/build"), {
    maxAge: "1y",
    setHeaders: setCustomCacheControl
  })
);

// Data API routes
expressApp.use("/api", routes);

expressApp.get("/*", function(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "../../webclient/build/index.html"));
});

/**
 * Start Express server.
 */
const port = process.env.PORT || 8080;
const server = expressApp.listen(port, () => {
  const serverPort = server.address().port;
  console.log("Server running on port " + serverPort);
});

/**
 * Set custom Cache-Control header for Index.html
 */
function setCustomCacheControl(res: Response, path: string) {
  if (path.endsWith("index.html") || path.endsWith("service-worker.js")) {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
}