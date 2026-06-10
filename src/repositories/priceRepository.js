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
getByTicker(ticker) {
 return get(
"SELECT ticker, price, updated_at FROM currency_prices WHERE ticker = ?",
[ticker]
);
 },
save(ticker, price) {
 return run(
 ` INSERT INTO currency_prices (ticker, price, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(ticker) DO UPDATE SET
  price = excluded.price,
  updated_at = CURRENT_TIMESTAMP`,
[ticker, String(price)]
);
 },
};