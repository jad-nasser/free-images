import { URLSearchParams } from "url";

interface Params {
  [key: string]: string;
}

//this functions returns all search params in an object

const getAllSearchParams = (searchParams: URLSearchParams): Params => {
  let allParams: Params = {};
  searchParams.forEach((value, key, parent) => {
    if (key === "_id") allParams["id"] = value;
    else allParams[key] = value;
  });
  return allParams;
};

export default getAllSearchParams;
