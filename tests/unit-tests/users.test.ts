//importing modules
import usersController from "../../controllers/users";
import usersDBController from "../../database-controllers/users";
import imagesDBController from "../../database-controllers/images";
import _ from "lodash";
import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";

let token: string | undefined;

interface dynamicObject {
  [key: string]: any;
}

//creating mock request and response
const request: dynamicObject = {
  body: {},
  cookies: {},
};
const userRequest: dynamicObject = {
  body: {},
  user: { email: "testtest@email.com", id: "10" },
  cookies: {},
};
let data: any;
const response = {
  statusCode: 200,
  data,
  status: function (code: number) {
    this.statusCode = code;
    return this;
  },
  send: function (data: any) {
    this.data = data;
    return this;
  },
  json: function (data: any) {
    this.data = data;
    return this;
  },
  cookie: function () {
    return this;
  },
};

before(async function () {
  token = await new Promise((resolve, reject) => {
    jwt.sign(
      { email: "testtest@email.com", id: "10" },
      process.env.TOKEN_SECRET as string,
      { expiresIn: Date.now() + 1 * 1000 * 64 * 64 * 24 },
      (err, newToken) => {
        if (err) reject(err);
        else resolve(newToken);
      }
    );
  });
});
beforeEach(function () {
  sinon.restore();
});

//------------------------------------------------------------------------------------------

describe("Testing users controller", function () {
  //testing createUser
  describe("Testing createUser()", function () {
    //testing with empty request body
    test('Testing with empty request body it should return a message "First name not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      await usersController.createUser(req, res);
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("First name not found");
    });

    //testing with not valid email
    test('Testing with not valid email it should return a message "Email not valid"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        firstName: "test",
        lastName: "test",
        password: "Q1!wasdf",
        email: "blabla",
      };
      let res = _.cloneDeep(response);
      await usersController.createUser(req, res);
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Email not valid");
    });

    //testing when assuming that the email already exists
    test('Testing when assuming that the email already exists it should return a message "Email already exists"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        firstName: "test",
        lastName: "test",
        password: "Q1!wasdf",
        email: "testtest@email.com",
      };
      let res = _.cloneDeep(response);
      //stubbing the database controller method getUser()
      const getUserStub = sinon
        .stub(usersDBController, "getUser")
        .returns(Promise.resolve({ _id: "10", email: "testtest@email.com" }));
      //calling the tested method
      await usersController.createUser(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Email already exists");
    });

    //testing with a not valid password
    test('Testing with a not valid password it should return a message "Password not valid"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        firstName: "test",
        lastName: "test",
        email: "testtest@email.com",
        password: "blabla",
      };
      let res = _.cloneDeep(response);
      await usersController.createUser(req, res);
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Password not valid");
    });

    //testing when everything is done correct
    test('Testing when everything is done correct it should return a message "User successfully created"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        firstName: "test",
        lastName: "test",
        password: "Q1!wasdf",
        email: "testtest@email.com",
      };
      let res = _.cloneDeep(response);
      //stubbing the database controller methods
      const getUserStub = sinon
        .stub(usersDBController, "getUser")
        .returns(Promise.resolve(null));
      const createUserStub = sinon
        .stub(usersDBController, "createUser")
        .returns(Promise.resolve(true));
      //calling the tested method
      await usersController.createUser(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(createUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("User successfully created");
    });
  });

  //-------------------------------------------------------------------------------------------------

  //testing signIn
  describe("Testing signIn()", function () {
    //testing with empty request body
    test('Testing with empty request body it should return a message "Email not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      await usersController.signIn(req, res);
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Email not found");
    });

    //testing when assumming that email or password are not correct
    test('Testing when assumming that email or password are not correct it should return a message "Email or password are not correct"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        password: "Q1!wasdf",
        email: "testtest@email.com",
      };
      let res = _.cloneDeep(response);
      //stubbing the database controller methods
      const getUserStub = sinon.stub(usersDBController, "getUser").returns(
        Promise.resolve({
          _id: "10",
          email: "testtest@email.com",
          password: "Q2!wasdf",
        })
      );
      //calling the tested method
      await usersController.signIn(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Email or password are not correct");
    });

    //testing when everything is done correct
    test('Testing when everything is done correct it should return a message "Successfully signed in"', async function () {
      let req = _.cloneDeep(request);
      req.body = {
        password: "Q1!wasdf",
        email: "testtest@email.com",
      };
      let res = _.cloneDeep(response);
      //stubbing the database controller methods
      const getUserStub = sinon.stub(usersDBController, "getUser").returns(
        Promise.resolve({
          _id: "10",
          email: "testtest@email.com",
          password: "Q1!wasdf",
        })
      );
      //calling the tested method
      await usersController.signIn(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("User successfully created");
    });
  });

  //-------------------------------------------------------------------------------------

  //testing readCookie
  describe("Testing readCookie() middleware", function () {
    //testing without a token
    test('Testing without a token it should return a message "Token not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      await usersController.readCookie(req, res, () => {});
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Token not found");
    });

    //testing with a not valid token
    test('Testing with a not valid token it should return a message "Token not valid"', async function () {
      let req = _.cloneDeep(request);
      req.cookies = { token: "not valid" };
      let res = _.cloneDeep(response);
      await usersController.readCookie(req, res, () => {});
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Token not valid");
    });

    //testing with a valid token
    test("Testing with a valid token ,the request should contains user object", async function () {
      let req = _.cloneDeep(request);
      req.cookies = { token };
      let res = _.cloneDeep(response);
      await usersController.readCookie(req, res, () => {});
      //assertions
      expect((req as any).user).to.be.exist;
    });
  });

  //--------------------------------------------------------------------------------------

  //testing getUserInfo
  describe("Testing getUserInfo()", function () {
    //it should return the info without the password
    test("Should return the user info without the password", async function () {
      let req = _.cloneDeep(userRequest);
      let res = _.cloneDeep(response);
      //mocking the database controller method getUser
      const getUserStub = sinon.stub(usersDBController, "getUser").returns(
        Promise.resolve({
          _id: 10,
          email: "testtest@email.com",
          password: "Q1!wasdf",
        })
      );
      //calling the tested method
      await usersController.getUserInfo(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data.userInfo).to.be.exist;
      expect(res.data.userInfo.password).to.be.not.exist;
    });
  });

  //---------------------------------------------------------------------------------------------

  //testing updateUser
  describe("Testing updateUser()", function () {
    //testing with empty updateInfo
    test("Testing with empty updateInfo, should return a message 'No update info provided'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = { updateInfo: {} };
      let res = _.cloneDeep(response);
      await usersController.updateUser(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("No update info provided");
    });

    //testing with a not valid email
    test("Testing with a not valid new email, should return a message 'New email not valid'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = { updateInfo: { email: "blabla" } };
      let res = _.cloneDeep(response);
      await usersController.updateUser(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("New email not valid");
    });

    //testing when assuming that the entered email is already exists
    test("Testing when assuming that the entered email is already exists, should return a message 'New email already exists'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = { updateInfo: { email: "testtest@email.com" } };
      let res = _.cloneDeep(response);
      //stubbing the database controller method getUser
      const getUserStub = sinon
        .stub(usersDBController, "getUser")
        .returns({ _id: "10", email: "testtest@email.com" });
      //calling the tested method
      await usersController.updateUser(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("New email already exists");
    });

    //testing with a new password but without the old password
    test("Testing with new password but without providing old password it should return a message 'Old password not found'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = { updateInfo: { newPassword: "Q2!wasdf" } };
      let res = _.cloneDeep(response);
      await usersController.updateUser(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Old password not found");
    });

    //testing with a not valid new password
    test("Testing with a not valid new password it should return a message 'New password not valid'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = {
        updateInfo: { newPassword: "blabla", oldPassword: "blabla" },
      };
      let res = _.cloneDeep(response);
      await usersController.updateUser(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("New password not valid");
    });

    //testing with a new password and with an old password that supposed to be not correct
    test("Testing with an old password that supposed to be not correct it should return a message 'Old password is not correct'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = {
        updateInfo: { newPassword: "Q2!wasdf", oldPassword: "blabla" },
      };
      let res = _.cloneDeep(response);
      //stubbing the database method getUser
      const getUserStub = sinon.stub(usersDBController, "getUser").returns({
        _id: "10",
        email: "testtest@email.com",
        password: "Q3!wasdf",
      });
      //calling the tested method
      await usersController.updateUser(req, res);
      //assertions
      expect(getUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Old password not correct");
    });

    //testing a successfull update
    test("Testing a successfull update it should return a message 'User successfully updated'", async function () {
      let req = _.cloneDeep(userRequest);
      req.body = {
        updateInfo: { firstName: "Test", lastName: "Test" },
      };
      let res = _.cloneDeep(response);
      //stubbing the database method updateUser
      const updateUserStub = sinon
        .stub(usersDBController, "updateUser")
        .returns(true);
      //calling the tested method
      await usersController.updateUser(req, res);
      //assertions
      expect(updateUserStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("User successfully updated");
    });
  });

  //-------------------------------------------------------------------------------------------------

  //testing deleteUser
  describe("Testing deleteUser()", function () {
    //testing a successfull delete
    test("Testing a successfull delete it should return a message 'User successfully deleted'", async function () {
      let req = _.cloneDeep(userRequest);
      let res = _.cloneDeep(response);
      //stubbing the database methods
      const deleteUserStub = sinon
        .stub(usersDBController, "deleteUser")
        .returns(true);
      const deleteAllUserImagesStub = sinon
        .stub(imagesDBController, "deleteAllUserImages")
        .returns(true);
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([]);
      //calling the tested method
      await usersController.deleteUser(req, res);
      //assertions
      expect(deleteUserStub.calledOnce).to.be.true;
      expect(deleteAllUserImagesStub.calledOnce).to.be.true;
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("User successfully deleted");
    });
  });
});
