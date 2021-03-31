const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });
const port = process.env.PORT;
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const REDIS_HOST = process.env.NODE_ENV === "production" ? "54.180.15.252" : "";

const redis = require("redis");

try {
  const publisher = redis.createClient({
    host: REDIS_HOST,
    port: "6379",
  });
  const subscriber = redis.createClient({
    host: REDIS_HOST,
    port: "6379",
  });

  if (!port) {
    throw new Error("PORT Undefined");
  }

  app.use(cors());

  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("/test", (req, res) => {
    console.log("Get /test");
    res.send(true);
  });

  app.get("/check", (req, res) => {
    res.send(true);
  });

  app.post("/hifive", (req, res) => {
    console.log("Post /hifive");
    publisher.publish("hifive", "hifive");
    res.send(true);
  });

  subscriber.on("message", (channel, message) => {
    if (message === "hifive") {
      io.emit("hifive");
    }
  });

  subscriber.subscribe("hifive");

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });

  io.on("connect", (socket) => {
    console.log("connected");
  });

  http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
