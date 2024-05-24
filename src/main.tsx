import React from "react";
import ReactDOM from "react-dom/client";

import { MeteorContextProvider } from "@meteor-web3/hooks";
import { PrivyProvider } from "@privy-io/react-auth";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import rootStore from "./state/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={rootStore.store}>
    <PersistGate persistor={rootStore.persistor}>
      <MeteorContextProvider autoInit={false}>
        <PrivyProvider
          appId={"clwkb07r60aejr76qselp28on"}
          config={{
            loginMethods: ["twitter"],
            embeddedWallets: { createOnLogin: "users-without-wallets" },
          }}
        >
          <App />
        </PrivyProvider>
      </MeteorContextProvider>
    </PersistGate>
  </Provider>,
);
