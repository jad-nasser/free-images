import mongoose from "mongoose";

export const connect = async (databaseName: string) => {
  try {
    await mongoose.connect("mongodb://localhost:27017/" + databaseName);
    console.log("Connected to database: " + databaseName);
  } catch (err) {
    console.log(err);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};
