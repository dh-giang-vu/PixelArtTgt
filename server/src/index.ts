import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import initialiseWebSocketServer from './wsserver';
require("dotenv").config();

let port = process.env.PORT || 4000;

const server = createServer();

if (typeof port === "string") {
  port = parseInt(port);
}

const wss = new WebSocketServer({ server });


initialiseWebSocketServer(wss);

// Utility endpoint to wake up Render instance
// server.on('request', (req, res) => {
//   const url = req.url;
  
//   if (url === '/api/ping') {
//     res.write("Pong.");
//     res.end();
//   }
// });

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});