import { WebSocketServer } from 'ws';
import initialiseWebSocketServer from './wsserver';

const express = require('express')
const app = express()

require("dotenv").config();

let port = process.env.PORT || 4000;

if (typeof port === "string") {
  port = parseInt(port);
}

// Utility endpoint to wake up Render instance
// server.on('request', (req, res) => {
//   const url = req.url;
  
//   if (url === '/api/ping') {
//     res.write("Pong.");
//     res.end();
//   }
// });

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

initialiseWebSocketServer(wss);