import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import AccountInfo from "./components/account-info/AccountInfo";
import AccountSettingsRoute from "./components/route-components/AccountSettingsRoute";
import Default from "./components/route-components/Default";
import User from "./components/route-components/User";
import EditEmail from "./components/edit-email/EditEmail";

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
    <div className={"app bg-" + themeMode + " text-" + textColor}>
      <Routes>
        <Route path="/" element={<Default />}></Route>
        <Route path="/user" element={<User />}>
          <Route path="account-settings" element={<AccountSettingsRoute />}>
            <Route path="account-info" element={<AccountInfo />} />
            <Route path="change-email" element={<EditEmail />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
