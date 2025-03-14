const ChatModel = require("../models/chat");

exports.getChat = async (req, res) => {
  try {
    const { targetUserId } = req.params;

    const loggedInUserId = req.user._id;

    let chat = await ChatModel.findOne({
      participants: { $all: [loggedInUserId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName imageUrl",
    });

    if (!chat) {
      chat = new ChatModel({
        participants: [loggedInUserId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
