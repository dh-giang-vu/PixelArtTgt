import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import initialiseWebSocketServer from './wsserver';

const port = process.env.PORT || 8080;

const server = createServer();
const wss = new WebSocketServer({ server });

initialiseWebSocketServer(wss);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});