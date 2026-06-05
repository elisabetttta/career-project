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
db.run("BEGIN TRANSACTION");
db.run(
 "INSERT INTO currencies (name, ticker) VALUES (?, ?)",
 [name, ticker],
function (err) {
if (err) {
db.run("ROLLBACK");
return reject(err);
 }
const id = this.lastID;
db.run("COMMIT", (commitErr) => {
if (commitErr) return reject(commitErr);
resolve({
id,
name,
ticker,
 });
});
 }
 );
 });
},
update(name, ticker) {
return new Promise((resolve, reject) => {
db.run("BEGIN TRANSACTION");
db.run(
 "UPDATE currencies SET name = ? WHERE ticker = ?",
 [name, ticker],
function (err) {
if (err) {
db.run("ROLLBACK");
return reject(err);
}
const changes = this.changes;
db.run("COMMIT", (commitErr) => {
if (commitErr) return reject(commitErr);
resolve(changes);
 });
}
 );
});
},
delete(ticker) {
return new Promise((resolve, reject) => {
db.run("BEGIN TRANSACTION");
db.run(
"DELETE FROM currencies WHERE ticker = ?",
 [ticker],
 function (err) {
if (err) {
db.run("ROLLBACK");
return reject(err);
}
const changes = this.changes;
db.run("COMMIT", (commitErr) => {
if (commitErr) return reject(commitErr);
resolve(changes);
 });
}
 );
 });
 },
};