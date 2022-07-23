import testRender from "../../functions/testRender";
import axios from "axios";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import DeactivateAccount from "./DeactivateAccount";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

//creating mock server
const server = setupServer(
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(200))),
  rest.delete("/users/delete-user", (req, res, ctx) => res(ctx.status(200)))
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

describe("Testing DeactivateAccount component", () => {
  //testing when the server sends an error
  test("Testing when the server sends an error it should shows the error", async () => {
    //mocking the server to send an error
    server.use(
      rest.delete("/users/delete-user", (req, res, ctx) =>
        res(ctx.status(404), ctx.json("Server error"))
      )
    );

    const { user } = testRender(<DeactivateAccount />);
    user.click(screen.getByRole("button", { name: "Deactivate Account" }));
    user.click(screen.getByRole("button", { name: "Yes" }));
    expect(await screen.findByText("Server error")).toBeVisible();
  });

  //testing when everything is done correctly
  test("Testing when everything is done correctly it should shows 'Your account successfully deactivated'", async () => {
    const { user } = testRender(<DeactivateAccount />);
    user.click(screen.getByRole("button", { name: "Deactivate Account" }));
    user.click(screen.getByRole("button", { name: "Yes" }));
    expect(
      await screen.findByText("Your account successfully deactivated")
    ).toBeVisible();
  });
});
