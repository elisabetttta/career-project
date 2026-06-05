const db = require("./database");
db.serialize(() => {
db.run("DELETE FROM currencies");
db.run(`
  CREATE TABLE IF NOT EXISTS currencies 
  (id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE
  )
  `);
});
module.exports = db;