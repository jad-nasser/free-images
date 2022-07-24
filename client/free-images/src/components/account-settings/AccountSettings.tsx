import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

const AccountSettings = () => {
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  return (
    <>
      {/*only for small screens */}

      <nav
        className={
          "navbar navbar-expand-md d-md-none navbar-" +
          themeMode +
          " bg-" +
          themeMode
        }
      >
        <div className="container-fluid justify-content-end">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user/account-settings/account-info"
                >
                  Account Info
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user/account-settings/change-name"
                >
                  Change Your Name
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user/account-settings/change-email"
                >
                  Change Your Email
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user/account-settings/change-password"
                >
                  Change Your Password
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user/account-settings/deactivate-account"
                >
                  Deactivate Your Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/*only for large screens */}

      <div className="list-group d-none d-md-block">
        <Link
          to="/user/account-settings/account-info"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Account Info
        </Link>
        <Link
          to="/user/account-settings/change-name"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Your Name
        </Link>
        <Link
          to="/user/account-settings/change-email"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Your Email
        </Link>
        <Link
          to="/user/account-settings/change-password"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Change Your Password
        </Link>
        <Link
          to="/user/account-settings/deactivate-account"
          className={
            "list-group-item list-group-item-action list-group-item-" +
            themeMode
          }
        >
          Deactivate Your Account
        </Link>
      </div>
    </>
  );
};
export default AccountSettings;
