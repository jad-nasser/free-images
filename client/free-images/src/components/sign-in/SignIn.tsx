import { useEffect, useRef, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../notification/Notification";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}

const SignIn = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const emailInput = useRef<null | HTMLInputElement>(null);
  const passwordInput = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handling sign in click
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const element = e.target as HTMLFormElement;
    element.classList.add("was-validated");
    if (element.checkValidity()) {
      let loginData = {
        email: emailInput.current?.value,
        password: passwordInput.current?.value,
      };
      try {
        await axios.post("/users/sign-in", loginData);
        //after successfull sign in
        await checkLogin("default", navigate);
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
      <h3 className="text-center mb-4">Sign In</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="email-input">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          id="email-input"
          ref={emailInput}
          required
        />
        <div className="invalid-feedback">Enter your email</div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="password-input">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          id="password-input"
          ref={passwordInput}
          required
        />
        <div className="invalid-feedback">Enter your password</div>
      </div>
      <div className="d-grid mb-2">
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </div>
      <p className="mb-3 text-secondary">
        Not registered yet?{" "}
        <Link to="/sign-up" className="text-decoration-none">
          Sign up
        </Link>
      </p>
      <Notification notificationInfo={notificationInfo} />
    </form>
  );
};
export default SignIn;
