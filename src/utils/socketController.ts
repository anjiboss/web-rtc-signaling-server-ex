import { Server, Socket } from "socket.io";

const socketController = (socket: Socket, _io: Server) => {
  socket.on("calling", () => {
    socket.broadcast.emit("incoming-call");
  });

  socket.on("accept", () => {
    console.log("call-accepted", socket.id);
    socket.broadcast.emit("accepted");
  });

  socket.on("deny", () => {
    console.log("denied");
    socket.broadcast.emit("denied");
  });

  socket.on("send-offer", ({ offer }) => {
    console.log("send-offer", socket.id);
    socket.broadcast.emit("get-offer", { offer });
  });

  socket.on("send-answer", ({ answer }) => {
    console.log("send-answer");
    socket.broadcast.emit("answered", { answer });
  });

  socket.on("offer-send-candidate", ({ candidate }) => {
    console.log("offer send candidate");
    socket.broadcast.emit("add-offer-candidate", { offer: candidate });
  });

  socket.on("answer-send-candidate", ({ candidate }) => {
    console.log("answer-send-candidate");
    socket.broadcast.emit("add-answer-candidate", { answer: candidate });
  });
};
export default socketController;
