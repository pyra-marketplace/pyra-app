import React from "react";

import { Outlet, useLocation } from "react-router-dom";

import { CreatorHeader } from "./CreatorHeader";
import { HomeHeader } from "./HomeHeader";
import { Container, BodyWrapper } from "./styled";
import { UploadHeader } from "./UploadHeader";

const Layout: React.FC = (): React.ReactElement => {
  const location = useLocation();

  return (
    <Container flex={location.pathname === "/upload"}>
      {location.pathname === "/" && <HomeHeader />}
      {location.pathname === "/creator" && <CreatorHeader />}
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
