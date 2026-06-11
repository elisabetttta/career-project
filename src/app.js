 const express = require("express");
 const authMiddleware = require("./middleware/authMiddleware");
require("./db/init");
 const currencyRepository = require("./repositories/currencyRepository");
 const priceRepository = require("./repositories/priceRepository");
 const app = express();
 (async () => {
 const btc = await currencyRepository.findByTicker('BTC');
if (!btc) {
 await currencyRepository.create('Bitcoin', 'BTC');
 console.log('Bitcoin (BTC)');
}
})();
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
if (!name || !ticker) {
return res.status(400).send("Name and ticker are required");
}
 const normalizedTicker = ticker.toUpperCase();
 const newCurrency = await currencyRepository.create(name, normalizedTicker);
res.status(201).json(newCurrency);
} catch (error) {
if (error.code === "SQLITE_CONSTRAINT") {
return res.status(409).send("Currency already exists");
 }
res.status(500).send("Database error");
 }
});
app.put("/currencies/:ticker", authMiddleware, async (req, res) => {
 try {
 const { ticker } = req.params;
 const { name } = req.body;
if (!name) {
return res.status(400).send("Name is required");
}
 const result = await currencyRepository.update(name, ticker.toUpperCase());
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
 const result = await currencyRepository.delete(ticker.toUpperCase());
if (!result) {
return res.status(404).send("Not found");
}
res.json({ message: "Deleted" });
} catch (error) {
res.status(500).send("Database error");
 }
});
app.get("/price", authMiddleware, async (req, res) => {
 try {
 const { currency } = req.query;
if (!currency) {
return res.status(400).send("Currency is required");
}
 const normalizedCurrency = currency.toUpperCase();
 const exists = await currencyRepository.findByTicker(normalizedCurrency);
if (!exists) {
return res.status(404).send("Currency not found");
}
 const savedPrice = await priceRepository.getByTicker(normalizedCurrency);
if (!savedPrice) {
return res.status(404).send("Price not found");
}
res.json({
 currency: savedPrice.ticker,
 price: savedPrice.price,
 updatedAt: savedPrice.updated_at,
});
} catch (error) {
res.status(500).send("Database error");
 }
});
module.exports = app;