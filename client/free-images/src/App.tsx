import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import AccountSettings from "./components/account-settings/AccountSettings";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Routes>
        <Route path="/"></Route>
        <Route path="/user">
          <Route path="account-settings" element={<AccountSettings />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
