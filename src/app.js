const express = require("express");
const axios = require("axios");
const authMiddleware = require("./middleware/authMiddleware");
require("./db/init");
const currencyRepository = require("./repositories/currencyRepository");
const app = express();
app.use(express.json());
app.get("/status", (req, res) => {
  res.send("ok");
});
app.get("/secret", authMiddleware, (req, res) => {
  res.send("you have access");
});
app.get("/currencies", authMiddleware, async (req, res) => {
  try {
const currencies = await currencyRepository.getAll();
res.json(currencies);
} catch (error) {
res.status(500).send("Database error");
}
});
app.post("/currencies", authMiddleware, async (req, res) => {
 try {
const { name, ticker } = req.body;
const newCurrency = await currencyRepository.create(name, ticker);
res.status(201).json(newCurrency);
} catch (error) {
 console.log("POST ERROR:", error);
res.status(500).send("Database error");
}
});
app.put("/currencies/:ticker", authMiddleware, async (req, res) => {
 try {
const { ticker } = req.params;
const { name } = req.body;
const result = await currencyRepository.update(name, ticker);
if (!result) {
 return res.status(404).send("Not found");
}
res.json({ message: "Updated" });
} catch (error) {
res.status(500).send("Database error");
  }
});
app.delete("/currencies/:ticker", authMiddleware, async (req, res) => {
 try {
const { ticker } = req.params;
const result = await currencyRepository.delete(ticker);
 if (!result) {
return res.status(404).send("Not found");
}
 res.json({ message: "Deleted" });
} catch (error) {
 res.status(500).send("Database error");
}
});
app.get("/price", authMiddleware, async (req, res) => {
const { currency } = req.query;
const all = await currencyRepository.getAll();
const exists = all.find(c => c.ticker === currency);
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