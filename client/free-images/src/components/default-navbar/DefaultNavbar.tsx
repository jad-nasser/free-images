import { useRef } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeColor, changeMode } from "../../redux/themeSlice";

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

interface Params {
  [key: string]: string;
}

const DefaultNavbar = () => {
  const themeColor = useSelector((state: LocalState) => state.theme.color);
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  const searchInput = useRef<null | HTMLInputElement>(null);
  const selectedSort = useRef<string>("alphabetical-order");
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
  //Sorts that the user can select
  const sortByOptions = [
    { value: "alphabetical-order", name: "Alphabetical order" },
    { value: "reverse-alphabetical-order", name: "Reverse alphabetical order" },
    { value: "most-downloaded", name: "Most downloaded" },
  ];
  //handling search button click
  const handleSearchClick = () => {
    if (searchInput.current !== null) {
      let params: Params = {
        sortBy: selectedSort.current,
      };
      if (searchInput.current.value !== "")
        params.name = searchInput.current.value;
      navigate({
        pathname: "/home",
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
  //handling sort change
  const handleSortChange = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    selectedSort.current = e.currentTarget.value;
    if (searchInput.current !== null) {
      let params: Params = {
        sortBy: selectedSort.current,
      };
      if (searchInput.current.value !== "")
        params.name = searchInput.current.value;
      navigate({
        pathname: "/home",
        search: createSearchParams(params).toString(),
      });
    }
  };
  //the component
  return (
    <nav className={"navbar navbar-expand-lg navbar-dark bg-" + themeColor}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
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
              <Link className="nav-link" to="/sign-in">
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sign-up">
                Sign Up
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav me-2">
            <li className="nav-item dropdown">
              <button
                className="dropdown-toggle btn btn-link nav-link"
                id="sortByDropdown"
                data-bs-toggle="dropdown"
              >
                Sort By
              </button>
              <div className="dropdown-menu p-4 mb-2">
                <div className="mb-2">
                  Sort By:
                  {sortByOptions.map((option, index) => {
                    let isSelected = false;
                    if (option.value === selectedSort.current)
                      isSelected = true;
                    return (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="sortBy"
                          id={option.value}
                          value={option.value}
                          defaultChecked={isSelected}
                          onClick={handleSortChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={option.value}
                        >
                          {option.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
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
export default DefaultNavbar;
