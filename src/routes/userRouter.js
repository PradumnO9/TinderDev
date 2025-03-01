const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestsModel = require("../models/connectionRequest");

const router = express.Router();

// GET all the pending connection requests for the loggedIn user
router.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestsModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName imageUrl age about gender skills"
    );
    // .populate("fromUserId", ["firstName", "lastName"])

    res.json({
      message: `All connection requests for ${loggedInUser.firstName}`,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
