import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.43.172:3000",
      "https://animated-shortbread-6f92ef.netlify.app",
    ],
  },
});

const port = process.env.PORT;
let users: { username: string; socketId: string }[] = [];

app.use(cors());

let caller = "";

io.on("connection", (socket) => {
  console.log("connected: ", socket.id);
  socket.emit("current-user", { user: users });
  socket.on("register", ({ username }) => {
    console.log("registering user: ", username);
    users.push({ username, socketId: socket.id });
    socket.emit("registered", { username, id: socket.id });
    io.emit("logged-in", { username });
  });

  // ANCHOR Take offer -> send to "To" user
  socket.on("calling", ({ from, offer, to }) => {
    console.log({ from, to, offer: offer.type });
    caller = from;
    const receivedUser = users.find((user) => user.username === to);
    if (receivedUser) {
      console.log("found user, sending offer", receivedUser);
      io.to(receivedUser.socketId).emit("incoming-call", { offer });
    } else {
      console.log("cant find user");
    }
  });

  socket.on("answering", ({ answer }) => {
    const receivedUser = users.find((user) => user.username === caller);
    if (receivedUser) {
      console.log(
        "accepting call from: " + receivedUser.username,
        "have socketId: ",
        receivedUser.socketId
      );
      io.to(receivedUser.socketId).emit("accepting-call", { answer });
    } else {
      console.log("cant find user");
    }
  });

  socket.on("clear", () => {
    users = [];
    console.log("cleared. user.length = ", users.length);
  });
});

app.get("*", (_, res) => {
  res.json({ ok: true });
});

httpServer.listen(port, () => {
  console.log("app listening on port: " + port);
});
