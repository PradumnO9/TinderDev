const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const router = express.Router();

router.post("/send/:status/:touserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    // Validating the status
    const ALLOWED_STATUS = ["ignored", "interested"];
    if (!ALLOWED_STATUS.includes(status)) {
      return res
        .status(400)
        .json({ messgae: "Invalid status type: " + status });
    }

    // Valdate toUser exists or not
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }

    // If there is an existing ConnectionRequest
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection request is already exists!" });
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: `${req.user.firstName} is ${status} ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
