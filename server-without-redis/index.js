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

try {
  if (!port) {
    throw new Error("PORT Undefined");
  }

  app.use(cors());

  app.use(express.static(path.join(__dirname, "./build-client")));

  app.get("/test", (req, res) => {
    console.log("Get /test");
    res.send(true);
  });

  app.get("/check", (req, res) => {
    console.log("Get /check");
    res.send(true);
  });

  app.post("/hifive", (req, res) => {
    console.log("Post /hifive");
    io.emit("hifive");
    res.send(true);
  });

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./build-client", "index.html"));
  });

  io.on("connect", (socket) => {
    console.log("connected socket");
  });

  http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
