import { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: null,
    lastName: null,
    email: null,
  });
  const navigate = useNavigate();
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  let textColor = "dark";
  if (themeMode === "dark") textColor = "light";
  useEffect(() => {
    const asyncFn = async () => {
      try {
        //making sure that the user is logged in
        await checkLogin("user", navigate);
        //after checking that the user is logged in, getting the user account info
        const response = await axios.get("/users/get-user-info");
        //getting the data from the response
        setUserInfo(response.data.userInfo);
      } catch (error) {
        //console.log(error);
      }
    };
    asyncFn();
  }, [navigate]);
  return (
    <div
      className={
        "d-flex justify-content-center text-" + textColor + " bg-" + themeMode
      }
    >
      <div className="mt-4">
        <div className="mb-2">
          <span className="me-2">
            <strong>First Name:</strong>
          </span>
          <span>{userInfo.firstName}</span>
        </div>
        <div className="mb-2">
          <span className="me-2">
            <strong>Last Name:</strong>
          </span>
          <span>{userInfo.lastName}</span>
        </div>
        <div className="mb-2">
          <span className="me-2">
            <strong>Email:</strong>
          </span>
          <span>{userInfo.email}</span>
        </div>
      </div>
    </div>
  );
};
export default AccountInfo;
