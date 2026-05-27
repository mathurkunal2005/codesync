const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://codesync-livid.vercel.app'],
    methods: ['GET', 'POST'],
  },
});

// Store code and members for each room
const roomCode = {};
const roomMembers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a room
  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.name = name;

    // Add member to room
    if (!roomMembers[roomId]) {
      roomMembers[roomId] = [];
    }
    roomMembers[roomId].push({ id: socket.id, name });

    // Send existing code to new user
    if (roomCode[roomId]) {
      socket.emit('code-update', roomCode[roomId]);
    }

    // Broadcast updated members list to everyone in room
    io.to(roomId).emit('members-update', roomMembers[roomId]);
    console.log(`${name} joined room ${roomId}`);
  });

  // User types code
  socket.on('code-change', ({ roomId, code }) => {
    roomCode[roomId] = code;
    socket.to(roomId).emit('code-update', code);
  });

  // User disconnects
  socket.on('disconnect', () => {
    const { roomId, name } = socket;
    if (roomId && roomMembers[roomId]) {
      // Remove member from room
      roomMembers[roomId] = roomMembers[roomId].filter(
        (m) => m.id !== socket.id
      );
      // Broadcast updated members list
      io.to(roomId).emit('members-update', roomMembers[roomId]);
      console.log(`${name} left room ${roomId}`);
    }
  });
});

server.listen(5001, () => {
  console.log('Server running on port 5001');
});