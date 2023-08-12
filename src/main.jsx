import { ChakraProvider } from "@chakra-ui/react";
import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import { EventPage, loader as postLoader } from "./pages/EventPage";
import {
  EventsPage,
  loader as postListLoader,
  // action as newPostAction,
} from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { Root } from "./components/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: postListLoader,
        // action: newPostAction,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        loader: postLoader,
        // action: addComment,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
