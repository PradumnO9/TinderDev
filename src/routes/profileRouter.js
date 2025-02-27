const express = require("express");
const { userAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/userProfile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
