import React from "react";

import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import { Creator } from "@/pages/Creator";
import { Home } from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { Upload } from "@/pages/Upload";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/creator", element: <Creator /> },
      { path: "/upload", element: <Upload /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
