const { validateSignUpData } = require("../utils/validation");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.signUp = async (req, res) => {
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
    res.json({ message: `${firstName} your accout created successfully.` });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.login = async (req, res) => {
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

      const { password, ...data } = user["_doc"];

      res.json({ message: "Login Successfull!", data: data });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!");
};
