import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import "./css/index.css";
import Welcome from "./components/welcome/Welcome";
import Login from "./components/welcome/Login";
import Register from "./components/welcome/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Guftgu from "./components/dashboard/Guftgu";
import Mehfil from "./components/dashboard/Mehfil";
import Protected from "./utility/Protected";
import ErrorPage from "./components/utility/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
        children: [
          {
            path: "/",
            element: (
              <Protected>
                <Mehfil />
              </Protected>
            ),
          },
          {
            path: "/guftgu",
            element: (
              <Protected>
                <Guftgu />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "/",
        element: <Welcome />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
