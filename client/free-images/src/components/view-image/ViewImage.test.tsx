import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import ViewImage from "./ViewImage";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

const baseUrl = process.env.REACT_APP_BASE_URL;

//mock image
const image1 = {
  name: "test-image1",
  resolution: "1500x1000",
  numberOfDownloads: "1000",
  filePath: "test-image1.jpg",
};

//creating mock server
const server = setupServer(
  rest.get(baseUrl + "/users/check-login", (req, res, ctx) =>
    res(ctx.status(404))
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

describe("Testing ViewImage component", () => {
  test("Should shows the image", async () => {
    testRender(<ViewImage />);
    expect(await screen.findByText("test-image1")).toBeVisible();
  });
});
