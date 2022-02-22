import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketIO = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    const rooms: {[roomName: string]: [roomClient: string][]} = {};

    io.on("connection", (socket) => {
      console.log(`${socket.id} connected.`);

      let currentRoomId: any;
      socket.on("join-room", (roomId) => {
        currentRoomId = roomId;
      });

      socket.on("disconnect", () => {
        socket.broadcast.in(currentRoomId).emit("users-list", socket.id);
      });
    });

    io.of("/").adapter.on("create-room", (room) => {
      rooms[room] = [];
    });
    
    io.of("/").adapter.on("join-room", (room, id) => {
      rooms[room] = [...rooms[room], id];
      io.in(room).emit("users-list", rooms[room]);
    });

    io.of("/").adapter.on("leave-room", (room, id) => {
      rooms[room] = rooms[room].filter(client => client !== id);
      io.in(room).emit("users-list", rooms[room]);
    });

    io.of("/").adapter.on("delete-room", (room) => {
      delete rooms[room]
      console.log(rooms);
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketIO;
