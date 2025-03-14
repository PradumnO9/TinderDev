const socket = require("socket.io");

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ loggedInUserId, targetUserId }) => {
      const roomId = [loggedInUserId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      ({
        firstName,
        lastName,
        imageUrl,
        loggedInUserId,
        targetUserId,
        newMessage,
      }) => {
        const roomId = [loggedInUserId, targetUserId].sort().join("_");
        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          imageUrl,
          newMessage,
          loggedInUserId,
        });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
