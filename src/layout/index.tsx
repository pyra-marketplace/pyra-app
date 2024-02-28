import React from "react";

import Header from "./Header";
import { Container, BodyWrapper } from "./styled";

import Home from "@/pages/Home";

const Layout: React.FC = (): React.ReactElement => {
  return (
    <Container>
      <Header />
      <BodyWrapper>
        <Home />
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
