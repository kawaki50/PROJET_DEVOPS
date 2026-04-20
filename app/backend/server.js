const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Route de santé (pour les health checks)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Route principale
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend2 postgres DevOps fonctionnel 100%!',
    db_host: process.env.DB_HOST || 'non configuré'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur le port ${PORT}`);
});