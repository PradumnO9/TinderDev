const express = require("express");

const app = express();

app.use("/dev", (req, res) => {
  res.send("Hello from TinderDev!!!");
});

app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});
