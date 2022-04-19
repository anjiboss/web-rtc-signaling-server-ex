import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketController from "./utils/socketController";
import { groupCall } from "./utils/groupCall";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3030",
      "http://192.168.43.172:3000",
      "https://wondrous-griffin-3c9360.netlify.app",
      "https://marvelous-zabaione-016be3.netlify.app",
    ],
  },
});

const port = process.env.PORT || 5050;
app.use(cors());

io.on("connection", (socket) => {
  socketController(socket, io);
  groupCall(socket, io);
});

app.get("*", (_, res) => {
  res.json({ ok: true });
});

httpServer.listen(port, () => {
  console.log("app listening on port: " + port);
});
