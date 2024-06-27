import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/context/userContext.jsx";
import { UsersProvider } from "./components/context/usersContext.jsx";
import { ThemeProvider } from "./components/context/ThemeContext.jsx";
import { GroupsProvider } from "./components/context/groupsContext.jsx";
import App from "./App.jsx";
import Home from "./components/landingpage/Home.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import UserRegister from "./components/user/UserRegister.jsx";
import UserLogin from "./components/user/UserLogin.jsx";
import UserLogout from "./components/user/UserLogout.jsx";
import UpdateProfile from "./components/user/UpdateProfile.jsx";
import Profile from "./components/user/Profile.jsx";
import GroupForm from "./components/group/groupForm.jsx";
import GroupOverview from "./components/group/GroupOverview.jsx";
import GroupComponent from "./components/group/GroupComponent.jsx";
import Market from "./components/Market/Market.jsx";
import MarketForm from "./components/Market/MarketForm.jsx";
import { MarketProvider } from "./components/context/marketContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "register", element: <UserRegister /> },
      { path: "login", element: <UserLogin /> },
      { path: "logout", element: <UserLogout /> },
      { path: "updateprofile", element: <UpdateProfile /> },
      { path: "profile/:userId", element: <Profile /> },
      { path: "groupsForm", element: <GroupForm /> },
      { path: "groups", element: <GroupOverview /> },
      { path: "groupsCompo/:groupId", element: <GroupComponent /> },
      { path: "market", element: <Market /> },
      { path: "marketform", element: <MarketForm /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <UsersProvider>
          <GroupsProvider>
            <MarketProvider>
              <RouterProvider router={router}>
                <App />
              </RouterProvider>
            </MarketProvider>
          </GroupsProvider>
        </UsersProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
