//importing modules
import dotenv from "dotenv";
dotenv.config();
import imagesController from "../../controllers/images";
import imagesDBController from "../../database-controllers/images";
import _ from "lodash";
import { expect } from "chai";
import sinon from "sinon";
import fs from "fs/promises";
import imageSize from "../../imageSize";

//creating mock request and response
const request = {
  body: {},
  query: {},
  user: { email: "testtest@email.com", id: "10" },
  cookies: {},
} as any;
const requestWithFile = {
  body: {},
  query: {},
  user: { email: "testtest@email.com", id: "10" },
  cookies: {},
  file: { path: "test.jpg" },
} as any;
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
  download: function () {
    return this;
  },
} as any;

//----------------------------------------------------------------------------

describe("Testing images controller", function () {
  //hook
  beforeEach(function () {
    sinon.restore();
  });

  //-----------------------------------------------------------------------------------------

  //Testing createImage
  describe("Testing createImage()", function () {
    //testing with empty request body
    it('Testing with empty request body it should return a message "Image name not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      //calling the tested method
      await imagesController.createImage(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image name not found");
    });

    //testing when everything is done correctly
    it('Testing when everything is done correctly "Image successfully created"', async function () {
      let req = _.cloneDeep(requestWithFile);
      req.body = { name: "test" };
      let res = _.cloneDeep(response);
      //mocking the database method createImage() and sizeOf() that calculate the image resolution
      const createImageStub = sinon
        .stub(imagesDBController, "createImage")
        .returns(true as any);
      const sizeOfStub = sinon
        .stub(imageSize, "sizeOf")
        .returns({ width: 1000, height: 500 } as any);
      //calling the tested method
      await imagesController.createImage(req, res);
      //assertions
      expect(createImageStub.calledOnce).to.be.true;
      expect(sizeOfStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("Image successfully created");
    });
  });

  //--------------------------------------------------------------------------------------

  //testing downloadImage
  describe("Testing downloadImage()", function () {
    //Testing without provinding the image id
    it('Testing without providing the image id it should return a message "Image id not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      //calling the tested method
      await imagesController.downloadImage(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image id not found");
    });

    //Testing when assumming that the requested image is not exist
    it('Testing when requesting a not exist image it should return a message "Image not exists"', async function () {
      let req = _.cloneDeep(request);
      req.query = { id: "10" };
      let res = _.cloneDeep(response);
      //mocking the database method getImages();
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([] as any);
      //calling the tested method
      await imagesController.downloadImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image not exists");
    });
  });

  //----------------------------------------------------------------------------------------

  //testing updateImage
  describe("Testing updateImage()", function () {
    //testing without providing the image id
    it('Testing without providing the image id it should return a message "Image id not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      //calling the tested method
      await imagesController.updateImage(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image id not found");
    });

    //testing without providing whats to update
    it('Testing without providing whats to update it should return a message "Nothing to update"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10" };
      let res = _.cloneDeep(response);
      //calling the tested method
      await imagesController.updateImage(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Nothing to update");
    });

    //testing when assuming that the image is not exist
    it('Testing when assuming that the image is not exists it should return a message "Image not exists"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10", updateInfo: { name: "test2" } };
      req.body.updateInfo = JSON.stringify(req.body.updateInfo);
      let res = _.cloneDeep(response);
      //stubbing the database method getImages
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([] as any);
      //calling the tested method
      await imagesController.updateImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image not exists");
    });

    //testing when trying to update an image that it is not belongs to the user
    it('Testing when trying to update an image that it is not belongs to the user it should return a message "This image is belongs to other user"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10", updateInfo: { name: "test2" } };
      req.body.updateInfo = JSON.stringify(req.body.updateInfo);
      let res = _.cloneDeep(response);
      //stubbing the database method getImages
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([{ name: "test2", userId: "20" }] as any);
      //calling the tested method
      await imagesController.updateImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("This image is belongs to other user");
    });

    //testing a successfull image name update
    it('Testing a successfull image name update it should return a message "Image successfully updated"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10", updateInfo: { name: "test2" } };
      req.body.updateInfo = JSON.stringify(req.body.updateInfo);
      let res = _.cloneDeep(response);
      //stubbing the database methods
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([{ name: "test2", userId: "10" }] as any);
      const updateImageStub = sinon
        .stub(imagesDBController, "updateImage")
        .returns(true as any);
      //calling the tested method
      await imagesController.updateImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(updateImageStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("Image successfully updated");
    });
  });

  //---------------------------------------------------------------------------------------------

  //testing deleteImage
  describe("Testing deleteImage()", function () {
    //testing without providing the image id
    it('Testing without providing the image id it should return a message "Image id not found"', async function () {
      let req = _.cloneDeep(request);
      let res = _.cloneDeep(response);
      //calling the tested method
      await imagesController.deleteImage(req, res);
      //assertions
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image id not found");
    });

    //testing when assuming that the image is not exist
    it('Testing when assuming that the image is not exists it should return a message "Image not exists"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10" };
      let res = _.cloneDeep(response);
      //stubbing the database method getImages
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([] as any);
      //calling the tested method
      await imagesController.deleteImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("Image not exists");
    });

    //testing when trying to delete an image that it is not belongs to the user
    it('Testing when trying to delete an image that it is not belongs to the user it should return a message "This image is belongs to other user"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10" };
      let res = _.cloneDeep(response);
      //stubbing the database method getImages
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([{ name: "test", userId: "20", _id: "10" }] as any);
      //calling the tested method
      await imagesController.deleteImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(404);
      expect(res.data).to.be.equal("This image is belongs to other user");
    });

    //testing a successfull image delete
    it('Testing a successfull image delete it should return a message "Image successfully deleted"', async function () {
      let req = _.cloneDeep(request);
      req.body = { id: "10" };
      let res = _.cloneDeep(response);
      //stubbing the database methods and fs.unlink()
      const getImagesStub = sinon
        .stub(imagesDBController, "getImages")
        .returns([
          { name: "test", userId: "10", _id: "10", filePath: "blablabla" },
        ] as any);
      const deleteImageStub = sinon
        .stub(imagesDBController, "deleteImage")
        .returns(true as any);
      const unlinkStub = sinon.stub(fs, "unlink");
      //calling the tested method
      await imagesController.deleteImage(req, res);
      //assertions
      expect(getImagesStub.calledOnce).to.be.true;
      expect(deleteImageStub.calledOnce).to.be.true;
      expect(unlinkStub.calledOnce).to.be.true;
      expect(res.statusCode).to.be.equal(200);
      expect(res.data).to.be.equal("Image successfully deleted");
    });
  });
});
