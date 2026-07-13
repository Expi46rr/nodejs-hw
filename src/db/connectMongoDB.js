import mongoose from "mongoose";
import { Note } from "../models/note.js";
export const connectMongoDB = async () => {
  try {  const url = process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log( "✅ MongoDB connection established successfully");
 await Note.syncIndexes();

  } catch (error) {
console.log("Ooop, error with conndection", error);

    process.exit(1);
  }

 };
