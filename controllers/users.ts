import imagesDBController from "../database-controllers/images";
import usersDBController from "../database-controllers/users";
import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
}
interface IUpdateInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

//------------------------------------------------------------------------------------------

const createUser = async (req: Request, res: Response): Promise<Response> => {
  //gathering the user info and checking if any info is missing or invalid
  if (!req.body.firstName) return res.status(404).send("First name not found");
  if (!req.body.lastName) return res.status(404).send("Last name not found");
  if (!req.body.email) return res.status(404).send("Email not found");
  if (!emailRegex.test(req.body.email))
    return res.status(404).send("Email not valid");
  if (!req.body.password) return res.status(404).send("Password not found");
  if (!passwordRegex.test(req.body.password))
    return res.status(404).send("Password not valid");
  let userInfo: IUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };
  //checking if the email is already exists
  try {
    const foundUser = await usersDBController.getUser(userInfo.email);
    if (foundUser) return res.status(404).send("Email already exists");
  } catch (error) {
    return res.status(500).json(error);
  }
  //hashing the password and creating the user
  try {
    let hashedPassword = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hashedPassword;
    await usersDBController.createUser(userInfo);
    return res.status(200).send("User successfully created");
  } catch (error) {
    return res.status(500).json(error);
  }
};

//---------------------------------------------------------------------------------------

const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email) return res.status(404).send("Email not found");
  if (!req.body.password) return res.status(404).send("Password not found");
  //checking if the user credentials are correct and then creating a token
  try {
    //checking if the user exists
    const foundUser = await usersDBController.getUser(req.body.email);
    if (!foundUser)
      return res.status(404).send("Email or password are not correct");
    //checking if the password is correct
    const compareResult = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!compareResult)
      return res.status(404).send("Email or password are not correct");
    //creating the token
    const token = jwt.sign(
      { email: foundUser.email, id: foundUser._id },
      TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    //creating the httpOnly cookie and returning the response
    res.cookie("token", token, {
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 1000 * 60 * 60 * 24),
    });
    return res.status(200).send("Successfully signed in");
  } catch (error) {
    return res.status(500).json(error);
  }
};

//--------------------------------------------------------------------------------------------

const signOut = async (req: Request, res: Response): Promise<Response> => {
  res.cookie("token", "", {
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() - 1000),
  });
  return res.status(200).send("Successfully signed out");
};

//--------------------------------------------------------------------------------------

//this method is a middleware to check if there is a token and if this token is valid
const readCookie = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies || !req.cookies.token)
    return res.status(404).send("Token not found");
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      TOKEN_SECRET,
      (
        err:
          | jwt.JsonWebTokenError
          | jwt.NotBeforeError
          | jwt.TokenExpiredError
          | null,
        payload: string | jwt.JwtPayload | undefined
      ) => {
        if (err) resolve(res.status(404).send("Token not valid"));
        else {
          (req as any).user = payload;
          next();
          resolve(true);
        }
      }
    );
  });
};

//------------------------------------------------------------------------------------

//this method is to tell that a user is logged and its only executed after readCookie middleware
const checkLogin = (req: Request, res: Response) => {
  return res.status(200).send("Logged in");
};

//----------------------------------------------------------------------------------

const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const foundUser = await usersDBController.getUser((req as any).user.email);
    if (!foundUser) return res.status(404).send("User not found");
    const userInfo: IUserInfo = {
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
    };
    return res.status(200).json({ userInfo });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//--------------------------------------------------------------------------------------------

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  let updateInfo: IUpdateInfo = {};
  if (!req.body.updateInfo)
    return res.status(404).send("No update info provided");
  let updateData = req.body.updateInfo;
  if (updateData.firstName) updateInfo.firstName = updateData.firstName;
  if (updateData.lastName) updateInfo.lastName = updateData.lastName;
  //in case the user wants to update the password
  if (updateData.newPassword) {
    //checking if old password not found
    if (!updateData.oldPassword)
      return res.status(404).send("Old password not found");
    //checking if the new password is valid
    if (!passwordRegex.test(updateData.newPassword))
      return res.status(404).send("New password not valid");
    //checking if the old password is correct and then hashing the new password
    try {
      //getting the user and checking if the old password is correct
      const foundUser = await usersDBController.getUser(
        (req as any).user.email
      );
      if (!foundUser) return res.status(404).send("User not found");
      const compareResult = await bcrypt.compare(
        updateData.oldPassword,
        foundUser.password
      );
      if (!compareResult)
        return res.status(404).send("Old password is not correct");
      //hashing the new password
      const hashedPassword = await bcrypt.hash(updateData.newPassword, 10);
      updateInfo.password = hashedPassword;
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  if (updateData.email) {
    if (!emailRegex.test(updateData.email))
      return res.status(404).send("Email not valid");
    updateInfo.email = updateData.email;
  }
  if (_.isEmpty(updateInfo))
    return res.status(404).send("No update info provided");
  //updating the user
  try {
    await usersDBController.updateUser((req as any).user.id, updateInfo);
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).send("User successfully updated");
};

//-----------------------------------------------------------------------------------------

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    //getting all the images for that user and deleting their files
    const foundImages = await imagesDBController.getImages({
      userId: (req as any).user.id,
    });
    for (let i = 0; i < foundImages.length; i++) {
      fs.unlink(foundImages[i].filePath);
    }
    //deleting the all the image items for that user from the database
    await imagesDBController.deleteAllUserImages((req as any).user.id);
    //deleting the user from the database
    await usersDBController.deleteUser((req as any).user.id);
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(200).send("User successfully deleted");
};

//-----------------------------------------------------------------------------------

export default {
  createUser,
  signIn,
  signOut,
  readCookie,
  checkLogin,
  getUserInfo,
  updateUser,
  deleteUser,
};
