import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";

// pages
import Register from "../pages/auth/Register.tsx";
import Login from "../pages/auth/Login.tsx";

import Landing from "../pages/Landing.tsx";
import Chat from "../pages/Chat.tsx";
import Profile from "../pages/Profile.tsx";

import About from "../pages/About.tsx";
import Contact from "../pages/Contact.tsx";

import ProtectedRoutes from "./ProtectedRoutes.tsx";

const router = createBrowserRouter([
 

  // Main Layout
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "chat",
            element: <Chat />,
          },
        ],
      },
    ],
  },

   // Auth Pages
  // Auth Pages
{
  path: "/auth",
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> }
  ]
}
]);

export default router;
