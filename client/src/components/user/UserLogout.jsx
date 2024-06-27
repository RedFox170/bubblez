import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { GroupsContext } from "../context/groupsContext.jsx";
import { UsersContext } from "../context/usersContext.jsx";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const UserLogout = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const { setGroupsData } = useContext(GroupsContext);
  const { clearUsersData, handleLogout } = useContext(UsersContext);
  const navigate = useNavigate();
  console.log("UserLogout.jsx");

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch(`${API_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          console.log("Logout successful, clearing context and local storage");
          // Kontext-Daten leeren
          setGroupsData([]);
          clearUsersData();
          setIsLoggedIn(false);

          // LocalStorage löschen
          localStorage.clear();
          navigate("/login");
        } else {
          throw new Error("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
        handleLogout();
        navigate("/login");
      }
    };

    logout();
  }, [setIsLoggedIn, setGroupsData, clearUsersData, handleLogout, navigate]);

  return null; // Kein visueller Inhalt
};

export default UserLogout;
