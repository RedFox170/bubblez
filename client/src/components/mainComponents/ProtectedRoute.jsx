import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isLoggedIn } = useContext(UserContext);

  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
