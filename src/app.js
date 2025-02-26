const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const newUser = req.body;

  const user = new UserModel(newUser);

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving to user " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  const user = await UserModel.find({ emailId: userEmail });

  try {
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error saving to user " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  const allUsers = await UserModel.find({});

  try {
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Error saving to user " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // API level Validation known as data sanitization
    const ALLOWED_UPDATES = ["imageUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can't be more then 10");
    }
    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { data },
      { runValidators: true }
    );
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("DB not connected");
  });
