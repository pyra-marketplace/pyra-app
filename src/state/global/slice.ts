import { Connector } from "@meteor-web3/connector";
import { ChainId, PyraZone } from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const Currency: Record<ChainId, "MATIC" | "ETH"> = {
  [ChainId.PolygonMumbai]: "MATIC",
  [ChainId.Ethereum]: "ETH",
  [ChainId.Polygon]: "MATIC",
  [ChainId.Base]: "ETH",
  [ChainId.BaseSepolia]: "ETH",
};
export type ChainCurrency = (typeof Currency)[keyof typeof Currency];
export const ChainName: Record<
  ChainId,
  "Ethereum" | "Polygon" | "PolygonMumbai" | "Base" | "BaseSepolia"
> = {
  [ChainId.PolygonMumbai]: "PolygonMumbai",
  [ChainId.Ethereum]: "Ethereum",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Base]: "Base",
  [ChainId.BaseSepolia]: "BaseSepolia",
};
export type ChainNameType = (typeof ChainName)[keyof typeof ChainName];

export interface GlobalStates {
  autoConnecting: boolean;
  chainId: ChainId;
  chainName: ChainNameType;
  chainCurrency: ChainCurrency;
  walletBalance?: string;
  ethPrice?: number;
  userInfo?: {
    address: string;
    did: string;
    twitter: {
      description: string;
      id: string;
      name: string;
      profile_image_url: string;
      username: string;
    };
  };
}

const chainId: ChainId = (process.env.CHAIN_ID as any) || ChainId.BaseSepolia;

const initialState: GlobalStates = {
  autoConnecting: true,
  chainId: chainId,
  chainName: ChainName[chainId],
  chainCurrency: Currency[chainId],
};

export const getWalletBalance = createAsyncThunk(
  "global/getWalletBalance",
  async (connector: Connector) => {
    if (connector.address) {
      const baseProvider = connector.getProvider();
      const etherProvider = new ethers.providers.Web3Provider(baseProvider);
      const walletBalance = await etherProvider
        .getBalance(connector.address)
        .then(ethers.utils.formatEther);
      return Number(walletBalance).toFixed(3);
    }
  },
);

export const getEthPrice = createAsyncThunk("global/getEthPrice", async () => {
  const ethPrice = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${chainId === 137 || chainId === 80001 ? "matic-network" : "ethereum"}&vs_currencies=usd&precision=2`,
  )
    .then(r => r.json())
    .then(
      r =>
        r[chainId === 137 || chainId === 80001 ? "matic-network" : "ethereum"]
          .usd as number,
    );
  return ethPrice;
});

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAutoConnecting: (state, action: PayloadAction<boolean>) => {
      state.autoConnecting = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<GlobalStates["userInfo"]>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getWalletBalance.fulfilled, (state, action) => {
      const balance = action.payload;
      state.walletBalance = balance;
    });
    builder.addCase(getEthPrice.fulfilled, (state, action) => {
      const ethPrice = action.payload;
      state.ethPrice = ethPrice;
    });
  },
});

export default globalSlice.reducer;
