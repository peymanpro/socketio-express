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

// ذخیره کاربران آنلاین
const users = new Map(); // socket.id -> { username, joinedAt }

io.on('connection', (socket) => {
  console.log(`کاربر جدید وصل شد: ${socket.id}`);

  // کاربر وارد چت می‌شود
  socket.on('user-join', (username) => {
    // ذخیره اطلاعات کاربر
    users.set(socket.id, {
      username: username,
      joinedAt: new Date()
    });

    // اعلام به همه (به جز خودش) که کاربر جدید آمد
    socket.broadcast.emit('user-joined', {
      username: username,
      message: `${username} به چت ملحق شد 🎉`,
      time: new Date().toLocaleTimeString('fa-IR')
    });

    // ارسال لیست کاربران آنلاین به همه
    sendOnlineUsers();

    // ارسال پیام خوش‌آمدگویی فقط به خود کاربر
    socket.emit('welcome', {
      message: `به چت‌روم خوش آمدی ${username}!`,
      users: Array.from(users.values()).map(u => u.username)
    });
  });

  // دریافت پیام جدید
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      // پخش پیام به همه کلاینت‌ها
      io.emit('new-message', {
        username: user.username,
        message: data.message,
        time: new Date().toLocaleTimeString('fa-IR'),
        id: socket.id
      });
    }
  });

  // کاربر در حال تایپ کردن است
  socket.on('typing-start', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username,
        isTyping: true
      });
    }
  });

  // کاربر تایپ را متوقف کرد
  socket.on('typing-stop', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username,
        isTyping: false
      });
    }
  });

  // کاربر قطع اتصال
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // اعلام خروج کاربر
      io.emit('user-left', {
        username: user.username,
        message: `${user.username} چت را ترک کرد 👋`,
        time: new Date().toLocaleTimeString('fa-IR')
      });
      
      // حذف از لیست کاربران
      users.delete(socket.id);
      
      // به‌روزرسانی لیست کاربران آنلاین
      sendOnlineUsers();
    }
  });
});

// تابع ارسال لیست کاربران آنلاین
function sendOnlineUsers() {
  const onlineUsers = Array.from(users.values()).map(u => u.username);
  io.emit('online-users', onlineUsers);
}

// سرویس فایل‌های استاتیک (برای production)
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(500)