const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./votos.db');

// Crear la tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY,
    cantidad INTEGER DEFAULT 0
  )`);

  // Insertar los 4 candidatos si no existen
  for (let i = 1; i <= 4; i++) {
    db.run(`INSERT OR IGNORE INTO votos (id, cantidad) VALUES (?, 0)`, [i]);
  }
});

module.exports = db;
