import { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
import FormData from "form-data";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}

const AddImage = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const imageNameInput = useRef<null | HTMLInputElement>(null);
  const imageFileInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handling form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = e.target as HTMLFormElement;
    element.classList.add("was-validated");
    if (element.checkValidity()) {
      try {
        const formData = new FormData();
        formData.append("name", imageNameInput.current?.value);
        formData.append(
          "image-file",
          imageFileInput.current!.files![0],
          imageFileInput.current!.files![0].name
        );
        await axios.post("/images/create-image", formData);
        //after the image is successfully added
        setNotificationInfo({
          bootstrapColor: "success",
          message: "Image successfully added",
        });
      } catch (error: any) {
        setNotificationInfo({
          bootstrapColor: "danger",
          message: error.response.data,
        });
      }
    }
  };
  //the component
  return (
    <form
      className="form-container my-5 mx-auto needs-validation"
      onSubmit={handleFormSubmit}
      noValidate
    >
      <h3 className="text-center mb-4">Add New Image</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="image-name-input">
          Image Name
        </label>
        <input
          type="text"
          className="form-control"
          id="image-name-input"
          placeholder="Image Name"
          ref={imageNameInput}
          required
        />
        <div className="invalid-feedback">Enter image name</div>
      </div>
      <div className="mb-5">
        <label htmlFor="image-file-input" className="form-label">
          Select Image
        </label>
        <input
          type="file"
          className="form-control"
          id="image-file-input"
          data-testid="image-file-input"
          accept=".jpg,.jpeg,.png,.raw"
          ref={imageFileInput}
          required
        />
        <div className="invalid-feedback">Select image file</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Add Image
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default AddImage;
