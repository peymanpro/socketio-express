Socket.IO Chatroom Backend
A real-time chatroom backend built with Express.js and Socket.IO. Supports online users list, typing indicators, join/leave notifications, and Persian time formatting.

Features
Real-time messaging with timestamps

Online users list (live updates)

Join/leave notifications

Typing indicators

Persian time format (fa-IR)

CORS enabled for cross-origin requests

Welcome message for new users

Tech Stack
Node.js

Express.js

Socket.IO

CORS

Installation
Clone the repository:

bash
git clone https://github.com/peymanpro/socketio-express-public-chatroom.git
cd socketio-express-public-chatroom
Install dependencies:

bash
npm install express socket.io
Start the server:

bash
node server.js
The server will run on http://localhost:500

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
React
javascript
import io from 'socket.io-client';

const socket = io('http://localhost:500');

socket.emit('user-join', 'John');
socket.on('new-message', (data) => console.log(data));
Node.js (Testing)
javascript
const io = require('socket.io-client');
const socket = io('http://localhost:500');

socket.on('connect', () => {
  socket.emit('user-join', 'Tester');
  socket.emit('send-message', { message: 'Hello from test!' });
});
Testing with Multiple Users
Open multiple browser tabs

Join with different usernames

Send messages – all tabs receive them in real-time

Check online users list updates automatically

Configuration
Change Port
Edit the last line in server.js:

javascript
server.listen(500)  // Change to any port you prefer
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
Troubleshooting
Issue	Solution
Port already in use	Change the port number in server.listen()
CORS error	Update the origin field in CORS configuration
Socket connection fails	Check if server is running on correct port
Users not showing online	Ensure sendOnlineUsers() is called after user joins
Deployment
Deploy to Render / Railway / Heroku
Push code to GitHub

Connect repository to your hosting platform

Set start command: node server.js

Set environment variable if needed: PORT=500

Using PM2 (Production process manager)
bash
npm install -g pm2
pm2 start server.js --name chatroom-backend
pm2 save
pm2 startup
License
MIT

Built for learning and production use

This text focuses only on documentation and usage – no code explanations inside. Just copy and paste it into your README.md file.