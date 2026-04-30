const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log(`کاربر جدید وصل شد: ${socket.id}`);

 
  socket.on('user-join', (username) => {
 
    users.set(socket.id, {
      username: username,
      joinedAt: new Date()
    });

    socket.broadcast.emit('user-joined', {
      username: username,
      message: `${username} joined the chat`,
      time: new Date().toLocaleTimeString('fa-IR')
    });

    sendOnlineUsers();
    socket.emit('welcome', {
      message: `Welcome to the chatroom ${username}!`,
      users: Array.from(users.values()).map(u => u.username)
    });
  });


  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('new-message', {
        username: user.username,
        message: data.message,
        time: new Date().toLocaleTimeString('fa-IR'),
        id: socket.id
      });
    }
  });

  socket.on('typing-start', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username,
        isTyping: true
      });
    }
  });

  socket.on('typing-stop', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username,
        isTyping: false
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('user-left', {
        username: user.username,
        message: `${user.username} left the chat`,
        time: new Date().toLocaleTimeString('fa-IR')
      });   
      users.delete(socket.id);
      sendOnlineUsers();
    }
  });
});

function sendOnlineUsers() {
  const onlineUsers = Array.from(users.values()).map(u => u.username);
  io.emit('online-users', onlineUsers);
}

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(500)