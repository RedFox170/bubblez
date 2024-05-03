import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import { GroupsContext } from "../context/groupsContext.jsx";
import "../reuseable/styles/reusableFormComponents.css";
import "../reuseable/styles/reusableGlobal.css";
import { CustomCheckbox } from "../reuseable/CustomCheckbox.jsx";

const GroupForm = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadImg, setUploadImg] = useState("");
  const { groupsData, setGroupsData } = useContext(GroupsContext);

  const navigate = useNavigate();

  useEffect(() => {
    formData.image = uploadImg;
  }, [uploadImg]);

  const [formData, setFormData] = useState({
    title: "",
    text: "",
    image: "",
    tags: "",
    privateGroup: false,
  });

  /******************************************************
   *    handleChange
   ******************************************************/

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value, type, checked, files } = e.target;
    let newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue, // Keine Notwendigkeit, den Wert in ein Array zu verpacken
    }));
  };

  const handleTogglePrivate = () => {
    console.log("Checkbox löst aus");
    setFormData((prevData) => ({
      ...prevData,
      privateGroup: !prevData.privateGroup,
    }));
  };

  /******************************************************
   *     Bild-Upload
   ******************************************************/

  const handleImageUpload = (e) => {
    const image = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadImg(reader.result);
    };
    reader.readAsDataURL(image);
  };

  /******************************************************
   *    handleSubmit
   ******************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData GroupFom", formData);
    try {
      const response = await fetch("http://localhost:5500/createGroup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("response status:", typeof response.status);

      // Überprüfen, ob die Gruppe(Title) bereits existiert
      if (response.status === 409) {
        console.log("IF LÖST AUS!");
        setErrorMessage("Gruppenname bereits vergeben.");
      }

      // User.groups und LocalStorage aktualisieren (frontend)
      setUserData({ ...userData, groups: [...userData.groups, data] });
      console.log(groupsData);
      setGroupsData([...groupsData, data]);

      navigate("/groups");
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen w-full relative">
      <div className="reusableSquareContainer absolute inset-0 flex items-center justify-center">
      <div className="reusableBubble" style={{ "--i": 0, position: "absolute", top: "250px", right: "100px", width: "200px", height: "200px", zIndex: 2 }}></div>
      <div className="reusableBubble" style={{ "--i": 1, position: "absolute", top: "220px", left: "120px", width: "120px", height: "120px", zIndex: 2 }}></div>
    <div className="reusableBubble" style={{ "--i": 2, position: "absolute", top: "500px", right: "650px", width: "140px", height: "140px", zIndex: 2 }}></div>
    <div className="reusableBubble" style={{ "--i": 3, position: "absolute", bottom: "100px", right: "100px", width: "250px", height: "250px", zIndex: 0 }}></div>
    <div className="reusableBubble" style={{ "--i": 4, position: "absolute", bottom: "150px", left: "100px", width: "150px", height: "150px", zIndex: 2 }}></div>
      </div>
      <div className="max-w-md">
        <div className="reusableContainer reusableFormContainer reusableBorder mt-12 p-11 shadow-md relative flex justify-center items-center">
          <form className="reusableForm" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Erstelle eine neue Gruppe 
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-800"
                >
                  Name der Gruppe
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="reusableInput mt-1 p-2 text-gray-800 block w-full border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-800"
                >
                  Gruppenbeschreibung
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows="4"
                  className="reusableTextarea"
                ></textarea>
              </div>
              <CustomCheckbox
                isChecked={formData.privateGroup}
                onToggle={handleTogglePrivate}
                label="Private Gruppe"
              />
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-800"
                >
                  Bild hochladen
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                  className="reusableInput mt-1 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-800"
                >
                  Kategorie
                </label>
                <select
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block text-gray-800 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="" disabled>
                    Wähle eine Kategorie aus...
                  </option>
                  <option value="Kennlern/Stammtisch">
                    Kennlern/Stammtisch
                  </option>
                  <option value="Bildung/Erfahrung">Bildung/Erfahrung</option>
                  <option value="Kunst, Kultur & Musik">
                    Kunst, Kultur & Musik
                  </option>
                  <option value="Märkte & Flohmärkte">
                    Märkte & Flohmärkte
                  </option>
                  <option value="Computer, Internet & Technik">
                    Computer, Internet & Technik
                  </option>
                  <option value="Familien & Kinder">Familien & Kinder</option>
                  <option value="Essen & Trinken">Essen & Trinken</option>
                  <option value="Feste & Feiern">Feste & Feiern</option>
                  <option value="Lokales Engagement">Lokales Engagement</option>
                  <option value="Gestalten & Heimwerken">
                    Gestalten & Heimwerken
                  </option>
                  <option value="Gesundheit / Wellness">
                    Gesundheit / Wellness
                  </option>
                  <option value="Sport & Bewegung">Sport & Bewegung</option>
                  <option value="Umwelt & Nachhaltigkeit">
                    Umwelt & Nachhaltigkeit
                  </option>
                  <option value="Teilen, Tauschen, Reparieren">
                    Teilen, Tauschen, Reparieren
                  </option>
                  <option value="Viertel verschönern">
                    Viertel verschönern
                  </option>
                  <option value="Ausflüge">Ausflüge</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
              </div>
              <button type="submit" className="reusableFormBtn">
                Neue Gruppe erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GroupForm;
