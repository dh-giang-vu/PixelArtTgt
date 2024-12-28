import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import initialiseWebSocketServer from './wsserver';

require('dotenv').config();

const port = process.env.PORT || 4000;

const server = createServer();

server.on('request', (req, res) => {
  const url = req.url;
  
  // Utitlity endpoint to ping server
  if (url === '/api/ping') {
    res.writeHead(200);
    res.end('Pong.');
  }
  // Default response for non-specified routes
  else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// WebSocketServer
const wss = new WebSocketServer({ server });
initialiseWebSocketServer(wss);