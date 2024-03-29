import React from "react";

import { ScrollRestoration, createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import { Creator } from "@/pages/Creator";
import { Home } from "@/pages/Home";
import { NewCreator } from "@/pages/NewCreator";
import NotFound from "@/pages/NotFound";
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
      { path: "/creator/:address", element: <NewCreator /> },
      { path: "/upload", element: <Upload /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
