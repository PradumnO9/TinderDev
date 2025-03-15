const socket = require("socket.io");
const crypto = require("crypto");
const ChatModel = require("../models/chat");
const ConnectionRequestsModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const USER_SAFE_DATA =
  "firstName lastName imageUrl age about gender skills onlineStatus";

const getSecretRoomId = (loggedInUserId, targetUserId) => {
  crypto
    .createHash("sha256")
    .update([loggedInUserId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ loggedInUserId, targetUserId }) => {
      const roomId = getSecretRoomId(loggedInUserId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({
        firstName,
        lastName,
        imageUrl,
        loggedInUserId,
        targetUserId,
        newMessage,
      }) => {
        try {
          const roomId = getSecretRoomId(loggedInUserId, targetUserId);

          // check if loggedInUser and targetUser are friend or not

          const friend = await ConnectionRequestsModel.findOne({
            $or: [
              {
                fromUserId: loggedInUserId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: loggedInUserId,
                status: "accepted",
              },
            ],
          });
          if (!friend) {
            return res
              .status(400)
              .json({ message: "You both are not friends!" });
          }

          // save message to your DB
          let chat = await ChatModel.findOne({
            participants: { $all: [loggedInUserId, targetUserId] },
          });

          if (!chat) {
            chat = new ChatModel({
              participants: [loggedInUserId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: loggedInUserId,
            text: newMessage,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            imageUrl,
            newMessage,
            loggedInUserId,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});

    socket.on("loggedIn", async ({ loggedInUserId }) => {
      try {
        const verifyUser = await UserModel.findOne({ _id: loggedInUserId });
        verifyUser.onlineStatus = true;
        await verifyUser.save();
      } catch (err) {
        console.log(err.message);
      }
    });

    socket.on("loggedOut", async ({ loggedInUserId }) => {
      try {
        const verifyUser = await UserModel.findOne({ _id: loggedInUserId });
        verifyUser.onlineStatus = false;
        await verifyUser.save();
      } catch (err) {
        console.log(err.message);
      }
    });
  });
};

module.exports = initilizeSocket;
