import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";

const port = normalizePort(process.env.PORT || "3003");

import indexRouter from "./routes";

const app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (_req, res) {
  res.sendStatus(404);
});

// error handler
app.use(function (_err, _req: Request, res: Response) {
  res.sendStatus(500);
});

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on(
  "error",
  (
    error: Error & {
      syscall: string;
      code: string;
    }
  ) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  }
);
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log("Listening on " + bind);
  logger("Listening on " + bind);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  console.log(val);
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
