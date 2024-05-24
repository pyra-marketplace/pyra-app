import React from "react";

import { Outlet, useLocation } from "react-router-dom";

// import { CreatorHeader } from "./CreatorHeader";
// import { HomeHeader } from "./HomeHeader";
import Navbar from "./Navbar";
import { Container, BodyWrapper } from "./styled";
// import { UploadHeader } from "./UploadHeader";

import { useSelector } from "@/state/hook";

const Layout: React.FC = (): React.ReactElement => {
  const location = useLocation();
  const isDarkHeader = useSelector(
    state =>
      state.creator.isGuidingPage &&
      (state.creator.emptyUserInfo || state.creator.emptyProfile),
  );

  return (
    <Container flex={location.pathname === "/upload"}>
      {location.pathname === "/" && <Navbar />}
      {location.pathname.startsWith("/creator") && (
        <Navbar dark={isDarkHeader} />
      )}
      {location.pathname === "/upload" && <Navbar dark />}
      {location.pathname.startsWith("/profile") && <Navbar />}
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
