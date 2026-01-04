import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

export default function connectDb() {
  try{
    mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  }catch(error){
    console.error("MongoDB connection error:", error);
  }
}
