import React, { useContext, useEffect } from "react";

import { MeteorContext } from "@meteor-web3/hooks";
import { RouterProvider } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import { router } from "./router";
import { getEthPrice, globalSlice } from "./state/global/slice";
import { useDispatch, useSelector } from "./state/hook";
import { Frame, GlobalStyle } from "./styled";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { autoConnecting } = useAuth({
    appId: process.env.PYRA_APP_ID!,
    autoConnect: true,
  });
  const globalState = useSelector(state => state.global);

  useEffect(() => {
    dispatch(globalSlice.actions.setAutoConnecting(autoConnecting));
  }, [autoConnecting]);

  useEffect(() => {
    if (!globalState.ethPrice) {
      dispatch(getEthPrice());
    }
  }, [globalState.ethPrice]);

  return (
    <Frame>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Frame>
  );
};

export default App;
