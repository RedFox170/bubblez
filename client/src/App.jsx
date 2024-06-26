import { Outlet } from "react-router-dom";
import "../src/components/reuseable/styles/reusableFormComponents.css";
import "../src/components/reuseable/styles/reusableGlobal.css";
import "./App.css";
import Navbar from "./components/mainComponents/Navbar.jsx";
import { ThemeContext } from "./components/context/ThemeContext.jsx";
import { useContext } from "react";

const App = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? "dark darkThemeColor" : ""}`}>
      <section className="flex justify-center  w-full">
        <Navbar />
        <div className="absolute inset-0">
          <div className="fixed reusableGlobalBackground "></div>
          <div className="fixed reusableGlobalBackground "></div>
          <div className=" fixed reusableGlobalBackground "></div>
          <div className=" fixed reusableGlobalBackground "></div>
        </div>

        <div className={` flex flex-col w-full relative`}>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default App;
