import imageSize from "image-size";
const sizeOf = (pathorBuffer: string | Buffer) => {
  return imageSize(pathorBuffer);
};
export default { sizeOf };
