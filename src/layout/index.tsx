import React from "react";

import { Outlet, useLocation } from "react-router-dom";

import { CreatorHeader } from "./CreatorHeader";
import { Header } from "./Header";
import { Container, BodyWrapper } from "./styled";

const Layout: React.FC = (): React.ReactElement => {
  const location = useLocation();

  return (
    <Container>
      {location.pathname === "/" && <Header />}
      {location.pathname === "/creator" && <CreatorHeader />}
      <BodyWrapper>
        <Outlet />
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
