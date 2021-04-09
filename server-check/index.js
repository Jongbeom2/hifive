const axios = require("axios");
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });
const port = process.env.PORT;
const app = express();
const http = require("http").Server(app);

try {
  if (!port) {
    throw new Error("PORT Undefined");
  }

  app.use(cors());

  app.get("/", (req, res) => {
    console.log("Get /");
    res.send("Hello World Server Checker");
  });

  app.get("/test", (req, res) => {
    console.log("Get /test");
    res.send(true);
  });

  app.get("/check", (req, res) => {
    res.send(true);
  });

  app.get("/server-check", async (req, res) => {
    console.log("Get /server-check");
    try {
      const result = await axios.get(`${process.env.CHECK_SERVER_URL}/check`);
      console.log(result);
      res.send(result.data);
    } catch (error) {
      res.send(false);
    }
  });

  http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
