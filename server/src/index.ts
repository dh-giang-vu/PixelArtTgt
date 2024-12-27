import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.PORT || 8080;

const server = createServer();
const wss = new WebSocketServer({ server });


wss.on('connection', function connection(socket, request) {

  const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);

  const username = requestUrl.searchParams.get('username');
  const roomId = requestUrl.searchParams.get('roomId');

  if (!username || !roomId) {
    socket.close(1003, "Missing username or roomId.");
    return;
  }

  const userId = uuidv4();
  socket.send(`Username: ${username}, UserId: ${userId}, Room: ${roomId}`);

  // Echo data back to user
  socket.on('message', (data) => {
    socket.send("Server: " + data);
  })

  socket.on('close', () => {
    console.log(`${username} disconnected.`);
  });

});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});