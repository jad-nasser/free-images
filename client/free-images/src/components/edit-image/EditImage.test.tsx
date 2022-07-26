import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import EditImage from "./EditImage";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

const baseUrl = process.env.REACT_APP_BASE_URL;

//mock image
const image1 = {
  name: "test-image1",
  resolution: "1500x1000",
  numberOfDownloads: "1000",
  filePath: "test-image1.jpg",
  _id: "1234",
  userId: "4321",
};

//creating mock server
const server = setupServer(
  rest.get(baseUrl + "/users/check-login", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.patch(baseUrl + "/images/update-image", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.delete(baseUrl + "/images/delete-image", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.get(baseUrl + "/images/get-images", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ images: [image1] }))
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

describe("Testing EditImage component", () => {
  //testing when deleting the image
  test('Testing when deleting the image it should shows "Image successfully deleted"', async () => {
    const { user } = testRender(<EditImage />);
    await user.click(
      await screen.findByRole("button", { name: "Delete Image" })
    );
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(await screen.findByText("Image successfully deleted")).toBeVisible();
  });

  //testing with empty inputs
  test("Testing with empty inputs, the 'Edit Image' button should be disabled", async () => {
    testRender(<EditImage />);
    expect(
      await screen.findByRole("button", { name: "Edit Image" })
    ).toBeDisabled();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.patch(baseUrl + "/images/update-image", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<EditImage />);
    await user.type(
      await screen.findByPlaceholderText("New Image Name"),
      "test-image2"
    );
    await user.click(screen.getByRole("button", { name: "Edit Image" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Image successfully edited'", async () => {
    const { user } = testRender(<EditImage />);
    await user.type(
      await screen.findByPlaceholderText("New Image Name"),
      "test-image2"
    );
    await user.click(screen.getByRole("button", { name: "Edit Image" }));
    expect(await screen.findByText("Image successfully edited")).toBeVisible();
  });
});
