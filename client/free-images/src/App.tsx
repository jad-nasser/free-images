import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  axios.defaults.withCredentials = true;
  return (
    <div>
      <Routes>
        <Route></Route>
      </Routes>
    </div>
  );
}

export default App;
