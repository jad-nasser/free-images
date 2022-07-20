import usersController from "../controllers/users";
import express from "express";

const router = express.Router();

router.post("/create-user", usersController.createUser);

router.post("/sign-in", usersController.signIn);

router.delete("/sign-out", usersController.signOut);

router.get(
  "/check-login",
  usersController.readCookie,
  usersController.checkLogin
);

router.get(
  "/get-user-info",
  usersController.readCookie,
  usersController.getUserInfo
);

router.patch(
  "/update-user",
  usersController.readCookie,
  usersController.updateUser
);

router.delete(
  "/delete-user",
  usersController.readCookie,
  usersController.deleteUser
);

export default router;
