import { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "../notification/Notification";
import FormData from "form-data";
import getAllSearchParams from "../../functions/getAllSearchParams";
import numAbb from "number-abbreviate";
import { useSelector } from "react-redux";
import { ObjectId } from "mongoose";

interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}
interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}
interface IImage {
  name: string;
  _id: ObjectId;
  userId: string;
  filePath: string;
  resolution: string;
  numberOfDownloads: number;
}
interface UpdateInfo {
  name?: string;
}

const EditImage = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const [image, setImage] = useState<null | IImage>(null);
  const [disabledProperty, setDisabledProperty] = useState<boolean>(true);
  const imageNameInput = useRef<null | HTMLInputElement>(null);
  const imageFileInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  let bsModalWhiteCloseButtonClass = "";
  if (themeMode === "dark") bsModalWhiteCloseButtonClass = "btn-close-white";
  useEffect(() => {
    const asyncFn = async () => {
      try {
        //checking if the user is in the correct page type
        await checkLogin("user", navigate);
        //getting the image from the database according to the search params
        const response = await axios.get("/images/get-images", {
          params: getAllSearchParams(searchParams),
        });
        setImage(response.data.images[0]);
      } catch (error: any) {
        console.log(error);
      }
    };
    asyncFn();
  }, [navigate, searchParams]);
  //handling edit image click
  const handleEditImageClick = async () => {
    try {
      const formData = new FormData();
      let updateInfo: UpdateInfo = {};
      if (imageNameInput.current!.value)
        updateInfo.name = imageNameInput.current!.value;
      if (imageFileInput.current!.files!.length > 0)
        formData.append(
          "image-file",
          imageFileInput.current!.files![0],
          imageFileInput.current!.files![0].name
        );
      formData.append("updateInfo", JSON.stringify(updateInfo));
      formData.append("id", image!._id);
      await axios.patch("/images/update-image", formData);
      //after the image is successfully updated
      setNotificationInfo({
        bootstrapColor: "success",
        message: "Image successfully edited",
      });
    } catch (error: any) {
      setNotificationInfo({
        bootstrapColor: "danger",
        message: error.response.data,
      });
    }
  };
  //handle yes click
  const handleYesClick = async () => {
    try {
      await axios.delete("/images/delete-image", {
        data: { id: image!._id },
      });
      setNotificationInfo({
        bootstrapColor: "success",
        message: "Image successfully deleted",
      });
      navigate("/user/home");
    } catch (error: any) {
      setNotificationInfo({
        bootstrapColor: "danger",
        message: error.response.data,
      });
    }
  };
  //handle input change
  const handleInputChange = () => {
    if (
      imageNameInput.current!.value ||
      imageFileInput.current!.files!.length > 0
    ) {
      if (disabledProperty) setDisabledProperty(false);
    } else {
      if (!disabledProperty) setDisabledProperty(true);
    }
  };
  //the component
  return (
    <>
      {image && (
        <>
          {/*modal start*/}
          <div className="modal fade" id="confirm-modal" tabIndex={-1}>
            <div className="modal-dialog">
              <div className={"modal-content bg-" + themeMode}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete This Image
                  </h5>
                  <button
                    type="button"
                    className={"btn-close " + bsModalWhiteCloseButtonClass}
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this image?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleYesClick}
                    data-bs-dismiss="modal"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*modal end*/}
          <div className="form-container py-3 mx-auto">
            <h1 className="text-center mb-4">{image.name}</h1>
            <div
              id="image-carousel"
              className="carousel slide mb-3"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner rounded">
                <div className="carousel-item active">
                  <img
                    src={image.filePath}
                    className="d-block w-100"
                    alt={image.name}
                  />
                </div>
              </div>
            </div>
            <h6 className="text-center mb-2">{image.resolution}</h6>
            <h6 className="text-center mb-4">
              {numAbb(image.numberOfDownloads, 1) + " downloads"}
            </h6>
            <div className="mb-3">
              <label className="form-label" htmlFor="image-name-input">
                Change Image Name
              </label>
              <input
                type="text"
                className="form-control"
                id="image-name-input"
                placeholder="New Image Name"
                onChange={handleInputChange}
                ref={imageNameInput}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image-file-input" className="form-label">
                Change Image File
              </label>
              <input
                type="file"
                className="form-control"
                id="image-file-input"
                data-testid="image-file-input"
                accept=".jpg,.jpeg,.png,.raw"
                onChange={handleInputChange}
                ref={imageFileInput}
              />
            </div>
            <p className="fw-bold">
              Note: Its not necessary to fill all the inputs, you only need to
              fill the inputs that you need to change.
            </p>
            <div className="d-flex mb-3 justify-content-between">
              <button
                className="btn btn-primary"
                onClick={handleEditImageClick}
                disabled={disabledProperty}
              >
                Edit Image
              </button>
              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#confirm-modal"
              >
                Delete Image
              </button>
            </div>
            <Notification notificationInfo={notificationInfo} />
          </div>
        </>
      )}
    </>
  );
};
export default EditImage;
