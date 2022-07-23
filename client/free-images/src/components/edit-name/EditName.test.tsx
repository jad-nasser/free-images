import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import EditName from "./EditName";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(200))),
  rest.patch("/users/update-user", (req, res, ctx) => res(ctx.status(200)))
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

describe("Testing EditName component", () => {
  //testing with empty inputs
  test("Testing with empty inputs", () => {
    const { user } = testRender(<EditName />);
    user.click(screen.getByRole("button", { name: "Change Name" }));
    expect(screen.getByText("Enter your new first name")).toBeVisible();
    expect(screen.getByText("Enter your new last name")).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.patch("/users/update-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<EditName />);
    user.type(screen.getByPlaceholderText("New First Name"), "Test");
    user.type(screen.getByPlaceholderText("New Last Name"), "Test");
    user.click(screen.getByRole("button", { name: "Change Name" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your name successfully changed'", async () => {
    const { user } = testRender(<EditName />);
    user.type(screen.getByPlaceholderText("New First Name"), "Test");
    user.type(screen.getByPlaceholderText("New Last Name"), "Test");
    user.click(screen.getByRole("button", { name: "Change Name" }));
    expect(
      await screen.findByText("Your name successfully changed")
    ).toBeVisible();
  });
});
