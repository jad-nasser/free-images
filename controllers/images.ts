//importing modules
import imagesDBController from "../database-controllers/images";
import fs from "fs/promises";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import imageSize from "../imageSize";
import _ from "lodash";

//interfaces
interface IImage {
  name: string;
  resolution: string;
  userId: string;
  filePath: string;
}
interface ISearchInfo {
  name?: RegExp;
  userId?: string;
  _id?: string;
}
interface IUpdateInfo {
  name?: string;
  filePath?: string;
  resolution?: string;
}

//------------------------------------------------------------------------------------------

//this is a middleware used when the user wants a create a new image item or when the user wants to
//update the image file
const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  //setting up multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) =>
      cb(null, Date.now().toString() + file.originalname),
    destination: (req, file, cb) => cb(null, "./uploads"),
  });
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.includes("image")) {
        if (file.mimetype.includes("gif"))
          cb(new Error("GIF images not allowed"));
        else cb(null, true);
      } else cb(new Error("The file should be an image"));
    },
    limits: { fileSize: 1024 * 1024 * 20 },
  }).single("image-file");
  //calling the upload function to upload the image file
  upload(req, res, (err: any) => {
    if (err) return res.status(500).json(err);
    next();
    return true;
  });
};

//--------------------------------------------------------------------------------------

const downloadImage = async (req: Request, res: Response) => {
  //checking if the image id exists in the request
  if (!req.query.id) return res.status(404).send("Image id not found");
  let imageId = req.query.id as string;
  //getting the image from the database, incrementing its numberOfDownloads field and download it
  try {
    let foundImages = await imagesDBController.getImages({ _id: imageId });
    if (foundImages.length === 0)
      return res.status(404).send("Image not exists");
    await imagesDBController.incrementImage(imageId);
    let foundImage = foundImages[0];
    res.download(foundImage.filePath);
    return true;
  } catch (error) {
    return res.status(500).json(error);
  }
};

//--------------------------------------------------------------------------------------------------

const createImage = async (req: Request, res: Response): Promise<Response> => {
  //checking if the inputs are found and gathering them
  if (!req.body.name) return res.status(404).send("Image name not found");
  if (!req.file) return res.status(404).send("Image file not found");
  let resolutionText = "";
  try {
    let resolution = imageSize.sizeOf(req.file.path);
    resolutionText = resolution.width + "x" + resolution.height;
  } catch (error) {
    return res.status(500).json(error);
  }
  let imageInfo: IImage = {
    name: req.body.name,
    userId: (req as any).user.id,
    filePath: req.file.path,
    resolution: resolutionText,
  };
  //adding the image item to the database
  try {
    await imagesDBController.createImage(imageInfo);
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).send("Image successfully created");
};

//-------------------------------------------------------------------------------------

const getImages = async (req: Request, res: Response): Promise<Response> => {
  let searchInfo: ISearchInfo = {};
  let sortBy: string | undefined;
  if (req.query.name) searchInfo.name = new RegExp(req.query.name as string);
  if ((req as any).user) searchInfo.userId = (req as any).user.id;
  if (req.query.id) searchInfo._id = req.query.id as string;
  if (req.query.sortBy) sortBy = req.query.sortBy as string;
  try {
    let foundImages = await imagesDBController.getImages(searchInfo, sortBy);
    return res.status(200).json({ images: foundImages });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//---------------------------------------------------------------------------------------------

const updateImage = async (req: Request, res: Response): Promise<Response> => {
  //gathering the update info
  let updateInfo: IUpdateInfo = {};
  if (!req.body.id) return res.status(404).send("Image id not found");
  if (req.body.updateInfo) {
    req.body.updateInfo = JSON.parse(req.body.updateInfo);
    if (req.body.updateInfo.name) updateInfo.name = req.body.updateInfo.name;
  }
  if (req.file) {
    let resolutionText = "";
    try {
      let resolution = imageSize.sizeOf(req.file.path);
      resolutionText = resolution.width + "x" + resolution.height;
    } catch (error) {
      return res.status(500).json(error);
    }
    updateInfo.filePath = req.file.path;
    updateInfo.resolution = resolutionText;
  }
  if (_.isEmpty(updateInfo)) return res.status(404).send("Nothing to update");
  //checking if the image is exists inthe database, check if this image belongs to that user, and
  //then update the image
  try {
    let foundImages = await imagesDBController.getImages({ _id: req.body.id });
    if (foundImages.length === 0)
      return res.status(404).send("Image not exists");
    let foundImage = foundImages[0];
    if (foundImage.userId !== (req as any).user.id)
      return res.status(404).send("This image is belongs to other user");
    await imagesDBController.updateImage(req.body.id, updateInfo);
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).send("Image successfully updated");
};

//----------------------------------------------------------------------------------------------

const deleteImage = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.id) return res.status(404).send("Image id not found");
  //checking if the image is exists in the database, check if this image belongs to that user, delete the
  //image file, and then delete the image item from the database
  try {
    let foundImages = await imagesDBController.getImages({ _id: req.body.id });
    if (foundImages.length === 0)
      return res.status(404).send("Image not exists");
    let foundImage = foundImages[0];
    if (foundImage.userId !== (req as any).user.id)
      return res.status(404).send("This image is belongs to other user");
    await fs.unlink(foundImage.filePath);
    await imagesDBController.deleteImage(req.body.id);
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).send("Image successfully deleted");
};

//--------------------------------------------------------------------------------------------------

export default {
  uploadImage,
  downloadImage,
  createImage,
  updateImage,
  deleteImage,
  getImages,
};
