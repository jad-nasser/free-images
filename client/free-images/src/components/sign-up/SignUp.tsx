import React, { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../notification/Notification";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}

const SignUp = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const [emailInvalidFeedback, setEmailInvalidFeedback] = useState<string>(
    "Enter your email address"
  );
  const [passwordInvalidFeedback, setPasswordInvalidFeedback] =
    useState<string>("Enter your account password");
  const [confirmPasswordInvalidFeedback, setConfirmPasswordInvalidFeedback] =
    useState<string>("Confirm your password");
  const emailInput = useRef<null | HTMLInputElement>(null);
  const passwordInput = useRef<null | HTMLInputElement>(null);
  const confirmPasswordInput = useRef<null | HTMLInputElement>(null);
  const firstNameInput = useRef<null | HTMLInputElement>(null);
  const lastNameInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("default", navigate);
  }, [navigate]);
  //handle email input change
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) setEmailInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setEmailInvalidFeedback("Enter your email address");
    else if (e.target.validity.patternMismatch)
      setEmailInvalidFeedback("Enter a valid email address");
  };
  //handle password input change
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (confirmPasswordInput.current)
      confirmPasswordInput.current.pattern = e.target.value;
    if (e.target.validity.valid) setPasswordInvalidFeedback("");
    else if (e.target.validity.valueMissing)
      setPasswordInvalidFeedback("Enter your account password");
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
      setConfirmPasswordInvalidFeedback("Confirm your password");
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
      let signUpData = {
        firstName: firstNameInput.current?.value,
        lastName: lastNameInput.current?.value,
        email: emailInput.current?.value,
        password: passwordInput.current?.value,
      };
      try {
        await axios.post("/users/create-user", signUpData);
        //after successfull sign up
        setNotificationInfo({
          bootstrapColor: "success",
          message: "Your account successfully created",
        });
        navigate("/sign-in");
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
      <h3 className="text-center mb-4">Sign Up</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="first-name-input">
          First name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="First Name"
          id="first-name-input"
          ref={firstNameInput}
          required
        />
        <div className="invalid-feedback">Enter your first name</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="last-name-input">
          Last name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Last Name"
          id="last-name-input"
          ref={lastNameInput}
          required
        />
        <div className="invalid-feedback">Enter your last name</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="email-input">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Email Address"
          id="email-input"
          onChange={handleEmailInputChange}
          ref={emailInput}
          pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
          required
        />
        <div className="invalid-feedback">{emailInvalidFeedback}</div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password-input">
          Account Password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Account Password"
          id="password-input"
          onChange={handlePasswordInputChange}
          ref={passwordInput}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          required
        />
        <div className="invalid-feedback">{passwordInvalidFeedback}</div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="confirm-password-input">
          Confirm password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          id="confirm-password-input"
          onChange={handleConfirmPasswordInputChange}
          ref={confirmPasswordInput}
          required
        />
        <div className="invalid-feedback">{confirmPasswordInvalidFeedback}</div>
      </div>
      <div className="d-grid mb-2">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="mb-3 text-secondary">
        Already registered?{" "}
        <Link to="/sign-in" className="text-decoration-none">
          Sign in
        </Link>
      </p>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default SignUp;
