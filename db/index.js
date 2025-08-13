require("dotenv").config();
const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("success connected to bd");
  } catch (error) {
    console.log(error.message);
  }
};

connect();

module.exports = mongoose.connection;