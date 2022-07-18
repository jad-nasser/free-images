import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  firstName: { type: String, maxLength: 50, required: true },
  lastName: { type: String, maxLength: 50, required: true },
  email: { type: String, maxLength: 50, required: true },
  password: { type: String, maxLength: 100, required: true },
});

export default mongoose.model("Users", Schema);
