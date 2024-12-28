import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import initialiseWebSocketServer from './wsserver';

const port = process.env.PORT || 4000;
const server = createServer();

// Utility endpoint to wake up Render instance
// server.on('request', (req, res) => {
//   const url = req.url;
  
//   if (url === '/api/ping') {
//     res.write("Pong.");
//     res.end();
//   }
// });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

initialiseWebSocketServer(wss);