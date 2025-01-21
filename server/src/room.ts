type Room = {
  imgChooserId: string;
  imageData: ArrayBuffer | null;
  allUsers: Set<string>;
}

class RoomManager {
  private rooms: Record<string, Room> = {};

  addUserToRoom(userId: string, roomId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = { imgChooserId: userId, imageData: null, allUsers: new Set() };
    }
    this.rooms[roomId].allUsers.add(userId);
  }

  // return new imgChooserId if the old one has been removed && no image chosen
  removeUserFromRoom(userId: string, roomId: string) {
    const room = this.rooms[roomId];
    room.allUsers.delete(userId);

    // case room has 0 people left - delete room
    if (room.allUsers.size === 0) {
      delete this.rooms[roomId];
    }
    // case room has people but no image chosen - reassign imgChooser
    else if (room.imageData === null) {
      const [nextChooser] = room.allUsers;
      room.imgChooserId = nextChooser;
      return room.imgChooserId;
    }
    
    return null;
  }

  getAllUsersFromRoom(roomId: string) {
    return this.rooms[roomId].allUsers;
  }

  getImgChooserId(roomId: string) {
    return this.rooms[roomId].imgChooserId;
  }

  getRoomImage(roomId: string) {
    return this.rooms[roomId].imageData;
  }

  setRoomImage(userId: string, roomId: string, data: Buffer) {
    const room = this.rooms[roomId];
    if (room.imgChooserId !== userId) {
      return false;
    }
    room.imageData = data;
    return true;
  }
}

export default RoomManager;