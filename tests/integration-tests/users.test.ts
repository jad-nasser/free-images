//importing modules
import request from "supertest";
import app from "../../app";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import usersDBController from "../../database-controllers/users";
import { connect, disconnect } from "../../dbConnection";

//some useful variables
let user = {
  firstName: "test",
  lastName: "test",
  email: "testtest@email.com",
  password: "Q1!wasdf",
};
let user2 = {
  firstName: "test",
  lastName: "test",
  email: "testtest2@email.com",
  password: "Q1!wasdf",
};
let token: string | undefined;

//hooks
before(async function () {
  //connecting to the test database
  await connect("free-images-test");
  //creating the user that will be used in most tests
  await usersDBController.createUser(user);
  //getting user
  let foundUser = await usersDBController.getUser(user.email);
  //creating a token for this user
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
});
after(async function () {
  await usersDBController.clearTable();
  await disconnect();
});

describe("Testing users router", function () {
  //testing create-user
  it("Testing users/create-user it should successfully creating a user", async function () {
    const response = await request(app)
      .post("/users/create-user")
      .set("Accept", "application/json")
      .send(user2);
    expect(response.statusCode).to.be.equal(200);
  });

  //testing sign-in
  it("Testing users/sign-in it should successfully sign in", async function () {
    let userCredentials = { email: user.email, password: user.password };
    const signInResponse = await request(app)
      .post("/users/sign-in")
      .set("Accept", "application/json")
      .send(userCredentials);
    expect(signInResponse.statusCode).to.be.equal(200);
  });

  //testing check-login
  it("Testing users/check-login it should return true", async function () {
    const response = await request(app)
      .get("/users/check-login")
      .set("Accept", "application/json")
      .set("Cookie", ["token=" + token]);
    expect(response.text).to.be.equal(true);
  });

  //testing get-user-info
  it("Testing users/get-user-info it should return the user info", async function () {
    const response = await request(app)
      .get("/users/get-user-info")
      .set("Accept", "application/json")
      .set("Cookie", ["token=" + token]);
    let responseData = response.text as any;
    expect(responseData.userInfo).to.be.exist;
  });

  //testing update-user
  it("Testing users/update-user it should successfully updating the user name", async function () {
    let updateInfo = { firstName: "Test", lastName: "Test" };
    const response = await request(app)
      .patch("/users/update-user")
      .set("Accept", "application/json")
      .set("Cookie", ["token=" + token])
      .send({ updateInfo });
    expect(response.statusCode).to.be.equal(200);
  });

  //testing delete-user
  it("Testing users/delete-user it should successfully delete the user", async function () {
    const response = await request(app)
      .delete("/users/delete-user")
      .set("Accept", "application/json")
      .set("Cookie", ["token=" + token]);
    expect(response.statusCode).to.be.equal(200);
  });
});
