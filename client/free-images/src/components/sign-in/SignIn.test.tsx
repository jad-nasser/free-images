import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignIn from "./SignIn";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(404))),
  rest.post("/users/sign-in", (req, res, ctx) => res(ctx.status(200)))
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

describe("Testing SignIn component", () => {
  //testing with empty inputs
  test("Testing with empty inputs", () => {
    const { user } = testRender(<SignIn />);
    user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByText("Enter your email")).toBeVisible();
    expect(screen.getByText("Enter your password")).toBeVisible();
  });

  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.post("/users/sign-in", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<SignIn />);
    user.type(screen.getByPlaceholderText("Email"), "testtest@email.com");
    user.type(screen.getByPlaceholderText("Password"), "Q1!wasdf");
    user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });
});
