import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
import { handleImageUpload } from "../cloudinary/handleImageUpload.jsx";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6   text-white "
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const UpdateProfile = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [uploadImg, setUploadImg] = useState(null);

  /******************************************************
   *   Bild hochladen - useEffect -
   ******************************************************/

  useEffect(() => {
    console.log("uploading img in useEffect:", uploadImg);
    if (uploadImg) {
      setUserData((prev) => ({ ...prev, image: uploadImg }));
    }
  }, [uploadImg]);

  useEffect(() => {
    console.log("Current userData:", userData);
  }, [userData]);

  /******************************************************
   *   Bild hochladen - onChange -
   ******************************************************/

  const onImageChange = (e) => {
    handleImageUpload(e, setUploadImg);
  };

  /******************************************************
   *   Formdaten löschen - onDelete -
   ******************************************************/
  // Function to handle delete form field
  const onDelete = async (fieldName) => {
    console.log("fieldName:", fieldName);

    try {
      const res = await fetch(`${API_URL}/edit/${userData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          [fieldName]: null,
        }),
      });
      const data = await res.json();
      setUserData(data.user);
      alert("Removed successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  /******************************************************
   *   Formdaten ändern - handleSubmit -
   ******************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataProps = Object.fromEntries(formData);
    const updatedData = {};
    for (let nameAttr in formDataProps) {
      if (formDataProps[nameAttr] !== "") {
        updatedData[nameAttr] = formDataProps[nameAttr];
      }
    }

    // uploadImg zu updatedData hinzufügen
    if (uploadImg) {
      updatedData.image = uploadImg;
    }

    try {
      const res = await fetch(`${API_URL}/edit/${userData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("data:", data, "data.user:", data.user);
        setUserData(data.user);
        alert("Profile updated successfully!");
      } else {
        console.error("Error updating profile:", data.message);
        alert("Error updating profile: " + data.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <section className="flex justify-center mt-16  w-full p-4">
      <div className="relative w-full max-w-4xl">
        <div className="reusableContainer mt-12 shadow-md p-6 bg-white rounded-lg">
          <form
            className="reusableForm grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <div className="col-span-full flex flex-col items-center">
              <div className="profile-image-upload mb-4">
                {userData.image || uploadImg ? (
                  <div className="image-preview flex flex-col items-center">
                    <img
                      src={uploadImg || userData.image}
                      alt="Profile"
                      className="w-[150px] h-[150px] object-cover rounded-full"
                    />
                    <button
                      onClick={() => setUploadImg(null)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ) : (
                  <div className="image-placeholder flex flex-col items-center">
                    <img
                      src="../avatar-icon.jpg"
                      alt="Placeholder"
                      className="w-[150px] h-[150px] object-cover rounded-full"
                    />
                  </div>
                )}
                <label
                  htmlFor="image"
                  className="file-input-label block text-center mt-4"
                >
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={onImageChange}
                    className="file-input hidden"
                  />
                  <span className="reusableFormBtn mt-2">Bild wählen</span>
                </label>
              </div>
            </div>
            <div className="col-span-full">
              <h3 className="reusableH3 mb-2">Hi {userData.userName},</h3>
              <textarea
                name="aboutMe"
                id="aboutMe"
                rows="3"
                placeholder="Hier kannst du dich mit deinen eigenen Worten vorstellen."
                defaultValue={userData.aboutMe || ""}
                className="about-me-textarea w-full p-2 border rounded-md"
              ></textarea>
            </div>
            <div>
              <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                Email:
              </h4>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                readOnly
                className="reusableInput w-full p-2 border rounded-md bg-gray-200 text-gray-800"
              />
            </div>
            <div>
              <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                Anzeigename:
              </h4>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userData.userName}
                readOnly
                className="reusableInput w-full p-2 border rounded-md bg-gray-200 text-gray-800"
              />
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Name:
                </h4>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={userData.name || "Name eingeben"}
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("name")}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Geburtstag:
                </h4>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  placeholder={userData.birthday || "Geburtstag eingeben"}
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("birthday")}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Crew:
                </h4>
                <input
                  type="text"
                  id="crew"
                  name="crew"
                  placeholder={userData.crew || "Crew eingeben"}
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("crew")}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Stadt:
                </h4>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder={userData.city || "Stadt eingeben"}
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("city")}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Interessen:
                </h4>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  placeholder={userData.interests || "Interessen eingeben"}
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("interests")}
              >
                <TrashIcon />
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="w-full">
                <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
                  Familienstand:
                </h4>
                <input
                  type="text"
                  id="familyStatus"
                  name="familyStatus"
                  placeholder={
                    userData.familyStatus || "Familienstand eingeben"
                  }
                  className="reusableInput w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="button"
                className="ml-2"
                onClick={() => onDelete("familyStatus")}
              >
                <TrashIcon />
              </button>
            </div>
            <button
              type="submit"
              className="reusableFormBtn col-span-full mt-4"
            >
              Profil aktualisieren
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
