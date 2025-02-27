const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // Validation of data
    validateSignUpData(firstName, lastName, emailId, password);

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Creating a new instance of the user model
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("EmailId is not valid");
    }

    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Susseccfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;
