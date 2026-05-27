const express = require("express");
const authMiddleware = require("./authMiddleware");
const app = express();
app.use(express.json());
app.get("/status", (req, res) => {
  res.send("ok");
});
app.get("/secret", authMiddleware, (req, res) => {
  res.send("you have access");
});
module.exports = app;