const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Registro de votos
const votos = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0
};

// Registro de IPs que ya votaron
const ipVotantes = new Set();

// Ruta para ver los votos
app.get('/votos', (req, res) => {
  res.json(votos);
});

// Ruta para votar
app.post('/votar', (req, res) => {
  const ip = req.ip; // IP del votante

  if (ipVotantes.has(ip)) {
    // Si ya votó desde esta IP
    return res.status(403).json({ mensaje: 'Ya has votado desde esta IP.' });
  }

  const { id } = req.body;
  if (votos.hasOwnProperty(id)) {
    votos[id]++;
    ipVotantes.add(ip); // Guarda la IP
    return res.sendStatus(200);
  }

  res.sendStatus(400);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
