import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

const MessengerApi = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (req.method === "POST") {
    const io = res?.socket?.server?.io;
    if (io) {
      // get message
      const { socketId, event, message } = req.body;

      if (event === "join-room") {
        const { roomName } = message;
        io.in(socketId).socketsJoin(roomName);
      }

      if (event === "user-picked-a-card") {
        const { roomName, cardValue } = message;

        io.to(roomName).emit(event, {
          userId: socketId,
          value: cardValue,
        });
      }

      // return message
      res.status(201).json(message);
    } else {
      res.status(500).json("io not found");
    }
  }
};

export default MessengerApi;
