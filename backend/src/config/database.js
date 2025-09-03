const mongoose = require("mongoose");
const config = require("./config");
const logger = require("../controllers/loggerController");
const dbURL = config.db.url;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("mongodb is connected");
    mongoose.connection.on("error", (error) => {
      logger.log("error", "mongodb connection error: ", error);
    });
  } catch (error) {
    logger.log("error", "mongodb is not connected");
    logger.log("error", "mongodb is ", error.toString());
    process.exit(1);
  }
};

module.exports = connectDB;
