import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import AddImage from "./AddImage";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(200))),
  rest.post("/images/create-image", (req, res, ctx) => res(ctx.status(200)))
);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("Testing AddImage component", () => {
  //testing with empty inputs
  test("Testing with empty inputs", () => {
    const { user } = testRender(<AddImage />);
    user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(screen.getByText("Enter image name")).toBeVisible();
    expect(screen.getByText("Select image file")).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //creating a mock image file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    //mocking the server to send an error
    server.use(
      rest.post("/images/create-image", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<AddImage />);
    user.type(screen.getByPlaceholderText("Image Name"), "test-image");
    user.upload(screen.getByLabelText("Select Image"), file);
    user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Image successfully added'", async () => {
    //creating a mock image file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    const { user } = testRender(<AddImage />);
    user.type(screen.getByPlaceholderText("Image Name"), "test-image");
    user.upload(screen.getByLabelText("Select Image"), file);
    user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(await screen.findByText("Image successfully added")).toBeVisible();
  });
});
