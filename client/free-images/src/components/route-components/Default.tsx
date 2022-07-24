import { Outlet } from "react-router-dom";
import DefaultNavbar from "../default-navbar/DefaultNavbar";
const Default = () => {
  return (
    <>
      <DefaultNavbar />
      <Outlet />
    </>
  );
};
export default Default;
