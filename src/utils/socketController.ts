import { Server, Socket } from "socket.io";

interface Room {
  roomName: string;
  users: string[];
}

const rooms: Room[] = [];

const socketController = (socket: Socket, _io: Server) => {
  socket.on("room-list", () => {
    socket.emit("rooms", { rooms });
  });

  socket.on("create-room", ({ roomName, user }) => {
    rooms.push({ roomName, users: [user] });
    socket.join(roomName);
    socket.broadcast.emit("new-room", { roomName, users: [user] });
    socket.emit("notify", { message: "new room created" });
  });

  socket.on("leave-room", ({ roomName, user }) => {
    console.log("leave-room", { roomName, user });
    rooms.forEach((r, i) => {
      if (r.roomName === roomName) {
        rooms[i].users = rooms[i].users.filter((u) => u !== user);
      }
    });
    socket.to(roomName).emit("user-leave-room", { user: user });
  });

  socket.on("join-room", ({ roomName, user }) => {
    socket.join(roomName);
    rooms.forEach((r, i) => {
      if (r.roomName === roomName) {
        rooms[i].users.push(user);
      }
    });
    socket.to(roomName).emit("user-join-room", { user: user });
    socket.emit("notify", { message: "Joined room" });
  });

  socket.on("calling", ({ roomName }) => {
    socket.to(roomName).emit("incoming-call");
  });

  socket.on("accept", ({ roomName }) => {
    console.log("call-accepted", socket.id);
    socket.to(roomName).emit("accepted");
  });

  socket.on("deny", ({ roomName }) => {
    console.log("denied");
    socket.to(roomName).emit("denied");
  });

  socket.on("send-offer", ({ offer, roomName }) => {
    console.log("send-offer", socket.id);
    socket.to(roomName).emit("get-offer", { offer });
  });

  socket.on("send-answer", ({ answer, roomName }) => {
    console.log("send-answer");
    socket.to(roomName).emit("answered", { answer });
  });

  socket.on("offer-send-candidate", ({ candidate, roomName }) => {
    console.log("offer send candidate");
    socket.to(roomName).emit("add-offer-candidate", { offer: candidate });
  });

  socket.on("answer-send-candidate", ({ candidate, roomName }) => {
    console.log("answer-send-candidate");
    socket.to(roomName).emit("add-answer-candidate", { answer: candidate });
  });
};

setInterval(() => {
  console.log(rooms);
}, 3000);

export default socketController;
