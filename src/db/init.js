const db = require("./database");
db.serialize(() => {
db.run(`
  CREATE TABLE IF NOT EXISTS currencies 
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE)
 `);
db.run(`
   CREATE TABLE IF NOT EXISTS currency_prices 
   (id INTEGER PRIMARY KEY AUTOINCREMENT,
   ticker TEXT NOT NULL UNIQUE,
   price REAL NOT NULL,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (ticker) 
   REFERENCES currencies(ticker)
   ON DELETE CASCADE)
`);
});
module.exports = db;