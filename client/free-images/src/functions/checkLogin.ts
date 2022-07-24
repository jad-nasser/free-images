//importing modules
import axios from "axios";
import { NavigateFunction } from "react-router-dom";

//this function is to check if the user is in the right page and if not the user will be
//navigated to other page

const checkLogin = async (pageType: string, navigate: NavigateFunction) => {
  try {
    await axios.get("/users/check-login");
    if (pageType === "default") navigate("/user/home");
  } catch (error) {
    if (pageType === "user") navigate("/sign-in");
  }
};

export default checkLogin;
