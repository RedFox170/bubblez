import fileUpload from "express-fileupload";

const uploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
});

export default uploadMiddleware;
