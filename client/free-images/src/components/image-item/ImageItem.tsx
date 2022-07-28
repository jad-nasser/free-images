import { useNavigate, createSearchParams } from "react-router-dom";
import numAbb from "number-abbreviate";
import { ObjectId } from "mongoose";

interface IImage {
  name: string;
  _id: ObjectId;
  userId: string;
  filePath: string;
  resolution: string;
  numberOfDownloads: number;
}

const ImageItem = (props: { image: IImage; isLoggedIn: boolean }) => {
  const navigate = useNavigate();
  const handleImageItemClick = () => {
    if (props.isLoggedIn)
      navigate({
        pathname: "/user/edit-image",
        search: createSearchParams({
          _id: props.image._id.toString(),
        }).toString(),
      });
    else
      navigate({
        pathname: "/view-image",
        search: createSearchParams({
          _id: props.image._id.toString(),
        }).toString(),
      });
  };
  return (
    <div
      className="card text-center"
      style={{ cursor: "pointer" }}
      onClick={handleImageItemClick}
    >
      <img
        src={process.env.REACT_APP_BASE_URL + "/" + props.image.filePath}
        className="card-img-top"
        style={{ objectFit: "cover", height: "15em" }}
        alt={props.image.name}
      />
      <div className="card-body">
        <h5 className="card-title text-dark">{props.image.name}</h5>
        <div className="card-text">
          <small className="text-muted">{props.image.resolution}</small>
        </div>
        <div className="card-text">
          <small className="text-muted">
            {numAbb(props.image.numberOfDownloads, 1) + " downloads"}
          </small>
        </div>
      </div>
    </div>
  );
};
export default ImageItem;
