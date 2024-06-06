import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
import { handleImageUpload } from "../cloudinary/handleImageUpload.jsx";

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
      const res = await fetch(`http://localhost:5500/edit/${userData._id}`, {
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
      const res = await fetch(`http://localhost:5500/edit/${userData._id}`, {
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
    <section className="flex justify-center min-h-screen w-full p-4">
      <div className="relative w-full max-w-4xl">
        <div className="reusableSquare absolute" style={{ "--i": 0 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 1 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 2 }}></div>
        <div className="reusableContainer mt-12 shadow-md p-6 bg-white rounded-lg">
          <form
            className="reusableForm grid grid-cols-1 md:grid-cols-2 gap-6"
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
                      🗑️
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
              <h3 className="reusableH3 mb-4">Hi {userData.userName},</h3>
              <textarea
                name="aboutMe"
                id="aboutMe"
                cols="30"
                rows="5"
                placeholder="Hier kannst du dich mit deinen eigenen Worten vorstellen."
                defaultValue={userData.aboutMe || ""}
                className="about-me-textarea w-full p-2 border rounded-md"
              ></textarea>
            </div>
            <div>
              <label htmlFor="email" className="reusableLabel block mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                readOnly
                className="reusableInput w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
            <div>
              <label htmlFor="userName" className="reusableLabel block mb-1">
                Anzeigename:
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userData.userName}
                readOnly
                className="reusableInput w-full p-2 border rounded-md bg-gray-200"
              />
            </div>
            <div className="relative">
              <label htmlFor="name" className="reusableLabel block mb-1">
                Name:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("name")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={userData.name || "Name eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label htmlFor="birthday" className="reusableLabel block mb-1">
                Geburtstag:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("birthday")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                placeholder={userData.birthday || "Geburtstag eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label htmlFor="crew" className="reusableLabel block mb-1">
                Crew:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("crew")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="text"
                id="crew"
                name="crew"
                placeholder={userData.crew || "Crew eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label htmlFor="city" className="reusableLabel block mb-1">
                Stadt:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("city")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder={userData.city || "Stadt eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label htmlFor="interests" className="reusableLabel block mb-1">
                Interessen:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("interests")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="text"
                id="interests"
                name="interests"
                placeholder={userData.interests || "Interessen eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="familyStatus"
                className="reusableLabel block mb-1"
              >
                Familienstand:
                <button
                  type="button"
                  className="bg-slate-50 absolute top-7 right-1 rounded-md p-0.5 opacity-40 hover:opacity-100"
                  onClick={() => onDelete("familyStatus")}
                >
                  🗑️
                </button>
              </label>
              <input
                type="text"
                id="familyStatus"
                name="familyStatus"
                placeholder={userData.familyStatus || "Familienstand eingeben"}
                className="reusableInput w-full p-2 border rounded-md"
              />
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
