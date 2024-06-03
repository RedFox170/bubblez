import { useRef, useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { GroupsContext } from "../context/groupsContext.jsx";
import { UsersContext } from "../context/usersContext.jsx";

export const DropDownProfile = () => {
  const [hideProfile, setHideProfile] = useState(true);

  const { setIsLoggedIn } = useContext(UserContext);
  const { setGroupsData } = useContext(GroupsContext);
  const { clearUsersData } = useContext(UsersContext);
  const navigate = useNavigate();

  const profileRef = useRef();
  const imgRef = useRef();

  const handleDrop = () => {
    setHideProfile((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        imgRef.current &&
        !imgRef.current.contains(e.target)
      ) {
        setHideProfile(true);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const userData = localStorage.getItem("userData");
  let userId = null;

  if (userData) {
    try {
      const user = JSON.parse(userData);
      userId = user._id;
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }

  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      const response = await fetch("http://localhost:5500/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setGroupsData([]);
        clearUsersData();
        setIsLoggedIn(false);
        localStorage.clear();
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="nav-items flex items-center gap-4" onClick={handleDrop}>
      <button ref={imgRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 btn-profile"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      {hideProfile ? (
        <div className="absolute w-fit top-12 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"></div>
      ) : (
        <div
          className="absolute w-48 top-12 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2"
          ref={profileRef}
        >
          <ul className="flex flex-col">
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <NavLink to={`/profile/${userId}`} className="block">
                Profile anzeigen
              </NavLink>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <NavLink to="/updateprofile" className="block">
                Profile bearbeiten
              </NavLink>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Settings
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <button onClick={handleLogout} className="block w-full text-left">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownProfile;
