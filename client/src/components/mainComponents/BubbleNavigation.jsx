import { NavLink } from "react-router-dom";
import "../mainComponents/bubbleNavigation.css";

const BubbleNavigation = () => {
  return (
    <div className="bubble-nav">
      <NavLink to="/dashboard">
        <div className="bubble-item w-20 h-20 md:w-16 md:h-16">Home</div>
      </NavLink>
      <NavLink to="/groups">
        <div className="bubble-item w-20 h-20 md:w-16 md:h-16">Gruppen</div>
      </NavLink>
      <NavLink to="/market">
        <div className="bubble-item w-20 h-20 md:w-16 md:h-16">Marktplatz</div>
      </NavLink>
      <NavLink to="/friends">
        <div className="bubble-item w-20 h-20 md:w-16 md:h-16">Freunde</div>
      </NavLink>
    </div>
  );
};

export default BubbleNavigation;
