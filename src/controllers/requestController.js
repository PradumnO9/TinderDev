const ConnectionRequestsModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const sendEmail = require("../utils/sendEmail");

exports.sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.touserId;

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
    const existingConnectionRequest = await ConnectionRequestsModel.findOne({
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

    const connectionRequest = new ConnectionRequestsModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    if (status === "interested") {
      await sendEmail.run(
        `A new connection request from ${req.user.firstName} ${req.user.lastName}`,
        `${req.user.firstName} ${req.user.lastName} is ${status} in ${toUser.firstName} ${toUser.lastName}`
      );
    }

    res.json({
      message: `${req.user.firstName} is ${status} ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.reviewRequest = async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Status Not Allowed!" });
    }

    const connectionRequest = await ConnectionRequestsModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found!" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      message: `${loggedInUser.firstName} ${status} your connection request.`,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
