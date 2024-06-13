import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/mainComponents/Navbar.jsx";
import { ThemeContext } from "./components/context/ThemeContext.jsx";
import { useContext } from "react";
import Bubblez from "./components/mainComponents/styling/Bubblez.jsx";

const App = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`app-container ${
        darkMode ? "new-dark-mode" : "new-light-mode"
      }`}
    >
      <Navbar />
      <Bubblez />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
