import app from "./app";
import { connect } from "./dbConnection";
import dotenv from "dotenv";
dotenv.config();

app.listen(5000, () => {
  console.log("Connected to server at port 5000");
  connect("free-images");
});
