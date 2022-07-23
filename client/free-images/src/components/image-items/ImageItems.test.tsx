import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import ImageItems from "./ImageItems";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//mock images
const image1 = {
  name: "test-image1",
  resolution: "1500x1000",
  numberOfDownloads: "1000",
  filePath: "test-image1.jpg",
};
const image2 = {
  name: "test-image2",
  resolution: "1500x1000",
  numberOfDownloads: "1000",
  filePath: "test-image2.jpg",
};

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(404))),
  rest.get("/images/get-images", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ images: [image1, image2] }))
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

describe("Testing ImageItems component", () => {
  test("Should shows the two images", async () => {
    testRender(<ImageItems />);
    expect(await screen.findByText("test-image1")).toBeVisible();
    expect(screen.getByText("test-image2")).toBeVisible();
  });
});
