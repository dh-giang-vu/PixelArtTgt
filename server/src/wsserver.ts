import { WebSocketServer } from "ws";
import UserManager from "./user";
import RoomManager from "./room";

const roomManager = new RoomManager();
const userManager = new UserManager();

function initialiseWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', function connection(socket, request) {

    const { userId, roomId } = userManager.createUser(socket, request);
    roomManager.addUserToRoom(userId, roomId);
  
    // Echo data back to user
    socket.on('message', (data) => {
      socket.send("Server: " + data);
    });
  
    socket.on('close', () => {
      roomManager.removeUserFromRoom(userId, roomId);
      userManager.deleteUser(userId);
  
      console.log(`${userId} in room ${roomId} disconnected.`);
    });
  
  });
}

export default initialiseWebSocketServer;