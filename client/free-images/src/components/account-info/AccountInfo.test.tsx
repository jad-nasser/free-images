import testRender from "../../functions/testRender";
import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import AccountInfo from "./AccountInfo";

//creating mock server
const server = setupServer(
  rest.get("/users/get-user-info", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        userInfo: {
          firstName: "test",
          lastName: "test",
          email: "testtest@email.com",
        },
      })
    )
  ),
  rest.get("/users/check-login", (req, res, ctx) => res(ctx.status(200)))
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

describe("Testing AccountInfo component", () => {
  test("Account info should appear", async () => {
    testRender(<AccountInfo />);
    expect(await screen.findByText("testtest@email.com")).toBeVisible();
  });
});
