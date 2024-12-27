class RoomManager {
  private rooms: Record<string, Set<string>> = {};

  addUserToRoom(userId: string, roomId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = new Set();
    }
    this.rooms[roomId].add(userId);
  }

  removeUserFromRoom(userId: string, roomId: string) {
    this.rooms[roomId].delete(userId);
  }

  getAllUsersFromRoom(roomId: string) {
    return this.rooms[roomId];
  }
}

export default RoomManager;