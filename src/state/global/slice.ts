import { Connector } from "@meteor-web3/connector";
import { ChainId, PyraZone } from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const Currency: Record<ChainId, "MATIC" | "ETH"> = {
  [ChainId.PolygonMumbai]: "MATIC",
  [ChainId.Ethereum]: "ETH",
  [ChainId.Polygon]: "MATIC",
};
export type ChainCurrency = (typeof Currency)[keyof typeof Currency];

export interface GlobalStates {
  autoConnecting: boolean;
  chainId: ChainId;
  chainCurrency: ChainCurrency;
  walletBalance?: string;
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

const chainId: ChainId = (process.env.CHAIN_ID as any) || ChainId.PolygonMumbai;

const initialState: GlobalStates = {
  autoConnecting: true,
  chainId: chainId,
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
  },
});

export default globalSlice.reducer;
