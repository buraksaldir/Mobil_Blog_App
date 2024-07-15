const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "Connected To DATABASE"
    );
  } catch (error) {
    console.log(`error in connection DB ${error}`);
  }
};

module.exports = connectDB;
