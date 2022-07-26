import testRender from "../../functions/testRender";
import axios from "axios";
import { screen, fireEvent } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import AddImage from "./AddImage";
import testImage from "../../test-image1.jpg";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

const baseUrl = process.env.REACT_APP_BASE_URL;

//creating mock server
const server = setupServer(
  rest.get(baseUrl + "/users/check-login", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.post(baseUrl + "/images/create-image", (req, res, ctx) =>
    res(ctx.status(200))
  )
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
  test("Testing with empty inputs", async () => {
    const { user } = testRender(<AddImage />);
    await user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(screen.getByText("Enter image name")).toBeVisible();
    expect(screen.getByText("Select image file")).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.post(baseUrl + "/images/create-image", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<AddImage />);
    await user.type(screen.getByPlaceholderText("Image Name"), "test-image");
    fireEvent.change(screen.getByLabelText("Select Image"), {
      target: { files: [testImage], required: false },
    });
    await user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Image successfully added'", async () => {
    const { user } = testRender(<AddImage />);
    await user.type(screen.getByPlaceholderText("Image Name"), "test-image");
    fireEvent.change(screen.getByLabelText("Select Image"), {
      target: { files: [testImage], required: false },
    });
    await user.click(screen.getByRole("button", { name: "Add Image" }));
    expect(await screen.findByText("Image successfully added")).toBeVisible();
  });
});
