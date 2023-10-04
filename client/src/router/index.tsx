/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import { Profile } from "../pages/Profile";
import ErrorLayout from "./ErrorLayout";
import AuthLayout from "../pages/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

export const route = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorLayout />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <Register />,
        path: "/register",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Home />,
            path: "/",
          },
          {
            element: <Profile />,
            path: "/profile",
          },
        ],
      },
    ],
  },
]);
