import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'

const Home: NextPage = () => {
  const router = useRouter()
  const [roomName, setRoomName] = useState<string>('');

  const handleGoToRoom = () => {
    if(!roomName) return
    router.push(roomName)
  }

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Form.Label htmlFor="roomName">Enter a room</Form.Label>
      <Form.Control
        type="text"
        id="roomName"
        aria-describedby="roomNameBlock"
        onChange={(event) => setRoomName(event.currentTarget.value)}
      />
      <Button variant="primary" onClick={() => handleGoToRoom()}>Go!</Button>
      <Form.Text id="roomNameBlock" muted>
        If your room doesn't exists, we will create automatically.
      </Form.Text>
    </Container>
  )
}

export default Home
