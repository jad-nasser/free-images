import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import EditPassword from "./EditPassword";

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

describe("Testing EditPassword component", () => {
  //testing with empty inputs
  test("Testing with empty inputs", async () => {
    const { user } = testRender(<EditPassword />);
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(screen.getByText("Enter your new password")).toBeVisible();
    expect(screen.getByText("Confirm your new password")).toBeVisible();
    expect(screen.getByText("Enter your old password")).toBeVisible();
  });

  //testing when typing a not valid Password
  test("Testing when typing a not valid Password it should shows 'Password should ...'", async () => {
    const { user } = testRender(<EditPassword />);
    await user.type(screen.getByPlaceholderText("New Password"), "blabla");
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(screen.getByText(/Password should/)).toBeVisible();
  });

  //testing when the password confirmation do not match the password
  test("Testing when the password confirmation do not match the password it should shows 'Password confirmation should match the password'", async () => {
    const { user } = testRender(<EditPassword />);
    await user.type(screen.getByPlaceholderText("New Password"), "Q1!wasdf");
    await user.type(
      screen.getByPlaceholderText("Confirm New Password"),
      "blabla"
    );
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(
      screen.getByText("Password confirmation should match the password")
    ).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.patch(baseUrl + "/users/update-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<EditPassword />);
    await user.type(screen.getByPlaceholderText("New Password"), "Q1!wasdf");
    await user.type(
      screen.getByPlaceholderText("Confirm New Password"),
      "Q1!wasdf"
    );
    await user.type(screen.getByPlaceholderText("Old Password"), "Q2!wasdf");
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your Password successfully changed'", async () => {
    const { user } = testRender(<EditPassword />);
    await user.type(screen.getByPlaceholderText("New Password"), "Q1!wasdf");
    await user.type(
      screen.getByPlaceholderText("Confirm New Password"),
      "Q1!wasdf"
    );
    await user.type(screen.getByPlaceholderText("Old Password"), "Q2!wasdf");
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(
      await screen.findByText("Your password successfully changed")
    ).toBeVisible();
  });
});
