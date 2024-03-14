import { Connector } from "@meteor-web3/connector";
import { PyraMarket, PyraZone, PyraZoneRes } from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export type TrendingPyraZone = PyraZoneRes & {
  share_price?: string;
  key_price?: string;
  files_count?: number;
  key_sales?: number;
  share_holders?: number;
  watch_lists?: number;
};

export interface HomeStates {
  trendingPyraZones?: Array<TrendingPyraZone>;
}

const initialState: HomeStates = {};

export const loadTrendingPyraZones = createAsyncThunk(
  "home/loadTrendingPyraZones",
  async (args: {
    chainId: number;
    connector: Connector;
    orderBy?: "block_number" | "tierkey_sales";
    orderType?: "asc" | "desc";
  }) => {
    const { chainId, connector, orderBy, orderType } = args;
    const ONE_WEEK = 3500 * 24 * 7;
    const trendingPyraZones: Array<TrendingPyraZone> =
      await PyraZone.loadPyraZones({
        chainId,
        recentTime: ONE_WEEK,
        orderBy,
        orderType,
      });
    for (let i = 0; i < trendingPyraZones.length; i++) {
      const pyraZone = trendingPyraZones[i];
      const pyraMarket = new PyraMarket({
        chainId,
        connector,
      });
      const shareBuyPrice = await pyraMarket.loadBuyPrice({
        creator: pyraZone.publisher,
        amount: ethers.utils.parseEther("1"),
      });
      const _pyraZone = new PyraZone({
        chainId,
        assetId: pyraZone.asset_id,
        connector,
      });
      const tierKeyBuyPrice = await _pyraZone.loadBuyPrice(0);
      const tierKeyHolders = await PyraZone.loadPyraZoneTierkeyHolders({
        chainId,
        assetId: pyraZone.asset_id,
        tier: 0,
      });
      const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
        chainId,
        publisher: pyraZone.publisher,
      });
      trendingPyraZones[i] = {
        ...pyraZone,
        share_price: ethers.utils.formatEther(shareBuyPrice),
        key_price: ethers.utils.formatEther(tierKeyBuyPrice),
        files_count: 0,
        key_sales: tierKeyHolders.length,
        share_holders: shareHolders.length,
        watch_lists: 0,
      };
    }
    return trendingPyraZones;
  },
);

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadTrendingPyraZones.fulfilled, (state, action) => {
      const trendingPyraZones = action.payload;
      state.trendingPyraZones = trendingPyraZones;
    });
  },
});

export default homeSlice.reducer;
