const express = require("express");
const chatController = require("../controllers/chatController");
const { userAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/:targetUserId", userAuth, chatController.getChat);

module.exports = router;
