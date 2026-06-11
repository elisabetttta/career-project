const currencyRepository = require("./repositories/currencyRepository");
const priceRepository = require("./repositories/priceRepository");
const binanceService = require("./services/binanceService");
const logger = require("./logger");
class TaskScheduler {
constructor(options = {}) {
this.intervalMs = Number(options.intervalMs || process.env.PRICE_UPDATE_INTERVAL_MS || 60000);
this.intervalId = null;
}
async updatePrices() {
const currencies = await currencyRepository.getAll();
for (const currency of currencies) {
const ticker = currency.ticker.toUpperCase();
const symbol = `${ticker}USDT`;
try {
const price = await binanceService.getPrice(symbol);
 await priceRepository.save(ticker, price);
 console.log(`${symbol} = ${price}`);
} catch (error) {
console.error(`Failed to update price for ${symbol}:`, error.message);
}
 }
}
start() {
if (this.intervalId) return;
 this.updatePrices();
 this.intervalId = setInterval(() => {
 this.updatePrices();
 }, this.intervalMs);
}
stop() {
 if (!this.intervalId) return;
clearInterval(this.intervalId);
 this.intervalId = null;
 }
}
module.exports = TaskScheduler;