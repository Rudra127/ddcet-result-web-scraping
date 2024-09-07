
import mongoose from "mongoose";

export const connectToMongo = async () => {
  const mongoURL = process.env.MONGO_URL; 

  // Establish the MongoDB connection
  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  db.once("open", () => {
    console.log("Connected to MongoDB on", mongoURL);
    return db;

    next();
  });
};

