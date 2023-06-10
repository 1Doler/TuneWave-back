import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { loginValidation, registerValidation } from "./validations/auth.js";

import { FileController, UserController } from "./controllers/index.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("bd ok"))
  .catch(err => console.log(err));

const app = express();

app.use(express.json());

app.use((_, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.ORIGIN_URL || "http://localhost:3000"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("TuneWave");
});

app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/users", loginValidation, UserController.allUsers);
app.post("/auth/user", UserController.updateUser);
app.post("/auth/register", registerValidation, UserController.register);

app.post("/upload/:name/:folder", FileController.uploadFile);
app.get("/upload/", FileController.getUrlFile);

app.listen(process.env.PORT || 4444, err => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
