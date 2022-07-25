import { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Notification from "../notification/Notification";

interface NotificationInfo {
  bootstrapColor: string;
  message: string;
}
interface LocalState {
  theme: {
    mode: string;
    color: string;
  };
}

const DeactivateAccount = () => {
  const [notificationInfo, setNotificationInfo] =
    useState<null | NotificationInfo>(null);
  const navigate = useNavigate();
  const themeMode = useSelector((state: LocalState) => state.theme.mode);
  let bsModalWhiteCloseButtonClass = "";
  if (themeMode === "dark") bsModalWhiteCloseButtonClass = "btn-close-white";
  //checking if the user is in the correct page type
  useEffect(() => {
    checkLogin("user", navigate);
  }, [navigate]);
  //handling yes click
  const handleYesClick = async () => {
    try {
      //deleting the publisher
      await axios.delete("/users/delete-user");
      //after successfull account deactivation
      setNotificationInfo({
        bootstrapColor: "success",
        message: "Your account successfully deactivated",
      });
      await checkLogin("user", navigate);
    } catch (error: any) {
      setNotificationInfo({
        bootstrapColor: "danger",
        message: error.response.data,
      });
    }
  };
  //the component
  return (
    <>
      {/*modal start*/}
      <div className="modal fade" id="confirm-modal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className={"modal-content bg-" + themeMode}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Deactivate Your Account
              </h5>
              <button
                type="button"
                className={"btn-close " + bsModalWhiteCloseButtonClass}
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to deactivate your account? All your images
              will be deleted if you choose to deactivate your account.
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
      <h3 className="text-center mb-4 mt-4">Deactivate Your Account</h3>
      <p className="text-danger mb-3 mx-2 fw-bold">
        Warning: This will permanently delete your account, and all your images
        will be deleted.
      </p>
      <div className="row justify-content-center mb-3">
        <button
          className="btn btn-danger w-auto"
          data-bs-toggle="modal"
          data-bs-target="#confirm-modal"
        >
          Deactivate Account
        </button>
      </div>
      <div className="mx-2">
        <Notification notificationInfo={notificationInfo} />
      </div>
    </>
  );
};
export default DeactivateAccount;
