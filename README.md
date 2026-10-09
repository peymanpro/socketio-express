# Express + Socket.IO Chat Backend

A small real-time public-chat backend built with Express and Socket.IO. It demonstrates event-driven messaging, connection-scoped presence, typing indicators, input validation, configurable browser origins, and a health endpoint.

## Features

- Public chat events: join, welcome, messages, presence, join/leave notices, and typing indicators.
- Server-side validation for display names and message content.
- Each message receives a unique ID; IDs are not reused across all messages sent by one connection.
- Clients must join before publishing chat messages.
- Browser origins are configurable through `CHAT_ALLOWED_ORIGINS`.
- `GET /health` provides a lightweight health check.
- Importing the server module does not start a listener, so tests can create isolated instances.

## Requirements

- Node.js 20 or later
- npm

## Run locally

```bash
npm ci
npm run dev
```

The server listens on `http://localhost:5000` by default. Set `PORT` to change the listener port.

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{"status":"ok"}
```

This repository contains the backend only. Use a separate Socket.IO client application and point it at this server.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | HTTP and Socket.IO listener port |
| `CHAT_ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated permitted browser origins |

For example: `CHAT_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`. Configure only trusted frontend origins in deployed environments. CORS is not authentication; this sample does not implement user identity or authorization.

## Socket.IO event contract

| Direction | Event | Payload |
| --- | --- | --- |
| Client → server | `user-join` | `string username` |
| Client → server | `send-message` | `{ message: string }` |
| Client → server | `typing-start` | no payload |
| Client → server | `typing-stop` | no payload |
| Server → client | `welcome` | `{ message, users: string[] }` |
| Server → client | `user-joined` | `{ username, message, time }` |
| Server → client | `user-left` | `{ username, message, time }` |
| Server → client | `new-message` | `{ username, message, time, id }` |
| Server → client | `online-users` | `string[]` |
| Server → client | `user-typing` | `{ username, isTyping }` |
| Server → client | `chat-error` | `{ code, message }` |

Display names are trimmed and limited to 32 characters. Messages are trimmed and limited to 2,000 characters. Empty values, control characters, invalid payload types, and messages sent before joining are rejected through `chat-error`.

### Browser example

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
socket.emit("user-join", "Ada");
socket.on("welcome", (data) => console.log(data.message));
socket.emit("send-message", { message: "Hello everyone!" });
socket.on("new-message", (message) => console.log(message.id, message.username, message.message));
socket.on("chat-error", (error) => console.error(error.code, error.message));
```

## Quality checks

```bash
npm run check
npm test
```

Tests use Node's built-in test runner and cover input validation and the HTTP health endpoint. GitHub Actions runs syntax checks and tests on pushes and pull requests.

## Limitations

This is an in-memory demonstration, not a production chat service. Presence is lost on restart, multiple server instances do not share state, and the application has no authentication, persistence, distributed adapter, or rate limiter. Add these before exposing the service to untrusted users.
