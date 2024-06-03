import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { GroupsContext } from "../context/groupsContext.jsx";
import { UsersContext } from "../context/usersContext.jsx";

const UserLogout = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const { setGroupsData } = useContext(GroupsContext);
  const { clearUsersData } = useContext(UsersContext);
  const navigate = useNavigate();
  console.log("UserLogout.jsx");
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("http://localhost:5500/logout", {
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
      }
    };

    logout();
  }, [setIsLoggedIn, setGroupsData, clearUsersData, navigate]);

  return null; // Kein visueller Inhalt
};

export default UserLogout;
