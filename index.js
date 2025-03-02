require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://192.168.11.202:8080",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ], // Specify the allowed origin(s)
    methods: ["GET", "POST"], // Specify the allowed HTTP methods
  },
});

const port = process.env.PORT || 3000;

const auth = require("#routes/auth");
const users = require("#routes/user");
const chats = require("#routes/chat");

const { isAuth, isAuthSocket } = require("#middlewares/auth");
const { STATUS_CODE } = require("#enums/status_code");

if (process.env.NODE_ENV === "development") {
  io.engine.on("initial_headers", (headers, req) => {
    headers["Access-Control-Allow-Origin"] = [
      "http://192.168.11.202:8080",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ];
    headers["Access-Control-Allow-Credentials"] = true;
  });

  io.engine.on("headers", (headers, req) => {
    headers["Access-Control-Allow-Origin"] = [
      "http://192.168.11.202:8080",
      "http://localhost:8080",
    ];
    headers["Access-Control-Allow-Credentials"] = true;
  });
}

io.use(isAuthSocket).on("connection", (socket) => {
  console.log("=============================\n=============================");
  console.log("client connected: ", socket.id);
  console.log("=============================\n=============================");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("send_message", ({ userId, msg }) => {
    io.to([userId, socket.id]).emit("receive_message", msg);
  });

  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
    socket.broadcast.to(userId).emit("userJoined", userId);
    // io.emit("joinUsRoom", userId);
    console.log(`${userId} joined the room`);
    console.log("===================\n===================");
  });

  socket.on("offer", ({ userId, offer }) => {
    socket.broadcast.to(userId).emit("offer", offer);
  });

  socket.on("answer", ({ userId, answer }) => {
    socket.broadcast.to(userId).emit("answer", answer);
  });

  socket.on("candidate", ({ userId, candidate }) => {
    socket.broadcast.to(userId).emit("candidate", candidate);
  });
});

app.use(
  cors({ origin: ["http://192.168.11.202:8080", "http://localhost:8080"] })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", isAuth, users);
app.use("/api/v1/chats", isAuth, chats);

app.use((req, res) => {
  res.status(STATUS_CODE.NOT_FOUND).json({ message: "Page Not Found!" });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Optionally, if you want to restrict the origins that can access your Socket.IO server:
// io.use((socket, next) => {
//   const allowedOrigins = ['http://192.168.11.202:8080']; // Add the origins you want to allow
//   const origin = socket.request.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     return next();
//   }
//   return next(new Error('Not allowed by CORS'));
// });
