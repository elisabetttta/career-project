const db = require("../db/database");
function run(sql, params = []) {
return new Promise((resolve, reject) => {
db.run(sql, params, function (err) {
if (err) return reject(err);
 resolve({
lastID: this.lastID,
changes: this.changes,
});
 });
 });
}
function get(sql, params = []) {
 return new Promise((resolve, reject) => {
db.get(sql, params, (err, row) => {
if (err) return reject(err);
resolve(row || null);
});
 });
}
module.exports = {
async savePrice(ticker, price) {
const existing = await get(
"SELECT id FROM currency_prices WHERE ticker = ?",
 [ticker]
 );
if (existing) {
const result = await run(
"UPDATE currency_prices SET price = ?, updated_at = CURRENT_TIMESTAMP WHERE ticker = ?",
[price, ticker]
 );
 return result.changes;
}
const result = await run(
"INSERT INTO currency_prices (ticker, price) VALUES (?, ?)",
[ticker, price]
 );
 return result.lastID;
 },
getPrice(ticker) {
return get(
"SELECT ticker, price, updated_at FROM currency_prices WHERE ticker = ?",
[ticker]
 );
 },
};