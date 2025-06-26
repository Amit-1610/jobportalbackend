const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,      // Only needed for Mongoose < 6.x
      // useFindAndModify: false    // Only needed for Mongoose < 6.x
    });
    console.log("✔ MongoDB connected successfully");
  } catch (error) {
    console.error("✖ MongoDB connection failed: ", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
