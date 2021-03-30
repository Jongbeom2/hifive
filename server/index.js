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

if (!port) {
  throw new Error("PORT Undefined");
}

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/check", (req, res) => {
  res.send(true);
});

app.get("/test", (req, res) => {
  console.time("Get /test");
  let cnt = 0;
  for (let i = 0; i < 4000000000; i++) {
    cnt++;
  }
  console.timeEnd("Get /test");
  res.send("Test Finished");
});

app.get("/test2", (req, res) => {
  console.log("Get /test2");
  res.send("Test2 Finished");
});

app.post("/hifive", (req, res) => {
  console.log("Post /hifive");
  io.emit("hifive");
  res.send(true);
});

io.on("connect", (socket) => {
  console.log("connected");
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
