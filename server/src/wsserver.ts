import { WebSocketServer, RawData } from "ws";
import UserManager from "./user";
import RoomManager from "./room";

const roomManager = new RoomManager();
const userManager = new UserManager();

function initialiseWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', function connection(socket, request) {

    const { userId, roomId, username } = userManager.createUser(socket, request);
    roomManager.addUserToRoom(userId, roomId);
  
    // Echo data back to users in the same room
    // socket.on('message', (data) => {
    //   broadcastByRoom(roomId, data)
    // });

    broadcastByRoom(roomId, `User ${username} joined room ${roomId}.`)
  
    socket.on('close', () => {
      roomManager.removeUserFromRoom(userId, roomId);
      userManager.deleteUser(userId);
  
      console.log(`${username} in room ${roomId} disconnected.`);
    });
  
  });
}

function broadcastByRoom(roomId: string, data: string) {
  const users = roomManager.getAllUsersFromRoom(roomId);

  users.forEach(userId => {
    userManager.getUserSocketById(userId).send(data);
  });
}

export default initialiseWebSocketServer;