import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignUp from "./SignUp";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

const baseUrl = process.env.REACT_APP_BASE_URL;

//creating mock server
const server = setupServer(
  rest.get(baseUrl + "/users/check-login", (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.post(baseUrl + "/users/create-user", (req, res, ctx) =>
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

describe("Testing SignUp component", () => {
  //testing with empty inputs
  test("Testing with empty inputs", async () => {
    const { user } = testRender(<SignUp />);
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText("Enter your email address")).toBeVisible();
    expect(screen.getByText("Enter your first name")).toBeVisible();
    expect(screen.getByText("Enter your last name")).toBeVisible();
    expect(screen.getByText("Enter your account password")).toBeVisible();
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });

  //testing when typing a not valid email
  test("Testing when typing a not valid email it should shows 'Enter a valid email address'", async () => {
    const { user } = testRender(<SignUp />);
    await user.type(screen.getByPlaceholderText("Email Address"), "blabla");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText("Enter a valid email address")).toBeVisible();
  });

  //testing when typing a not valid Password
  test("Testing when typing a not valid Password it should shows 'Password should ...'", async () => {
    const { user } = testRender(<SignUp />);
    await user.type(screen.getByPlaceholderText("Account Password"), "blabla");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText(/Password should/)).toBeVisible();
  });

  //testing when the password confirmation do not match the password
  test("Testing when the password confirmation do not match the password it should shows 'Password confirmation should match the password'", async () => {
    const { user } = testRender(<SignUp />);
    await user.type(
      screen.getByPlaceholderText("Account Password"),
      "Q1!wasdf"
    );
    await user.type(screen.getByPlaceholderText("Confirm Password"), "blabla");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(
      screen.getByText("Password confirmation should match the password")
    ).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.post(baseUrl + "/users/create-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<SignUp />);
    await user.type(screen.getByPlaceholderText("First Name"), "Test");
    await user.type(screen.getByPlaceholderText("Last Name"), "Test");
    await user.type(
      screen.getByPlaceholderText("Email Address"),
      "testtest@email.com"
    );
    await user.type(
      screen.getByPlaceholderText("Account Password"),
      "Q1!wasdf"
    );
    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "Q1!wasdf"
    );
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your account successfully created'", async () => {
    const { user } = testRender(<SignUp />);
    await user.type(screen.getByPlaceholderText("First Name"), "Test");
    await user.type(screen.getByPlaceholderText("Last Name"), "Test");
    await user.type(
      screen.getByPlaceholderText("Email Address"),
      "testtest@email.com"
    );
    await user.type(
      screen.getByPlaceholderText("Account Password"),
      "Q1!wasdf"
    );
    await user.type(
      screen.getByPlaceholderText("Confirm Password"),
      "Q1!wasdf"
    );
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(
      await screen.findByText("Your account successfully created")
    ).toBeVisible();
  });
});
