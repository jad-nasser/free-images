//importing modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import usersRouter from "./routers/users";
import imagesRouter from "./routers/images";

//initialising app
let app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//routers
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

//set static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//handling the routes that dont match any available routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
