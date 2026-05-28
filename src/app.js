const express = require("express");
const axios = require("axios");
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
app.put("/currencies/:ticker", authMiddleware, (req, res) => {
  const { ticker } = req.params;
  const { name } = req.body;
  const currency = currencies.find(c => c.ticker === ticker);
  if (!currency) {
    return res.status(404).send("Not found");
  }
  currency.name = name || currency.name;
  res.json(currency);
});
app.delete("/currencies/:ticker", authMiddleware, (req, res) => {
  const { ticker } = req.params;
  const index = currencies.findIndex(c => c.ticker === ticker);
  if (index === -1) {
    return res.status(404).send("Not found");
  }
  currencies.splice(index, 1);
  res.json({ message: "Deleted" });
});
app.get("/price", authMiddleware, async (req, res) => {
  const { currency } = req.query;
  const exists = currencies.find(c => c.ticker === currency);
  if (!exists) {
    return res.status(404).send("Currency not found");
  }
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/price",
      );
    const result = response.data.find(item =>
      item.symbol === currency + "USDT"
    );
    if (!result) {
      return res.status(404).send("Price not found");
    }
    res.json({
      currency,
      price: result.price
    });
  } catch (err) {
    res.status(500).send("Error fetching price");
  }
});
if (require.main === module) {
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
}
module.exports = app;