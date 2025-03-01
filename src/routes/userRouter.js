const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestsModel = require("../models/connectionRequest");

const router = express.Router();

const USER_SAFE_DATA = "firstName lastName imageUrl age about gender skills";

// GET all the pending connection requests for the loggedIn user
router.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestsModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // .populate("fromUserId", ["firstName", "lastName"])

    res.json({
      message: `All connection requests for ${loggedInUser.firstName}`,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestsModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

      // console.log(connectionRequests)

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
