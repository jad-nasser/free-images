import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connect } from "./dbConnection";

app.listen(5000, () => {
  console.log("Connected to server at port 5000");
  connect("free-images");
});
