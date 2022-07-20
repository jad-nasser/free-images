import Images from "../models/images";

interface IImage {
  name: string;
  resolution: string;
  userId: string;
  filePath: string;
}
interface ISearchInfo {
  name?: string;
  userId?: string;
  _id?: string;
}
interface IUpdateInfo {
  name?: string;
  filePath?: string;
  resolution?: string;
}
interface IDynamicObject {
  [key: string]: any;
}

const createImage = (imageInfo: IImage) => {
  const image = new Images(imageInfo);
  return image.save();
};

const getImages = (
  searchInfo: ISearchInfo = {},
  sortBy: string = "alphabetical-order"
) => {
  let sortObject: IDynamicObject = {};
  if (sortBy === "alphabetical-order") sortObject = { name: 1 };
  else if (sortBy === "reverse-alphabetical-order") sortObject = { name: -1 };
  else if (sortBy === "most-downloaded") sortObject = { numberOfDownloads: -1 };
  return Images.find(searchInfo).sort(sortObject);
};

const updateImage = (id: string, updateInfo: IUpdateInfo) =>
  Images.updateOne({ _id: id }, updateInfo);

const incrementImage = (id: string) =>
  Images.updateOne({ _id: id }, { $inc: { numberOfDownloads: 1 } });

const deleteImage = (id: string) => Images.deleteOne({ _id: id });

const deleteAllUserImages = (userId: string) => Images.deleteMany({ userId });

const clearTable = () => Images.deleteMany();

export default {
  createImage,
  getImages,
  updateImage,
  incrementImage,
  deleteImage,
  deleteAllUserImages,
  clearTable,
};
