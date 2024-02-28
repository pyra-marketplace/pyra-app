import React from "react";

import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Layout />, errorElement: <NotFound /> },
  { path: "*", element: <NotFound /> },
]);
