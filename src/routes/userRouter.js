const express = require("express");
const { userAuth } = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

// GET all the pending connection requests for the loggedIn user
router.get("/requests/received", userAuth, userController.requestsReceived);

// Getting all the accepted connection requests for the loggedIn user
router.get("/connections", userAuth, userController.allConnections);

// User feed
router.get("/feed", userAuth, userController.userFeed);

module.exports = router;
