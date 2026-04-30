Socket.IO Chatroom Backend
A real-time chatroom backend built with Express.js and Socket.IO. Supports online users list, typing indicators, join/leave notifications, and Persian time formatting.

Features
Real-time messaging with timestamps

Online users list (live updates)

Join/leave notifications

Typing indicators

CORS enabled for cross-origin requests

Welcome message for new users

Tech Stack
Node.js

Express.js

Socket.IO

CORS

bash
node server.js
The server will run on http://localhost:5000

Socket.IO Events
Client → Server (Emit)
Event	Description	Payload
user-join	User joins the chat	{ username: string }
send-message	Send a message	{ message: string }
typing-start	User starts typing	(empty)
typing-stop	User stops typing	(empty)
Server → Client (Listen)
Event	Description	Payload
welcome	Personal welcome message	{ message, users: [] }
user-joined	New user joined	{ username, message, time }
user-left	User left the chat	{ username, message, time }
new-message	New chat message	{ username, message, time, id }
user-typing	Typing status	{ username, isTyping }
online-users	Current online users list	[username1, username2]
Connecting from a Client
Vanilla JavaScript (Browser)
html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:500');
  
  // Join chat
  socket.emit('user-join', 'YourUsername');
  
  // Send message
  socket.emit('send-message', { message: 'Hello everyone!' });

  // Listen for messages
  socket.on('new-message', (data) => {
    console.log(`${data.username}: ${data.message}`);
  });
</script>



javascript
server.listen(5000)  // Change to any port you prefer
Update CORS Settings
Modify the cors object in server.js:

javascript
cors: {
  origin: "http://localhost:3000", // Your frontend URL
  methods: ["GET", "POST"]
}

Project Structure

text
socketio-express-public-chatroom/
├── server.js          # Main server file
├── package.json       # Dependencies
└── README.md          # Documentation

npm run dev