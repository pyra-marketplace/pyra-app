import {
  PyraZone,
  PyraMarket,
  PyraMarketShareHolderPortfolioRes,
  PyraZoneTierkeyHolderPortfolioRes,
} from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export interface ProfileStates {
  keyValue?: string;
  shareValue?: string;
  totalRevenue?: string;
  pyraMarketShareHolders?: PyraMarketShareHolderPortfolioRes["portfolios"];
  pyraZoneTierkeyHolders?: PyraZoneTierkeyHolderPortfolioRes["portfolios"];
  pyraMarketSortBy: "shares_price" | "update_at";
  pyraZoneSortBy: "tierkeys_price" | "update_at";
}

const initialState: ProfileStates = {
  keyValue: undefined,
  shareValue: undefined,
  totalRevenue: undefined,
  pyraMarketShareHolders: undefined,
  pyraZoneTierkeyHolders: undefined,
  pyraMarketSortBy: "shares_price",
  pyraZoneSortBy: "tierkeys_price",
};

export const loadPyraMarketShareHolderPortfolios = createAsyncThunk(
  "profile/loadPyraMarketShareHolderPortfolios",
  async (args: {
    chainId: number;
    userAddress: string;
    orderBy?: "shares_price" | "update_at";
    orderType?: "asc" | "desc";
  }) => {
    const { chainId, userAddress, orderBy, orderType } = args;

    let res;
    try {
      res = await PyraMarket.loadPyraMarketShareHolderPortfolios({
        chainId,
        shareholder: userAddress,
        orderBy,
        orderType,
      });

      if (res.portfolios) {
        res.portfolios = res.portfolios.map((item: any) => ({
          ...item,
          ...(item.shares_amount && {
            shares_amount: ethers.utils.formatEther(item.shares_amount),
          }),
          ...(item.shares_price && {
            shares_price: ethers.utils.formatEther(item.shares_price),
          }),
        }));
      }
    } catch (error) {
      /* empty */
    }

    return {
      total_shares_price: res?.total_shares_price
        ? ethers.utils.formatEther(res.total_shares_price)
        : "0",
      total_claimed_revenue: res?.total_claimed_revenue
        ? ethers.utils.formatEther(res.total_claimed_revenue)
        : "0",
      portfolios: res?.portfolios ?? [],
    };
  },
);

export const loadPyraZoneTierkeyHolderPortfolios = createAsyncThunk(
  "profile/loadPyraZoneTierkeyHolderPortfolios",
  async (args: {
    chainId: number;
    userAddress: string;
    orderBy?: "tierkeys_price" | "update_at";
    orderType?: "asc" | "desc";
  }) => {
    const { chainId, userAddress, orderBy, orderType } = args;

    let res;
    try {
      res = await PyraZone.loadPyraZoneTierkeyHolderPortfolios({
        chainId,
        tierkeyHolder: userAddress,
        orderBy,
        orderType,
      });

      if (res?.portfolios) {
        res.portfolios = res.portfolios.map((item: any) => ({
          ...item,
          ...(item.tierkeys_price && {
            tierkeys_price: ethers.utils.formatEther(item.tierkeys_price),
          }),
        }));
      }
    } catch (error) {
      /* empty */
    }

    return {
      total_tierkeys_price: res?.total_tierkeys_price
        ? ethers.utils.formatEther(res.total_tierkeys_price)
        : "0",
      portfolios: res?.portfolios ?? [],
    };
  },
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setPyraMarketSortBy: (
      state,
      action: PayloadAction<"shares_price" | "update_at">,
    ) => {
      state.pyraMarketSortBy = action.payload;
      state.pyraMarketShareHolders = undefined;
    },
    setPyraZoneSortBy: (
      state,
      action: PayloadAction<"tierkeys_price" | "update_at">,
    ) => {
      state.pyraZoneSortBy = action.payload;
      state.pyraZoneTierkeyHolders = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      loadPyraMarketShareHolderPortfolios.fulfilled,
      (state, action) => {
        const { total_shares_price, total_claimed_revenue, portfolios } =
          action.payload;
        state.shareValue = total_shares_price;
        state.totalRevenue = total_claimed_revenue;
        state.pyraMarketShareHolders = portfolios;
      },
    );
    builder.addCase(
      loadPyraZoneTierkeyHolderPortfolios.fulfilled,
      (state, action) => {
        const { total_tierkeys_price, portfolios } = action.payload;
        state.keyValue = total_tierkeys_price;
        state.pyraZoneTierkeyHolders = portfolios;
      },
    );
  },
});

export default profileSlice.reducer;
