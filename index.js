// index.js
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // WebSocket ON

const PORT = process.env.PORT || 443;

// Manejamos WebSocket
wss.on('connection', ws => {
  console.log('🔌 Cliente WebSocket conectado');

  ws.on('message', msg => {
    // Aquí puedes reenviar, guardar, etc.
    console.log('📦 Audio recibido (WebSocket)');
    // Por ejemplo: reenviar a todos los demás
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(msg);
      }
    });
  });
});

// Mantén los endpoints HTTP existentes
app.use(express.json());
app.post('/chunk-update', (req, res) => {
  // lógica original
});
app.get('/nearby', (req, res) => {
  // lógica original
});

server.listen(PORT, () => {
  console.log(`🚀 Server corriendo en puerto ${PORT}`);
});
