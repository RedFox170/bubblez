import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 1) Versuche, gespeicherte Benutzerdaten aus dem localStorage zu laden.
  const savedUser = JSON.parse(localStorage.getItem("userData"));

  // 2) Initialisiere den Zustand mit den gespeicherten Benutzerdaten oder null, wenn keine Daten vorhanden sind.
  const [userData, setUserData] = useState(savedUser || null);

  // 3) Initialisiere den Zustand für den Login-Status.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 4) useEffect: Aktualisiere den localStorage und den Login-Status, wenn sich userData ändert.
  useEffect(() => {
    if (userData !== null) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("userData"); // Entferne userData aus localStorage, wenn userData null ist.
      setIsLoggedIn(false); // Setze isLoggedIn auf false, wenn userData null ist.
    }
  }, [userData]);

  // 5) useEffect: Lade die Benutzerdaten vom Server, wenn ein Token im localStorage vorhanden ist.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5500/getUserData", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data); // Setze die Benutzerdaten in den Zustand.
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserData(); // Rufe die Benutzerdaten nur ab, wenn ein Token vorhanden ist.
    }
  }, []);

  // 6) Rückgabe des Kontext-Providers mit den Werten für isLoggedIn, setIsLoggedIn, userData und setUserData.
  return (
    <UserContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
