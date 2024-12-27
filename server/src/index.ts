import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import UserManager from './user';
import RoomManager from './room';

const port = process.env.PORT || 8080;

const server = createServer();
const wss = new WebSocketServer({ server });

const userManager = new UserManager();
const roomManager = new RoomManager();

wss.on('connection', function connection(socket, request) {

  const { userId, roomId } = userManager.createUser(socket, request);
  roomManager.addUserToRoom(userId, roomId);

  // Echo data back to user
  socket.on('message', (data) => {
    socket.send("Server: " + data);
  })

  socket.on('close', () => {
    roomManager.removeUserFromRoom(userId, roomId);
    userManager.deleteUser(userId);

    console.log(`${userId} in room ${roomId} disconnected.`);
  });

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});