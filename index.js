const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQLite
const dbPath = path.resolve(__dirname, 'votos.db');
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS votos (
      id INTEGER PRIMARY KEY,
      cantidad INTEGER DEFAULT 0
    )
  `);

  // Asegurarse de que existan los 5 candidatos (1 al 5)
  for (let i = 1; i <= 5; i++) {
    db.run(`INSERT OR IGNORE INTO votos (id, cantidad) VALUES (?, 0)`, [i]);
  }
});

// Ruta para obtener los votos
app.get('/votos', (req, res) => {
  db.all(`SELECT id, cantidad FROM votos`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const resultados = {};
    rows.forEach(row => {
      resultados[row.id] = row.cantidad;
    });
    res.json(resultados);
  });
});

// Ruta para registrar un voto
app.post('/votar', (req, res) => {
  const { id } = req.body;
  db.run(`UPDATE votos SET cantidad = cantidad + 1 WHERE id = ?`, [id], function (err) {
    if (err || this.changes === 0) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
