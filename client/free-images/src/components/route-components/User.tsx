import { Outlet } from "react-router-dom";
import UserNavbar from "../user-navbar/UserNavbar";
const User = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};
export default User;
