import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { connect } from "socket.io-client";

type Data = {
  roomName: string;
};

type Connection = {
  roomName: string;
  userName: string;
  isConnected: boolean;
}

type UserCard = {
  userId: string;
  value: string;
}

type MessageData = {
  socketId: string;
  event: string;
  message: object;
}

const RoomNamePage: NextPage<Data> = ({ roomName }) => {
  // connected flag
  const [connected, setConnected] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string>();

  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [card, setCard] = useState<number | string>(0)

  useEffect((): any => {
    if (roomName) {
      const socket = connect(process.env.BASE_URL || 'http://localhost:3000', {
        path: "/api/socketio",
      })

      // log socket connection
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!", socket.id);
        setSocketId(socket.id);
      });


      socket.on('user-joined-room', (user) => {
        if (user !== socket.id) {
          console.log('user-joined-room', { user })
        }
      })

      socket.on('users-list', (list) => {
        console.log('list', { list })
      })

      // update chat on new message dispatched
      socket.on("user-picked-a-card", (cardData: UserCard) => {
        if (cardData.userId === socket.id) {
          setCard(cardData.value);
        }
      });

      // socket disconnet onUnmount if exists
      if (socket) return () => socket.disconnect();
    }
  }, [roomName]);

  useEffect(() => {
    if (!socketId) return;
    setConnected(true);
    sendMessage('join-room', { roomName })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, socketId])

  const sendMessage = async (event: string, obj: object) => {
    if (!socketId) {
      console.error('invalid socketId:', socketId)
      return;
    }

    const message: MessageData = {
      socketId,
      event,
      message: obj
    }
    // dispatch message to api
    await fetch("/api/messenger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const pickACard = (cardValue: number) => {
    sendMessage('user-picked-a-card', { roomName, cardValue });
  }

  return (
    <>
      <h1>Hello {roomName}</h1>
      <Row className="mx-0">
        {values.map((value, index) => (
          <Button variant="primary" key={index} onClick={() => pickACard(value)}>{value}</Button>
        ))}
      </Row>
    </>
  )
}

export async function getStaticProps(context: any) {
  const { roomName } = context.params;

  return {
    props: { roomName }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

export default RoomNamePage;
