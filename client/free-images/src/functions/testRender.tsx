import store from "../redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";

const testRender = (component: JSX.Element) => {
  return {
    user: UserEvent.setup(),
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
  };
};

export default testRender;
