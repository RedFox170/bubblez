import cloudinary from "./cloudinaryConfig.js";

const uploadImage = async (req, res) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

export { uploadImage };
