import { useSelector } from "react-redux";

interface LocalState {
  theme: { mode: string; color: string };
}

const Footer = () => {
  const themeColor = useSelector((state: LocalState) => state.theme.color);
  return (
    <div className={"container-fluid p-4 text-light bg-" + themeColor}>
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <span>&copy; 2022 Free Images, Inc</span>
          </div>
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <i className="fa fa-twitter"></i>
            </li>
            <li className="ms-3">
              <i className="fa fa-instagram"></i>
            </li>
            <li className="ms-3">
              <i className="fa fa-facebook"></i>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
export default Footer;
