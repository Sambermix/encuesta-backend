const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQLite (se crea si no existe)
const db = new sqlite3.Database('votos.db');

// Crear tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY,
    cantidad INTEGER DEFAULT 0
  )`);

  // Insertar los 5 candidatos si no existen
  for (let i = 1; i <= 5; i++) {
    db.get("SELECT * FROM votos WHERE id = ?", [i], (err, row) => {
      if (!row) {
        db.run("INSERT INTO votos (id, cantidad) VALUES (?, 0)", [i]);
      }
    });
  }
});

// Obtener los votos
app.get('/votos', (req, res) => {
  db.all("SELECT * FROM votos", (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    const resultados = {};
    rows.forEach(row => {
      resultados[row.id] = row.cantidad;
    });
    res.json(resultados);
  });
});

// Registrar un voto
app.post('/votar', (req, res) => {
  const { id } = req.body;
  db.get("SELECT * FROM votos WHERE id = ?", [id], (err, row) => {
    if (row) {
      db.run("UPDATE votos SET cantidad = cantidad + 1 WHERE id = ?", [id], (err2) => {
        if (err2) {
          console.error(err2);
          return res.sendStatus(500);
        }
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
