const express = require('express');
const bodyParser = require('body-parser');
//const { PrismaClient } = require('@prisma/client');
const WebSocket = require('ws');
const database = require("../../database");

//const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

// WebSocket 서버 생성
const wss = new WebSocket.Server({ noServer: true });

// 클라이언트와의 WebSocket 연결 관리
const clients = new Set();

// WebSocket 메시지 브로드캐스팅
const broadcast = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// WebSocket 서버와 Express 서버를 연결
app.server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request);
  });
});

// 채팅방 목록 조회
app.get('/chatrooms', async (req, res) => {
  try {
    const chatrooms = await database.chat.findMany();
    res.json(chatrooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chatrooms' });
  }
});

// 채팅방 생성
app.post('/chatrooms', async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const chatroom = await database.chat.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
      include: { post: true, user: true },
    });

    // 생성된 채팅방 정보 브로드캐스팅
    broadcast({ type: 'chatroomCreated', chatroom });

    res.json(chatroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chatroom' });
  }
});

// 채팅 메시지 전송
app.post('/chatrooms/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { userId, message } = req.body;
  try {
    const chatMessage = await database.chatMessage.create({
      data: {
        chat: { connect: { id } },
        user: { connect: { id: userId } },
        message,
      },
      include: { user: true },
    });

    // 전송된 메시지 정보 브로드캐스팅
    broadcast({ type: 'messageSent', chatMessage });

    res.json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send chat message' });
  }
});

// WebSocket 연결 관리
wss.on('connection', (socket) => {
  // 클라이언트 연결 시
  clients.add(socket);

  // 클라이언트로부터 메시지 수신 시
  socket.on('message', (message) => {
    // 메시지 브로드캐스팅
    broadcast(message);
  });

  // 클라이언트 연결 해제 시
  socket.on('close', () => {
    clients.delete(socket);
  });
});