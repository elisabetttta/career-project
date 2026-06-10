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
function all(sql, params = []) {
 return new Promise((resolve, reject) => {
 db.all(sql, params, (err, rows) => {
if (err) return reject(err);
 resolve(rows);
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
let transactionQueue = Promise.resolve();
function withTransaction(callback) {
const transaction = transactionQueue.then(async () => {
 await run("BEGIN IMMEDIATE TRANSACTION");
try {
const result = await callback();
const axios = require('axios');
 await run("COMMIT");
 return result;
} catch (error) {
 try {
 await run("ROLLBACK");
} catch (rollbackError) {
error.rollbackError = rollbackError;
}
throw error;
}
});
 transactionQueue = transaction.catch(() => {});
 return transaction;
}
module.exports = {
getAll() {
 return all("SELECT id, name, ticker FROM currencies ORDER BY id");
},
findByTicker(ticker) {
 return get("SELECT id, name, ticker FROM currencies WHERE ticker = ?", [ticker]);
},
 create(name, ticker) {
 return withTransaction(async () => {
const result = await run("INSERT INTO currencies (name, ticker) VALUES (?, ?)", [
name,
ticker,
]);
 return {
id: result.lastID,
name,
ticker,
};
});
},
update(name, ticker) {
 return withTransaction(async () => {
const result = await run("UPDATE currencies SET name = ? WHERE ticker = ?", [
name,
ticker,
]);
 return result.changes;
});
},
delete(ticker) {
 return withTransaction(async () => {
const result = await run("DELETE FROM currencies WHERE ticker = ?", [ticker]);
 return result.changes;
});
},
};