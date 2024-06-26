const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

export const handleImageUpload = async (e, setUploadImg) => {
  const image = e.target.files[0];
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      setUploadImg(data.url);
    } else {
      console.error("Image upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
