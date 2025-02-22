const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pradumn2999:zXW1CBmHA40hHYgL@tinderdev.jg0nh.mongodb.net/TinderDev"
  );
};

module.exports = connectDB;
