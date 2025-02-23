const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json())

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
