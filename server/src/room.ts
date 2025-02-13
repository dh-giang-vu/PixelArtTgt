type Room = {
  imgChooserId: string;
  imageData: ArrayBuffer | null;
  pixelMap: any[][] | null;
  allUsers: Set<string>;
}

class RoomManager {
  private rooms: Record<string, Room> = {};

  addUserToRoom(userId: string, roomId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = { imgChooserId: userId, imageData: null, pixelMap: null, allUsers: new Set() };
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

  getRoom(roomId: string) {
    return this.rooms[roomId];
  }

  getAllUsersFromRoom(roomId: string) {
    return this.rooms[roomId].allUsers;
  }

  getNumUsersFromRoom(roomId: string) {
    return this.rooms[roomId].allUsers.size;
  }

  getImgChooserId(roomId: string) {
    return this.rooms[roomId].imgChooserId;
  }

  getRoomImage(roomId: string) {
    return this.rooms[roomId].imageData;
  }

  getPixelMap(roomId: string) {
    return this.rooms[roomId].pixelMap;
  }

  updatePixelMap(roomId: string, updateString: string) {
    const updateJson = JSON.parse(updateString);
    const { x, y, c } = updateJson;
    this.rooms[roomId].pixelMap[x][y] = { r: c[0], g: c[1], b: c[2] };
  }

  setRoomImage(userId: string, roomId: string, data: Buffer) {
    const room = this.rooms[roomId];
    if (room.imgChooserId !== userId) {
      return false;
    }
    const lengthX = data[1] | (data[2] << 8);
    const lengthY = data[3] | (data[4] << 8);
    room.pixelMap = Array.from({ length: lengthX }, () => new Array(lengthY).fill(null));

    room.imageData = data;
    return true;
  }
}

export default RoomManager;