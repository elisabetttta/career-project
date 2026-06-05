const db = require("../db/database");
module.exports = {
getAll() {
 return new Promise((resolve, reject) => {
 db.all("SELECT * FROM currencies", [], (err, rows) => {
 if (err) return reject(err);
resolve(rows);
 });
 });
 },
create(name, ticker) {
 return new Promise((resolve, reject) => {
 db.run(
"INSERT INTO currencies (name, ticker) VALUES (?, ?)",
[name, ticker],
 function (err) {
if (err) return reject(err);
resolve({
 id: this.lastID,
name,
ticker,
 });
 }
 );
 });
 },
update(name, ticker) {
 return new Promise((resolve, reject) => {
db.run(
 "UPDATE currencies SET name = ? WHERE ticker = ?",
 [name, ticker],
 function (err) {
 if (err) return reject(err);
resolve(this.changes);
 }
 );
 });
 },
 delete(ticker) {
return new Promise((resolve, reject) => {
 db.run(
 "DELETE FROM currencies WHERE ticker = ?",
[ticker],
 function (err) {
 if (err) return reject(err);
resolve(this.changes);
  }
  );
  });
  },
};