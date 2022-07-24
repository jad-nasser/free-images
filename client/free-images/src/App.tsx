import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import AccountInfo from "./components/account-info/AccountInfo";

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
        <Route path="/"></Route>
        <Route path="/user">
          <Route path="account-settings" element={<AccountInfo />}>
            <Route path="account-info" />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
