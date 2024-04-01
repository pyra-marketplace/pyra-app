import { Connector } from "@meteor-web3/connector";
import { PyraMarket, PyraZone, PyraZoneRes } from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export type TrendingPyraZone = PyraZoneRes & {
  tierkey_price?: string;
  files_count?: number;
  share_holders?: number;
  watch_lists?: number;
  total_volume?: string;
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
    page?: number;
    pageSize?: number;
  }) => {
    const { chainId, connector, orderBy, orderType, page, pageSize } = args;
    const ONE_WEEK = 3500 * 24 * 7;
    const trendingPyraZones: Array<TrendingPyraZone> =
      await PyraZone.loadPyraZones({
        chainId,
        recentTime: ONE_WEEK,
        orderBy,
        orderType,
        page,
        pageSize,
      });
    for (let i = 0; i < trendingPyraZones.length; i++) {
      const pyraZone = trendingPyraZones[i];
      const pyraMarket = (
        await PyraMarket.loadPyraMarkets({
          chainId,
          publishers: [pyraZone.publisher],
        })
      )[0];
      const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
        chainId,
        publisher: pyraZone.publisher,
      });
      trendingPyraZones[i] = {
        ...pyraZone,
        share_holders: shareHolders.length,
        watch_lists: 0,
        tierkey_price: ethers.utils.formatEther(pyraZone.tierkey_price),
        total_volume: ethers.utils.formatEther(pyraMarket.total_volume),
      };
    }
    return trendingPyraZones;
  },
);

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearTrendingPyraZones: state => {
      state.trendingPyraZones = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(loadTrendingPyraZones.fulfilled, (state, action) => {
      const trendingPyraZones = action.payload;
      state.trendingPyraZones = (state.trendingPyraZones || []).concat(
        trendingPyraZones,
      );
    });
  },
});

export default homeSlice.reducer;
