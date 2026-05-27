const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://codesync-livid.vercel.app'],
    methods: ['GET', 'POST'],
  },
});

const roomCode = {};
const roomMembers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.name = name;

    if (!roomMembers[roomId]) {
      roomMembers[roomId] = [];
    }
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    roomMembers[roomId].push({ id: socket.id, name, color });

    if (roomCode[roomId]) {
      socket.emit('code-update', roomCode[roomId]);
    }

    io.to(roomId).emit('members-update', roomMembers[roomId]);
    console.log(`${name} joined room ${roomId}`);
  });

socket.on('code-change', ({ roomId, code }) => {
    roomCode[roomId] = code;
    socket.to(roomId).emit('code-update', code);
  });

  socket.on('output-update', ({ roomId, output }) => {
    socket.to(roomId).emit('output-update', output);
  });


  socket.on('disconnect', () => {
    const { roomId, name } = socket;
    if (roomId && roomMembers[roomId]) {
      roomMembers[roomId] = roomMembers[roomId].filter(
        (m) => m.id !== socket.id
      );
      io.to(roomId).emit('members-update', roomMembers[roomId]);
      console.log(`${name} left room ${roomId}`);
    }
  });
});

server.listen(5001, () => {
  console.log('Server running on port 5001');
});