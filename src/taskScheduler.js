const currencyRepository = require("./repositories/currencyRepository");
const priceRepository = require("./repositories/priceRepository");
const binanceService = require("./services/binanceService");
const logger = require("./logger");
class TaskScheduler {
 constructor() {
 this.intervals = [];
}
 async updatePrices() {
 try {
const currencies = await currencyRepository.getAll();
 for (const currency of currencies) {
 try {
const price = await binanceService.getPrice(
`${currency.ticker}USDT`
);
 await priceRepository.savePrice(
currency.ticker,
price
);
logger.info(
`Price updated for ${currency.ticker}`
);
} catch (error) {
logger.error(
`Failed to update ${currency.ticker}: ${error.message}`
);
 }
}
} catch (error) {
logger.error(error.message);
 }
}
start() {
 this.updatePrices();
const intervalId = setInterval(
 () => this.updatePrices(), 60000
);
 this.intervals.push(intervalId);
logger.info("Task scheduler started");
 }
stop() {
 for (const intervalId of this.intervals) {
clearInterval(intervalId);
 }
 this.intervals = [];
logger.info("Task scheduler stopped");
 }
}
module.exports = TaskScheduler;