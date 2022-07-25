// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}

const EditName = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const firstNameInput = useRef<null | HTMLInputElement>(null);
  const lastNameInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handling form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let element = e.target as HTMLFormElement;
    element.classList.add("was-validated");
    if (element.checkValidity()) {
      let updateInfo = {
        firstName: firstNameInput.current?.value,
        lastName: lastNameInput.current?.value,
      };
      try {
        await axios.patch(
          process.env.REACT_APP_BASE_URL + "/users/update-user",
          { updateInfo }
        );
        //after successfull update
        setNotificationInfo({
          bootstrapColor: "success",
          message: "Your name successfully changed",
        });
      } catch (error) {
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
      <h3 className="text-center mb-4">Change Your Name</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="first-name-input">
          New first name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="New First Name"
          id="first-name-input"
          ref={firstNameInput}
          required
        />
        <div className="invalid-feedback">Enter your new first name</div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="last-name-input">
          New last name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="New Last Name"
          id="last-name-input"
          ref={lastNameInput}
          required
        />
        <div className="invalid-feedback">Enter your new last name</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Name
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditName;
