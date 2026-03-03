const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in backend/.env");
  }

  try {
    await mongoose.connect(mongoUri);
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err?.message || err}`);
  }
}

module.exports = connectDB;
