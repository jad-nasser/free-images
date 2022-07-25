import { useRef } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeColor, changeMode } from "../../redux/themeSlice";
import axios from "axios";
import checkLogin from "../../functions/checkLogin";

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

interface Params {
  [key: string]: string;
}

const UserNavbar = () => {
  const themeColor = useSelector((state: LocalState) => state.theme.color);
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  const searchInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //theme colors and modes that the user can select
  const colorObject = (color_name: string, bs_color: string) => {
    return { color_name, bs_color };
  };
  const themeModes = ["Light", "Dark"];
  const themeColors = [
    colorObject("Blue", "primary"),
    colorObject("Red", "danger"),
    colorObject("Green", "success"),
    colorObject("Orange", "warning"),
    colorObject("Aqua", "info"),
    colorObject("Grey", "secondary"),
  ];
  //handling search button click
  const handleSearchClick = () => {
    if (searchInput.current !== null) {
      let params: Params = {};
      if (searchInput.current.value !== "")
        params.name = searchInput.current.value;
      navigate({
        pathname: "/user/home",
        search: createSearchParams(params).toString(),
      });
    }
  };
  //handling theme mode change
  const handleThemeModeChange = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    dispatch(changeMode(e.currentTarget.value));
  };
  //handling theme color change
  const handleThemeColorChange = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    dispatch(changeColor(e.currentTarget.value));
  };
  //handle sign out click
  const handleSignOutClick = async () => {
    await axios.delete("/users/sign-out");
    await checkLogin("user", navigate);
  };
  //the component
  return (
    <nav className={"navbar navbar-expand-lg navbar-dark bg-" + themeColor}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/user/home">
          Free Images
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
              >
                Change Theme
              </button>
              <div className="dropdown-menu p-4">
                <div className="mb-2">
                  Theme Mode:
                  {themeModes.map((mode, index) => {
                    let isSelected = false;
                    if (mode.toLowerCase() === themeMode) isSelected = true;
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="themeMode"
                          id={mode.toLowerCase()}
                          value={mode.toLowerCase()}
                          defaultChecked={isSelected}
                          onClick={handleThemeModeChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={mode.toLowerCase()}
                        >
                          {mode}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div>
                  Theme Color:
                  {themeColors.map((color, index) => {
                    let isSelected = false;
                    if (themeColor === color.bs_color) isSelected = true;
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="themeColor"
                          id={color.color_name}
                          value={color.bs_color}
                          defaultChecked={isSelected}
                          onClick={handleThemeColorChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={color.color_name}
                        >
                          {color.color_name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/user/account-settings/account-info"
              >
                Account Settings
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={handleSignOutClick}
              >
                Sign Out
              </button>
            </li>
          </ul>
          <div className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Images"
              ref={searchInput}
            />
            <button
              className="btn btn-outline-light"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default UserNavbar;
