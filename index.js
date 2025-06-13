const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Crear o abrir la base de datos
const db = new sqlite3.Database('./votos.db');

// Crear la tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS votos (
    id INTEGER PRIMARY KEY,
    cantidad INTEGER
  )`);

  // Inicializar con 5 candidatos (id del 1 al 5)
  for (let i = 1; i <= 5; i++) {
    db.run(
      `INSERT OR IGNORE INTO votos (id, cantidad) VALUES (?, ?)`,
      [i, 0]
    );
  }
});

// Obtener votos
app.get('/votos', (req, res) => {
  db.all('SELECT * FROM votos', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const resultado = {};
    rows.forEach(row => {
      resultado[row.id] = row.cantidad;
    });
    res.json(resultado);
  });
});

// Votar
app.post('/votar', (req, res) => {
  const { id } = req.body;
  if (!id || id < 1 || id > 5) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  db.run(
    'UPDATE votos SET cantidad = cantidad + 1 WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.sendStatus(200);
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
