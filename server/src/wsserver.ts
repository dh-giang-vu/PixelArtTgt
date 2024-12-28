import { RawData, WebSocketServer, WebSocket } from "ws";
import UserManager from "./user";
import RoomManager from "./room";
import { IncomingMessage } from "http";
import { isCoordinate } from "./utils";

const roomManager = new RoomManager();
const userManager = new UserManager();

function initialiseWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', (socket, request) => {

    const { userId, roomId, username } = connectUser(socket, request);

    socket.on('message', (rawData) => {
      handleMessage(userId, rawData);
    });
  
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

function getJsonFromRawData(rawData: RawData) {
  let data = null;
  try {
    data = JSON.parse(rawData.toString());
  }
  catch (error) {
    return null;
  }
  return data;
}

function connectUser(socket: WebSocket, request: IncomingMessage) {
  const r = userManager.createUser(socket, request);
  roomManager.addUserToRoom(r.userId, r.roomId);

  // Notify other users
  broadcastByRoom(r.roomId, `User ${r.username} joined room ${r.roomId}.`);

  return r;
}

function disconnectUser(userId: string) {
  const socket = userManager.getUserSocketById(userId);
  socket.send("Server disconnecting.");
  socket.close();
}

function handleMessage(userId: string, rawData: RawData) {
  const data = getJsonFromRawData(rawData);
  const user = userManager.getUserById(userId);

  if (!data) {
    user.socket.send('Failed to convert data to JSON.');
    disconnectUser(userId);
    return;
  }

  if (isCoordinate(data)) {
    broadcastByRoom(user.roomId, `User ${user.username} coordinate: ${JSON.stringify(data)}`);
  }
  else {
    user.socket.send('Not Coordinate');
  }
  
}

export default initialiseWebSocketServer;