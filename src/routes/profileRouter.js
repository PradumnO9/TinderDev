const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/view", userAuth, profileController.view);

router.put("/edit", userAuth, profileController.edit);

module.exports = router;
