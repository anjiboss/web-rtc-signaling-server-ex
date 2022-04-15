import { Server, Socket } from "socket.io";

const socketController = (socket: Socket, _io: Server) => {
  socket.on("send-offer", ({ offer }) => {
    console.log("send-offer");
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
    socket.broadcast.emit("add-answer-candidate", { answer: candidate });
  });
};
export default socketController;
