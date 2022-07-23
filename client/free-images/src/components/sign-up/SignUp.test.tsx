import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignUp from "./SignUp";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(200))),
  rest.post("/users/create-user", (req, res, ctx) => res(ctx.status(200)))
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
  test("Testing with empty inputs", () => {
    const { user } = testRender(<SignUp />);
    user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText("Enter your email address")).toBeVisible();
    expect(screen.getByText("Enter your first name")).toBeVisible();
    expect(screen.getByText("Enter your last name")).toBeVisible();
    expect(screen.getByText("Enter your account password")).toBeVisible();
    expect(screen.getByText("Confirm your password")).toBeVisible();
  });

  //testing when typing a not valid email
  test("Testing when typing a not valid email it should shows 'Enter a valid email address'", () => {
    const { user } = testRender(<SignUp />);
    user.type(screen.getByPlaceholderText("Email Address"), "blabla");
    user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText("Enter a valid email address")).toBeVisible();
  });

  //testing when typing a not valid Password
  test("Testing when typing a not valid Password it should shows 'Password should ...'", () => {
    const { user } = testRender(<SignUp />);
    user.type(screen.getByPlaceholderText("Account Password"), "blabla");
    user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(screen.getByText(/Password should/)).toBeVisible();
  });

  //testing when the password confirmation do not match the password
  test("Testing when the password confirmation do not match the password it should shows 'Password confirmation should match the password'", () => {
    const { user } = testRender(<SignUp />);
    user.type(screen.getByPlaceholderText("Account Password"), "Q1!wasdf");
    user.type(screen.getByPlaceholderText("Confirm Password"), "blabla");
    user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(
      screen.getByText("Password confirmation should match the password")
    ).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.post("/users/create-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<SignUp />);
    user.type(screen.getByPlaceholderText("First Name"), "Test");
    user.type(screen.getByPlaceholderText("Last Name"), "Test");
    user.type(
      screen.getByPlaceholderText("Email Address"),
      "testtest@email.com"
    );
    user.type(screen.getByPlaceholderText("Account Password"), "Q1!wasdf");
    user.type(screen.getByPlaceholderText("Confirm Password"), "Q1!wasdf");
    user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your account successfully created'", async () => {
    const { user } = testRender(<SignUp />);
    user.type(screen.getByPlaceholderText("First Name"), "Test");
    user.type(screen.getByPlaceholderText("Last Name"), "Test");
    user.type(
      screen.getByPlaceholderText("Email Address"),
      "testtest@email.com"
    );
    user.type(screen.getByPlaceholderText("Account Password"), "Q1!wasdf");
    user.type(screen.getByPlaceholderText("Confirm Password"), "Q1!wasdf");
    user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(
      await screen.findByText("Your account successfully created")
    ).toBeVisible();
  });
});
