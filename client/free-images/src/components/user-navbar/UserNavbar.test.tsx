import testRender from "../../functions/testRender";
import { screen } from "@testing-library/react";
import UserNavbar from "./UserNavbar";

describe("Testing UserNavbar component", () => {
  test("Should change the theme mode to dark mode", async () => {
    const { store, user } = testRender(<UserNavbar />);
    await user.click(screen.getByRole("button", { name: "Change Theme" }));
    await user.click(screen.getByLabelText("Dark"));
    expect(store.getState().theme.mode).toEqual("dark");
  });

  test("Should change the theme color to red", async () => {
    const { store, user } = testRender(<UserNavbar />);
    await user.click(screen.getByRole("button", { name: "Change Theme" }));
    await user.click(screen.getByLabelText("Red"));
    //named after css bootstrap color system
    expect(store.getState().theme.color).toEqual("danger");
  });
});
