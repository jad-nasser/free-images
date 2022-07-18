import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: { type: String, maxLength: 50, required: true },
  numberOfDownloads: { type: Number, default: 0 },
  filePath: { type: String, maxLength: 100, required: true },
  resolution: { type: String, maxLength: 50, required: true },
  userId: { type: String, maxLength: 100, required: true },
});

export default mongoose.model("Images", Schema);
