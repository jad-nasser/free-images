import { Outlet } from "react-router-dom";
import AccountSettings from "../account-settings/AccountSettings";
const AccountSettingsRoute = () => {
  return (
    <div className="d-md-flex">
      <div className="m-md-2">
        <AccountSettings />
      </div>
      <div className="flex-md-grow-1">
        <Outlet />
      </div>
    </div>
  );
};
export default AccountSettingsRoute;
