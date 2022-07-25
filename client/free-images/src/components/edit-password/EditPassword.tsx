import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}

const EditPassword = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const [passwordInvalidFeedback, setPasswordInvalidFeedback] =
    useState<string>("Enter your new password");
  const [confirmPasswordInvalidFeedback, setConfirmPasswordInvalidFeedback] =
    useState<string>("Confirm your new password");
  const passwordInput = useRef<null | HTMLInputElement>(null);
  const oldPasswordInput = useRef<null | HTMLInputElement>(null);
  const confirmPasswordInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handle password input change
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (confirmPasswordInput.current)
      confirmPasswordInput.current.pattern = e.target.value;
    if (e.target.validity.valid) setPasswordInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setPasswordInvalidFeedback("Enter your new password");
    else if (e.target.validity.patternMismatch)
      setPasswordInvalidFeedback(
        "Password should contains at least 8 characters, containing one lowercase, uppercase, number, and special character from the following: @$!%*?&"
      );
  };
  //handle confirm password input change
  const handleConfirmPasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.validity.valid) setConfirmPasswordInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setConfirmPasswordInvalidFeedback("Confirm your new password");
    else if (e.target.validity.patternMismatch)
      setConfirmPasswordInvalidFeedback(
        "Password confirmation should match the password"
      );
  };
  //handling form submit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = e.target as HTMLFormElement;
    element.classList.add("was-validated");
    if (element.checkValidity()) {
      let updateInfo = {
        newPassword: passwordInput.current?.value,
        oldPassword: oldPasswordInput.current?.value,
      };
      try {
        await axios.patch("/users/update-user", { updateInfo });
        //after successfull password change
        setNotificationInfo({
          bootstrapColor: "success",
          message: "Your password successfully changed",
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
      <h3 className="text-center mb-4">Change Your Password</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="new-password-input">
          New password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="New Password"
          id="new-password-input"
          onChange={handlePasswordInputChange}
          ref={passwordInput}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          required
        />
        <div className="invalid-feedback">{passwordInvalidFeedback}</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="confirm-password-input">
          Confirm new password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm New Password"
          id="confirm-password-input"
          onChange={handleConfirmPasswordInputChange}
          ref={confirmPasswordInput}
          required
        />
        <div className="invalid-feedback">{confirmPasswordInvalidFeedback}</div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="old-password-input">
          Old password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Old Password"
          id="old-password-input"
          ref={oldPasswordInput}
          required
        />
        <div className="invalid-feedback">Enter your old password</div>
      </div>
      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-primary">
          Change Password
        </button>
      </div>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default EditPassword;
