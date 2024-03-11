import React, { useContext, useEffect } from "react";

import { useAuth } from "@meteor-web3/components";
import { MeteorContext, useAction, useStore } from "@meteor-web3/hooks";
import { RouterProvider } from "react-router-dom";

import { router } from "./router";
import { globalSlice } from "./state/global/slice";
import { useDispatch } from "./state/hook";
import { Frame, GlobalStyle } from "./styled";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const meteorContext = useContext(MeteorContext);
  const { autoConnecting } = useAuth({
    appId: process.env.PYRA_APP_ID!,
    meteorContext,
    autoConnect: true,
  });

  useEffect(() => {
    dispatch(globalSlice.actions.setAutoConnecting(autoConnecting));
  }, [autoConnecting]);

  return (
    <Frame>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Frame>
  );
};

export default App;
