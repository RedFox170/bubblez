import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../App.css";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(null);

  // Beim erstmaligen Rendern der Seite wird beim Server geprüft, ob der User eingeloggt ist. D.h., ob ein gültiges Session-Cookie vorhanden ist
  
   useEffect(() => {
    const checkLogin = async () => {
      const response = await fetch(
        'http://localhost:4000/users/check-logged-in',
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      if (response.ok) {
        setLoggedIn(true);
      }
    };
    checkLogin();
  }, []);

  // Set theme based on user's preference
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark"); // Check for dark mode preference
    } else {
      setTheme("light"); // Set to light mode if not in dark mode
    }
  }, []);

  // Add or remove dark class from document based on theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark"); // Add dark class
      localStorage.theme = "dark"; // Whenever the user explicitly chooses dark mode
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark class
      localStorage.theme = "light"; // Whenever the user explicitly chooses light mode
    }

    /*     if (theme === "light") {
      document.documentElement.classList.add("light"); // Add dark class
      localStorage.theme = "light"; // Whenever the user explicitly chooses dark mode
    } else {
      document.documentElement.classList.remove("light"); // Remove dark class
      localStorage.theme = "dark"; // Whenever the user explicitly chooses light mode
    } */
  }, [theme]); // Add theme as dependency

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    console.log(theme);
  };

  localStorage.removeItem("theme"); // Whenever the user explicitly chooses to respect the OS preference

  return (
    <div className="h-full relative px-0 box-content bg-slate-500 dark:bg-gray-900 text-slate-100  ">
      <section className="h-fit w-full fixed flex justify-between items-center border-2 border-l-indigo-100 p-1">
        <h1 className="underline flex px-3">Logo</h1>
        <nav className="px-3  border-2 flex justify-center space-x-2 mobile:invisible desktop:visible">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Log In</NavLink>
          <NavLink to="/logout">Log Out</NavLink>
        </nav>
        <button
          className="bg-green-200 p-1 rounded-s-3xl text-gray-900 dark:text-slate-600"
          onClick={handleThemeSwitch}
        >
          {theme} mode
        </button>
      </section>

      <div className="h-screen flex items-center justify-center px-4">
        <Outlet context={[loggedIn, setLoggedIn]} className="" />
      </div>
    </div>
  );
}

export default App;
