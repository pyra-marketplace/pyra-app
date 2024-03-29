import React from "react";

import { Outlet, useLocation } from "react-router-dom";

import { CreatorHeader } from "./CreatorHeader";
import { HomeHeader } from "./HomeHeader";
import Navbar from "./Navbar";
import { Container, BodyWrapper } from "./styled";
import { UploadHeader } from "./UploadHeader";

const Layout: React.FC = (): React.ReactElement => {
  const location = useLocation();

  return (
    <Container flex={location.pathname === "/upload"}>
      {location.pathname === "/" && <Navbar />}
      {location.pathname.startsWith("/creator") && <Navbar />}
      {location.pathname === "/upload" && <UploadHeader />}
      <BodyWrapper
        containerFlex={location.pathname === "/upload"}
        flex={location.pathname === "/upload"}
      >
        <Outlet />
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
