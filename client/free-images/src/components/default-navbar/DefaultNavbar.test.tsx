import testRender from "../../functions/testRender";
import { screen } from "@testing-library/react";
import DefaultNavbar from "./DefaultNavbar";

describe("Testing DefaultNavbar component", () => {
  test("Should change the theme mode to dark mode", () => {
    const { store, user } = testRender(<DefaultNavbar />);
    user.click(screen.getByRole("button", { name: "Change Theme" }));
    user.click(screen.getByLabelText("Dark"));
    expect(store.getState().theme.mode).toEqual("dark");
  });

  test("Should change the theme color to red", () => {
    const { store, user } = testRender(<DefaultNavbar />);
    user.click(screen.getByRole("button", { name: "Change Theme" }));
    user.click(screen.getByLabelText("Red"));
    //named after css bootstrap color system
    expect(store.getState().theme.color).toEqual("danger");
  });
});
