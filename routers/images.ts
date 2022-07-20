import imagesController from "../controllers/images";
import usersController from "../controllers/users";
import express from "express";

const router = express.Router();

router.post(
  "/create-image",
  usersController.readCookie,
  imagesController.uploadImage,
  imagesController.createImage
);

router.get("/download-image", imagesController.downloadImage);

router.get("/get-images", imagesController.getImages);

router.get(
  "/get-user-images",
  usersController.readCookie,
  imagesController.getImages
);

router.patch(
  "/update-image",
  usersController.readCookie,
  imagesController.uploadImage,
  imagesController.updateImage
);

router.delete(
  "/delete-image",
  usersController.readCookie,
  imagesController.deleteImage
);

export default router;
