import {
  PyraMarket,
  PyraMarketRes,
  PyraZone,
  PyraZoneRes,
} from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

// export type TrendingPyraZone = PyraZoneRes & {
//   tierkey_price?: string;
//   files_count?: number;
//   share_holders?: number;
//   watch_lists?: number;
//   total_volume?: string;
// };

export interface HomeStates {
  tableData?: Array<PyraMarketRes>;
  trendingPyraMarkets?: Array<PyraMarketRes>;
  popularPyraZones?: Array<PyraZoneRes>;
  recentPyraZones?: Array<PyraZoneRes>;
  trendingPyraZones?: Array<PyraZoneRes>;
}

const initialState: HomeStates = {};

// export const loadTrendingPyraZones = createAsyncThunk(
//   "home/loadTrendingPyraZones",
//   async (args: {
//     chainId: number;
//     connector: Connector;
//     orderBy?: "block_number" | "tierkey_sales";
//     orderType?: "asc" | "desc";
//     page?: number;
//     pageSize?: number;
//   }) => {
//     const { chainId, connector, orderBy, orderType, page, pageSize } = args;
//     const ONE_WEEK = 3500 * 24 * 7;
//     const trendingPyraZones: Array<TrendingPyraZone> =
//       await PyraZone.loadPyraZones({
//         chainId,
//         orderBy,
//         orderType,
//         page,
//         pageSize,
//       });
//     for (let i = 0; i < trendingPyraZones.length; i++) {
//       const pyraZone = trendingPyraZones[i];
//       const pyraMarket = (
//         await PyraMarket.loadPyraMarkets({
//           chainId,
//           publishers: [pyraZone.publisher],
//         })
//       )[0];
//       const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
//         chainId,
//         publisher: pyraZone.publisher,
//       });
//       trendingPyraZones[i] = {
//         ...pyraZone,
//         share_holders: shareHolders.length,
//         watch_lists: 0,
//         tierkey_price: ethers.utils.formatEther(pyraZone.tierkey_price),
//         total_volume: ethers.utils.formatEther(pyraMarket.total_volume),
//       };
//     }
//     return trendingPyraZones;
//   },
// );

export const loadTableData = createAsyncThunk(
  "home/loadTableData",
  async (args: {
    chainId: number;
    type: "Trending" | "Top" | "Recent";
    page: number;
    pageSize: number;
  }) => {
    const { chainId, type, page, pageSize } = args;
    let tableData: PyraMarketRes[];
    switch (type) {
      case "Trending":
        // tableData = await PyraMarket.loadTrendingPyraMarkets({
        //   chainId,
        //   page,
        //   pageSize,
        // });
        tableData = await PyraMarket.loadPyraMarkets({
          chainId,
          orderBy: "total_value",
          orderType: "desc",
          page,
          pageSize,
        });
        break;
      case "Top":
        tableData = await PyraMarket.loadPyraMarkets({
          chainId,
          orderBy: "total_value",
          orderType: "desc",
          page,
          pageSize,
        });
        break;
      case "Recent":
        tableData = await PyraMarket.loadPyraMarkets({
          chainId,
          orderBy: "block_number",
          orderType: "desc",
          page,
          pageSize,
        });
        break;
    }

    tableData = tableData.map(item => ({
      ...item,
      total_value: ethers.utils.formatEther(item.total_value),
      total_volume: ethers.utils.formatEther(item.total_volume),
      total_supply: ethers.utils.formatEther(item.total_supply),
    }));

    console.log({ tableData });
    return tableData;
  },
);

export const loadHomeData = createAsyncThunk(
  "home/loadHomeData",
  async (args: { chainId: number }) => {
    const { chainId } = args;

    // let trendingPyraMarkets = await PyraMarket.loadTrendingPyraMarkets({
    //   chainId,
    // });
    let trendingPyraMarkets = await PyraMarket.loadPyraMarkets({
      chainId,
      orderBy: "total_value",
      orderType: "desc",
    });
    trendingPyraMarkets = trendingPyraMarkets.map(item => ({
      ...item,
      total_value: ethers.utils.formatEther(item.total_value),
    }));
    console.log({ trendingPyraMarkets });

    let popularPyraZones = await PyraZone.loadPyraZones({
      chainId,
      orderBy: "tierkey_sales",
      orderType: "desc",
    });
    popularPyraZones = popularPyraZones.map(item => ({
      ...item,
      tierkey_prices: item.tierkey_prices.map(v => ethers.utils.formatEther(v)),
      // total_values: item.total_values.map(v => ethers.utils.formatEther(v)),
    }));
    let recentPyraZones = await PyraZone.loadPyraZones({
      chainId,
      orderBy: "block_number",
      orderType: "desc",
    });
    recentPyraZones = recentPyraZones.map(item => ({
      ...item,
      tierkey_prices: item.tierkey_prices.map(v => ethers.utils.formatEther(v)),
      // total_values: item.total_values.map(v => ethers.utils.formatEther(v)),
    }));

    let trendingPyraZones = await PyraZone.loadTrendingPyraZones({
      chainId,
    });
    trendingPyraZones = trendingPyraZones.map(item => ({
      ...item,
      tierkey_prices: item.tierkey_prices.map(v => ethers.utils.formatEther(v)),
      // total_values: item.total_values.map(v => ethers.utils.formatEther(v)),
    }));
    console.log({ popularPyraZones, trendingPyraZones });

    return {
      trendingPyraMarkets,
      popularPyraZones,
      recentPyraZones,
      trendingPyraZones,
    };
  },
);

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // clearTrendingPyraZones: state => {
    //   state.trendingPyraZones = [];
    // },
    clearTableData: state => {
      state.tableData = [];
    },
  },
  extraReducers: builder => {
    // builder.addCase(loadTrendingPyraZones.fulfilled, (state, action) => {
    //   const trendingPyraZones = action.payload;
    //   state.trendingPyraZones = (state.trendingPyraZones || []).concat(
    //     trendingPyraZones,
    //   );
    // });
    builder.addCase(loadTableData.fulfilled, (state, action) => {
      state.tableData = action.payload;
    });
    builder.addCase(loadHomeData.fulfilled, (state, action) => {
      state.trendingPyraMarkets = action.payload.trendingPyraMarkets;
      state.popularPyraZones = action.payload.popularPyraZones;
      state.recentPyraZones = action.payload.recentPyraZones;
      state.trendingPyraZones = action.payload.trendingPyraZones;
    });
  },
});

export default homeSlice.reducer;
