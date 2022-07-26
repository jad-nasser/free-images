import { useEffect, useState } from "react";
import checkLogin from "../../functions/checkLogin";
import getAllSearchParams from "../../functions/getAllSearchParams";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ObjectId } from "mongoose";
import ImageItem from "../image-item/ImageItem";

interface IImage {
  name: string;
  _id: ObjectId;
  userId: string;
  filePath: string;
  resolution: string;
  numberOfDownloads: number;
}
interface Props {
  isLoggedIn: boolean;
}

const ImageItems = (props: Props) => {
  const [images, setImages] = useState<null | IImage[]>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const asyncFn = async () => {
      let pageType = "default";
      let requestUrl = "/images/get-images";
      if (props.isLoggedIn) {
        pageType = "user";
        requestUrl = "/images/get-user-images";
      }
      try {
        //checking if the user is in the correct page type
        await checkLogin(pageType, navigate);
        //getting the image items from the database
        const response = await axios.get(requestUrl, {
          params: getAllSearchParams(searchParams),
        });
        setImages(response.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFn();
  }, [navigate, props.isLoggedIn, searchParams]);
  //the component
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {images &&
        images.map((image, index) => (
          <ImageItem key={index} isLoggedIn={props.isLoggedIn} image={image} />
        ))}
    </div>
  );
};
export default ImageItems;
