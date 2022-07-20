//importing modules
import request from "supertest";
import app from "../../app";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import usersDBController from "../../database-controllers/users";
import imagesDBController from "../../database-controllers/images";
import { connect, disconnect } from "../../dbConnection";

interface IImage {
  name: string;
  filePath: string;
  resolution: string;
  userId: string | undefined;
}

//some useful variables
let user = {
  firstName: "test",
  lastName: "test",
  email: "testtest@email.com",
  password: "Q1!wasdf",
};
let token: string | undefined;
let image1: IImage = {
  name: "test-image1",
  filePath: "blabla.jpg",
  resolution: "2500*1500",
  userId: "",
};
let image2: IImage = {
  name: "test-image2",
  filePath: "blabla2.jpg",
  resolution: "2500*1500",
  userId: "",
};
let image2Id: undefined | string;

//hooks
before(async function () {
  //connecting to the test database
  await connect("free-images-test");
  //creating the user that will be used in most tests
  await usersDBController.createUser(user);
  //getting user
  let foundUser = await usersDBController.getUser(user.email);
  //settings the userId's of the mock images
  image1.userId = foundUser?._id.toString();
  image2.userId = foundUser?._id.toString();
  //creating a token for the found user
  token = await new Promise((resolve, reject) => {
    jwt.sign(
      { email: user.email, id: foundUser?._id },
      process.env.TOKEN_SECRET as string,
      { expiresIn: Date.now() + 1 * 1000 * 64 * 64 * 24 },
      (err, newToken) => {
        if (err) reject(err);
        else resolve(newToken);
      }
    );
  });
  //creating the images that will be used in some tests
  await imagesDBController.createImage(image1 as any);
  await imagesDBController.createImage(image2 as any);
  //getting image2 id
  let images = await imagesDBController.getImages({ name: "test-image2" });
  image2Id = images[0]._id.toString();
});
after(async function () {
  await usersDBController.clearTable();
  await imagesDBController.clearTable();
  await disconnect();
});

describe("Testing images router", function () {
  //testing create-image
  it("Testing images/create-image it should successfully creating an image item", async function () {
    const response = await request(app)
      .post("/images/create-image")
      .set("Accept", "multipart/form-data")
      .set("Cookie", ["token=" + token])
      .field("name", "test-image3")
      .attach("image-file", "./tests/test-files/test-image1.jpg");
    expect(response.statusCode).to.be.equal(200);
  });

  //testing get-images
  it("Testing images/get-images by searching for a specific image it should return one image", async function () {
    const response = await request(app)
      .get("/images/get-images")
      .set("Accept", "application/json")
      //searching for that image that has a name test-image1
      //but since it contains regex we can only put a part from the name to get the image
      .query({ name: "1" });
    let responseData = response.text as any;
    expect(responseData.images.length).to.be.equal(1);
    expect(responseData.images[0].name).to.be.equal("test-image1");
  });

  //testing update-image
  it("Testing images/update-image it should successfully updating the image name", async function () {
    let updateInfo = { name: "test-image20" };
    const response = await request(app)
      .patch("/images/update-image")
      .set("Accept", "multipart/form-data")
      .set("Cookie", ["token=" + token])
      .field("id", image2Id as string)
      .field("updateInfo", JSON.stringify(updateInfo));
    expect(response.statusCode).to.be.equal(200);
  });

  //testing delete-image
  it("Testing images/delete-image it should successfully delete an image", async function () {
    const response = await request(app)
      .delete("/images/delete-image")
      .set("Accept", "application/json")
      .set("Cookie", ["token=" + token])
      .send({ id: image2Id });
    expect(response.statusCode).to.be.equal(200);
  });
});
