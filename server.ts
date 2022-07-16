import app from "./app";
import dotenv from "dotenv";
dotenv.config();

app.listen(5000, () => {
  console.log("Connected to server at port 5000");
});
