import { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import getAllSearchParams from "../../functions/getAllSearchParams";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const ViewImage = () => {
  const [image, setImage] = useState<null | IImage>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  //getting the book
  useEffect(() => {
    const asycFn = async () => {
      try {
        //checking if the user is in the correct page type
        await checkLogin("default", navigate);
        //after checking that the user is in the correct page type, getting the book
        const response = await axios.get("/images/get-images", {
          params: getAllSearchParams(searchParams),
        });
        setImage(response.data.images[0]);
      } catch (error: any) {
        console.log(error);
      }
    };
    asycFn();
  }, [navigate, searchParams]);
  //handling download button click
  const handleDownloadClick = async () => {
    try {
      await axios.get("/images/download-image", {
        params: { id: image!._id },
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  //the component
  return (
    <div className="text-center p-4">
      {image && (
        <>
          <p className="mb-4" style={{ fontSize: "2em" }}>
            <strong>{image.name}</strong>
          </p>
          <div
            id="image-carousel"
            className="carousel slide mb-4"
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
          <p className="mb-2" style={{ fontSize: "0.83em" }}>
            {image.resolution}
          </p>
          <p className="mb-3" style={{ fontSize: "0.83em" }}>
            {numAbb(image.numberOfDownloads, 1) + " downloads"}
          </p>
          <button
            className="btn btn-primary w-auto mb-4"
            onClick={handleDownloadClick}
          >
            Download
          </button>
        </>
      )}
    </div>
  );
};
export default ViewImage;
