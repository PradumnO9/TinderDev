const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestController = require("../controllers/requestController");

const router = express.Router();

router.post("/send/:status/:touserId", userAuth, requestController.sendRequest);

router.post(
  "/review/:status/:requestId",
  userAuth,
  requestController.reviewRequest
);

module.exports = router;
