import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import EditEmail from "./EditEmail";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

const baseUrl = process.env.REACT_APP_BASE_URL;

//creating mock server
const server = setupServer(
  rest.get(baseUrl + "/users/check-login", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.patch(baseUrl + "/users/update-user", (req, res, ctx) =>
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

describe("Testing EditEmail component", () => {
  //testing with empty email input
  test("Testing with empty new email input it should shows 'Enter your new email address'", async () => {
    const { user } = testRender(<EditEmail />);
    await user.click(screen.getByRole("button", { name: "Change Email" }));
    expect(screen.getByText("Enter your new email address")).toBeVisible();
  });

  //testing when typing a not valid email
  test("Testing when typing a not valid email it should shows 'Enter a valid email address'", async () => {
    const { user } = testRender(<EditEmail />);
    await user.type(screen.getByPlaceholderText("New Email Address"), "blabla");
    await user.click(screen.getByRole("button", { name: "Change Email" }));
    expect(screen.getByText("Enter a valid email address")).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.patch(baseUrl + "/users/update-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<EditEmail />);
    await user.type(
      screen.getByPlaceholderText("New Email Address"),
      "testtest@email.com"
    );
    await user.click(screen.getByRole("button", { name: "Change Email" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your email address successfully changed'", async () => {
    const { user } = testRender(<EditEmail />);
    await user.type(
      screen.getByPlaceholderText("New Email Address"),
      "testtest@email.com"
    );
    await user.click(screen.getByRole("button", { name: "Change Email" }));
    expect(
      await screen.findByText("Your email address successfully changed")
    ).toBeVisible();
  });
});
