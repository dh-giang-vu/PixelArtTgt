import { RawData, WebSocketServer, WebSocket } from "ws";
import UserManager from "./user";
import RoomManager from "./room";
import { IncomingMessage } from "http";
import { BufferLike } from "./types";

const roomManager = new RoomManager();
const userManager = new UserManager();

function initialiseWebSocketServer(wss: WebSocketServer) {
  wss.on('connection', (socket, request) => {

    const user = connectUser(socket, request);
    if (!user) {
      return;
    }
    const { userId, roomId, username } = user;

    socket.on('message', (rawData, isBinary) => {
      handleMessage(userId, rawData, isBinary);
    });

    socket.on('close', () => {
      const newImgChooser = roomManager.removeUserFromRoom(userId, roomId);
      userManager.deleteUser(userId);
      if (roomManager.getRoom(roomId)) {
        broadcastByRoom(roomId, JSON.stringify({ numOnline: roomManager.getNumUsersFromRoom(roomId) }));
      }

      if (newImgChooser) {
        const chooserSocket = userManager.getUserSocketById(newImgChooser);
        chooserSocket.send(JSON.stringify({ imgChooser: 1 }));
      }

      console.log(`${username} in room ${roomId} disconnected.`);
    });



  });
}

function broadcastByRoom(roomId: string, data: BufferLike, exclude=new Set<string>()) {
  const users = roomManager.getAllUsersFromRoom(roomId);

  users.forEach(userId => {
    if (!exclude.has(userId)) {
      userManager.getUserSocketById(userId).send(data);
    }
  });
}


function connectUser(socket: WebSocket, request: IncomingMessage) {
  const r = userManager.createUser(socket, request);
  if (!r) {
    return null;
  }
  roomManager.addUserToRoom(r.userId, r.roomId);

  if (roomManager.getImgChooserId(r.roomId) === r.userId) {
    socket.send(JSON.stringify({ imgChooser: 1 }));
  }
  else {
    socket.send(JSON.stringify({ imgChooser: 0 }));
    const image = roomManager.getRoomImage(r.roomId);
    const pixelMap = roomManager.getPixelMap(r.roomId);
    if (image && pixelMap) {
      console.log(`Room ${r.roomId} has image and pixel map`);
      socket.send(JSON.stringify({ pixelMap }));
      socket.send(image);
    }
  }

  // Notify other users
  broadcastByRoom(r.roomId, `User ${r.username} joined room ${r.roomId}.`);
  broadcastByRoom(r.roomId, JSON.stringify({ numOnline: roomManager.getNumUsersFromRoom(r.roomId) }));

  return r;
}


function handleMessage(userId: string, rawData: RawData, isBinary: boolean) {
  const user = userManager.getUserById(userId);
  console.log(`Received message from ${user.username}`);

  if (!(rawData instanceof Buffer)) {
    return;
  }


  if (isBinary) {
    console.log("Received binary data");
    const success = roomManager.setRoomImage(userId, user.roomId, rawData);

    if (success) {
      const roomId = user.roomId;
      const imgData = roomManager.getRoomImage(roomId);
      broadcastByRoom(roomId, imgData, new Set([user.userId]));
    }
  }
  else {
    // the only non-binary data we have are the color updates
    const updateString = rawData.toString();
    roomManager.updatePixelMap(user.roomId, updateString);
    broadcastByRoom(user.roomId, rawData.toString(), new Set([user.userId]));
  }

  console.log("======================");
  return null;
}


export default initialiseWebSocketServer;