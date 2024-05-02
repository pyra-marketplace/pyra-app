import React from "react";

import { ScrollRestoration, createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import { Creator } from "@/pages/Creator";
import { Home } from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { Profile } from "@/pages/Profile";
import { Upload } from "@/pages/Upload";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Layout />
        <ScrollRestoration />
      </>
    ),
    // errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/creator/:address?", element: <Creator /> },
      { path: "/upload", element: <Upload /> },
      { path: "/profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
