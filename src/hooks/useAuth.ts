import { useContext, useEffect, useState } from "react";

import { ConnectRes } from "@meteor-web3/components";
import {
  Connector,
  MeteorWebProvider,
  SYSTEM_CALL,
} from "@meteor-web3/connector";
import {
  MeteorContext,
  MeteorContextType,
  useAction,
} from "@meteor-web3/hooks";
import {
  useCreateWallet,
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";

export type ConnectingStatus =
  | boolean
  | "connectingWallet"
  | "connectingCapability";

export type AuthCache = {
  logout?: boolean;
};

const AUTH_CACHE_KEY = "pyra-app-auth-cache";

export const useAuth = ({
  appId,
  autoConnect,
  onConnectSucceed,
}: {
  appId: string;
  autoConnect?: boolean;
  /**
   * Called when the connection is successful
   * @returns meteorConnector(generated inside the component) and ConnectRes
   */
  onConnectSucceed?: (
    meteorConnector: Connector,
    connectRes: ConnectRes,
  ) => void;
}) => {
  const meteorContext = useContext(MeteorContext) as
    | MeteorContextType
    | undefined;
  const { actionConnectWallet, actionCreateCapability } = useAction();

  const [loadedFromCache, setLoadedFromCache] = useState<boolean>(false);
  const [logoutted, setLogoutted] = useState<boolean>(true);
  const [connector, setConnector] = useState<Connector | undefined>(
    meteorContext?.connector,
  );
  const [autoConnecting, setAutoConnecting] = useState<boolean>(
    autoConnect || false,
  );
  const [connecting, setConnecting] = useState<ConnectingStatus>(false);
  const [connectRes, setConnectRes] = useState<ConnectRes>();

  // privy
  const [waitForPrivyConnecting, setWaitForPrivyConnecting] = useState<
    "ready" | "authenticated" | "wallet" | false
  >(false);
  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  const { login: privyLogin } = useLogin({
    onError: err => {
      setWaitForPrivyConnecting(false);
      if (autoConnecting) {
        setAutoConnecting(false);
      } else {
        setConnecting(false);
      }
      console.warn(err);
    },
  });
  const { logout: privyLogout } = useLogout();
  const { createWallet: privyCreateWallet } = useCreateWallet();
  const getPrivyProvider = async () => {
    if (!privyReady) {
      setWaitForPrivyConnecting("ready");
      return;
    }
    const embededWallet = privyWallets.find(
      wallet => wallet.walletClientType === "privy",
    );
    if (!embededWallet) {
      if (!privyAuthenticated) {
        setWaitForPrivyConnecting("authenticated");
        privyLogin();
      } else {
        setWaitForPrivyConnecting("wallet");
        privyCreateWallet().catch(console.warn);
      }
      return;
    } else {
      return await embededWallet.getEthereumProvider();
    }
  };

  const handleInitConnector = async () => {
    // init provider and connector
    let meteorConnector = connector;
    let baseProvider = meteorConnector?.getProvider();
    if (!baseProvider || baseProvider.destroyed) {
      baseProvider = new MeteorWebProvider();
    }
    if (!meteorConnector) {
      meteorConnector = new Connector(baseProvider);
    } else {
      meteorConnector.setProvider(baseProvider);
    }
    setConnector(meteorConnector);
    return meteorConnector;
  };

  const handleConnectWallet = async () => {
    if (autoConnecting) {
      throw "Please wait for auto connecting...";
    }
    if (connecting) {
      throw "Already connecting, please wait...";
    }
    setConnecting(true);
    try {
      // init provider and connector
      setConnecting("connectingWallet");
      const meteorConnector = await handleInitConnector();
      // connect real wallet
      const ethereumProvider = await getPrivyProvider();
      if (!ethereumProvider) return;
      const connectRes = await meteorConnector.connectWallet({
        provider: ethereumProvider,
      });

      setConnecting("connectingCapability");
      const { pkh } = await meteorConnector.runOS({
        method: SYSTEM_CALL.createCapability,
        params: {
          appId,
        },
      });
      // setConnected(true);
      if (meteorContext?.dispatch) {
        actionConnectWallet(connectRes);
        actionCreateCapability({ pkh, appId: appId! });
      }
      setConnectRes({ ...connectRes, pkh });
      onConnectSucceed?.(meteorConnector, { ...connectRes, pkh });
      // save cache to localStorage
      localStorage.setItem(
        AUTH_CACHE_KEY,
        JSON.stringify({
          logout: false,
        } as AuthCache),
      );
      return { ...connectRes, pkh };
    } catch (e: any) {
      console.warn(e);
      setConnectRes(undefined);
      throw e;
    } finally {
      setConnecting(false);
    }
  };

  const handleAutoConnect = async () => {
    setConnecting(true);
    setAutoConnecting(true);
    try {
      const meteorConnector = await handleInitConnector();

      const ethereumProvider = await getPrivyProvider();
      if (!ethereumProvider) return;
      await (
        meteorConnector.getProvider() as MeteorWebProvider
      ).setExternalProvider(ethereumProvider as any);
      const hasCapability = await meteorConnector.runOS({
        method: SYSTEM_CALL.checkCapability,
        params: {
          appId,
        },
      });
      if (hasCapability) {
        const connectResult = await meteorConnector.getCurrentWallet();
        if (connectResult) {
          const connectRes = await meteorConnector.connectWallet({
            wallet: connectResult.wallet,
          });
          const pkh = await meteorConnector.getCurrentPkh();
          if (meteorContext?.dispatch) {
            actionConnectWallet(connectRes);
            actionCreateCapability({ pkh, appId });
          }
          setConnectRes({ ...connectRes, pkh });
          onConnectSucceed?.(meteorConnector, { ...connectRes, pkh });
        }
      }
      setAutoConnecting(false);
    } catch (e: any) {
      console.warn(e);
      setConnectRes(undefined);
      setAutoConnecting(false);
    } finally {
      setConnecting(false);
    }
  };

  // handle privy connect
  useEffect(() => {
    const embededWallet = privyWallets.find(
      wallet => wallet.walletClientType === "privy",
    );
    let handleNext = false;
    switch (waitForPrivyConnecting) {
      case "ready":
        if (privyReady) handleNext = true;
        break;
      case "authenticated":
        if (privyAuthenticated) handleNext = true;
        break;
      case "wallet":
        if (embededWallet) handleNext = true;
        break;
    }
    if (handleNext) {
      setWaitForPrivyConnecting(false);
      if (autoConnecting) {
        handleAutoConnect();
      } else {
        handleConnectWallet();
      }
    }
  }, [privyReady, privyAuthenticated, privyWallets, handleConnectWallet]);
  useEffect(() => {
    const url = new URLSearchParams(location.search);
    if (url.get("privy_oauth_code")) {
      setTimeout(handleConnectWallet);
    }
  }, []);

  // handle pre-load of meteor-iframe
  useEffect(() => {
    import("@meteor-web3/meteor-iframe");
  }, []);

  useEffect(() => {
    if (meteorContext?.connector) {
      setConnector(meteorContext.connector);
    }
  }, [meteorContext?.connector]);

  // handle load auth-cache
  useEffect(() => {
    const cache: AuthCache | null = JSON.parse(
      localStorage.getItem(AUTH_CACHE_KEY) || "null",
    );
    if (cache) {
      setLogoutted(!!cache.logout);
      setLoadedFromCache(true);
    } else {
      setAutoConnecting(false);
    }
  }, []);

  // handle autoConnect
  useEffect(() => {
    if (loadedFromCache && autoConnect && !logoutted) {
      handleAutoConnect();
    }
  }, [loadedFromCache, autoConnect, logoutted]);

  return {
    autoConnecting,
    connecting,
    connectRes,
    connectWallet: handleConnectWallet,
    logout: async () => {
      await privyLogout();
      localStorage.setItem(AUTH_CACHE_KEY, "null");
    },
  };
};
