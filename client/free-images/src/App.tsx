import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import AccountInfo from "./components/account-info/AccountInfo";
import AccountSettingsRoute from "./components/route-components/AccountSettingsRoute";
import Default from "./components/route-components/Default";
import User from "./components/route-components/User";
import EditEmail from "./components/edit-email/EditEmail";
import EditName from "./components/edit-name/EditName";
import EditPassword from "./components/edit-password/EditPassword";
import DeactivateAccount from "./components/deactivate-account/DeactivateAccount";
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import Footer from "./components/footer/Footer";
import AddImage from "./components/add-image/AddImage";
import ImageItems from "./components/image-items/ImageItems";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

function App() {
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  let textColor = "dark";
  if (themeMode === "dark") textColor = "light";
  return (
    <>
      <div className={"app bg-" + themeMode + " text-" + textColor}>
        <Routes>
          <Route path="/" element={<Default />}>
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="home" element={<ImageItems isLoggedIn={false} />} />
          </Route>
          <Route path="/user" element={<User />}>
            <Route path="home" element={<ImageItems isLoggedIn={true} />} />
            <Route path="add-image" element={<AddImage />} />
            <Route path="account-settings" element={<AccountSettingsRoute />}>
              <Route path="account-info" element={<AccountInfo />} />
              <Route path="change-email" element={<EditEmail />} />
              <Route path="change-name" element={<EditName />} />
              <Route path="change-password" element={<EditPassword />} />
              <Route
                path="deactivate-account"
                element={<DeactivateAccount />}
              />
            </Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
