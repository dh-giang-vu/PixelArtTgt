import { WebSocket } from "ws";
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';

type User = {
  userId: string,
  username: string,
  roomId: string,
  socket: WebSocket
}

class UserManager {
  private users: Record<string, User> = {};

  createUser(socket: WebSocket, request: IncomingMessage) {
    // Extract username and roomId from request
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);
    const username = requestUrl.searchParams.get('username');
    const roomId = requestUrl.searchParams.get('roomId');

    // Guard username + roomId not null
    if (!username || !roomId) {
      socket.close(1003, "Missing username or roomId.");
      return;
    }

    // Generate uuid + add user
    const userId = uuidv4();
    this.users[userId] = {
      userId,
      username,
      roomId,
      socket
    }

    return { userId, roomId };
  }

  deleteUser(userId: string) {
    delete this.users[userId];
  }

  getUserById(userId: string) {
    return this.users[userId];
  }

}

export default UserManager;