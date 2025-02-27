const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("DB not connected" + err.message);
  });
