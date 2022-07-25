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

const EditEmail = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const [emailInvalidFeedback, setEmailInvalidFeedback] = useState<string>(
    "Enter your new email address"
  );
  const emailInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handle email input change
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) setEmailInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setEmailInvalidFeedback("Enter your new email address");
    else if (e.target.validity.patternMismatch)
      setEmailInvalidFeedback("Enter a valid email address");
  };
  //handling form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let element = e.target as HTMLFormElement;
    element.classList.add("was-validated");
    if (element.checkValidity()) {
      let updateInfo = {
        email: emailInput.current?.value,
      };
      try {
        await axios.patch("/users/update-user", { updateInfo });
        //after successfull update
        setNotificationInfo({
          bootstrapColor: "success",
          message: "Your email address successfully changed",
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
      <h3 className="text-center mb-4">Change Your Email Address</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="email-input">
          New email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="New Email Address"
          id="email-input"
          onChange={handleEmailInputChange}
          ref={emailInput}
          pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
          required
        />
        <div className="invalid-feedback">{emailInvalidFeedback}</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Email
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditEmail;
