import React from "react";
import ReactDOM from "react-dom/client";

import { MeteorContextProvider } from "@meteor-web3/hooks";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import rootStore from "./state/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={rootStore.store}>
    <PersistGate persistor={rootStore.persistor}>
      <MeteorContextProvider autoInit={false}>
        <App />
      </MeteorContextProvider>
    </PersistGate>
  </Provider>,
);
