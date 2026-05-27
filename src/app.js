const express = require("express");
const authMiddleware = require("./authMiddleware");
const app = express();
app.use(express.json());
const currencies = [];
app.get("/status", (req, res) => {
  res.send("ok");
});
app.get("/secret", authMiddleware, (req, res) => {
  res.send("you have access");
});
app.get("/currencies", authMiddleware, (req, res) => {
  res.json(currencies);
  });
  app.post("/currencies", authMiddleware, (req, res) => {
  const { name, ticker } = req.body;

  const newCurrency = {
    name,
    ticker
  };

  currencies.push(newCurrency);

  res.status(201).json(newCurrency);
});
module.exports = app;