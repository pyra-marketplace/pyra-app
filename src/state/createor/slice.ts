import { Connector, MirrorFileRecord } from "@meteor-web3/connector";
import {
  ChainId,
  PyraMarket,
  PyraMarketShareActivityRes,
  PyraMarketShareHolderRes,
  PyraZone,
  PyraZoneRes,
} from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export interface CreatorStates {
  pyraZone?: PyraZoneRes;
  shareBuyPrice?: ethers.BigNumber;
  tierKeyBuyPrice?: ethers.BigNumber;
  shareHolders?: PyraMarketShareHolderRes[];
  shareTotalValue?: string;
  shareTotalSupply?: ethers.BigNumber;
  shareTotalVolume?: string;
  shareActivities?: PyraMarketShareActivityRes[];
  contentFiles?: MirrorFileRecord;
}

const initialState: CreatorStates = {};

export const checkOrCreatePryaZone = createAsyncThunk(
  "global/checkOrCreatePryaZone",
  async (args: { chainId: number; address: string; connector: Connector }) => {
    const { chainId, address, connector } = args;
    let _pyraZone: PyraZoneRes;
    const pyraZones = await PyraZone.loadPyraZones({
      chainId,
      publishers: [address],
    });
    if (pyraZones.length > 0) {
      _pyraZone = pyraZones[0];
    } else {
      const pyraZone = new PyraZone({
        chainId,
        connector,
      });
      await pyraZone.createPyraZone();
      _pyraZone = (
        await PyraZone.loadPyraZones({
          chainId,
          publishers: [address],
        })
      )[0];
    }
    return _pyraZone;
  },
);

export const loadCreatorBaseInfos = createAsyncThunk(
  "creator/loadCreatorBaseInfos",
  async (args: {
    chainId: number;
    address: string;
    assetId: string;
    connector: Connector;
    tier?: ethers.BigNumberish;
  }) => {
    const { chainId, address, assetId, connector, tier } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    const shareBuyPrice = await pyraMarket.loadBuyPrice({
      creator: address,
      amount: ethers.utils.parseEther("1"),
    });
    console.log({ shareBuyPrice });
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const tierKeyBuyPrice = await pyraZone.loadBuyPrice(tier || 0);
    console.log({ tierKeyBuyPrice });
    const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
      chainId,
      publisher: address,
    });
    console.log({ shareHolders });
    return { shareBuyPrice, tierKeyBuyPrice, shareHolders };
  },
);

export const loadCreatorShareInfos = createAsyncThunk(
  "creator/loadCreatorShareInfos",
  async (args: { chainId: number; address: string; connector: Connector }) => {
    const { chainId, address, connector } = args;
    let pyraMarkets = await PyraMarket.loadPyraMarkets({
      chainId,
      publishers: [address],
    });

    pyraMarkets = pyraMarkets.map(item => ({
      ...item,
      total_value: ethers.utils.formatEther(item.total_value),
    }));

    const shareAddress = pyraMarkets[0]?.share;

    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    const shareTotalSupply = await pyraMarket.loadTotalSupply(shareAddress);

    let shareActivities = await PyraMarket.loadPyraMarketShareActivities({
      chainId,
      publisher: address,
    });
    shareActivities = shareActivities.map(item => ({
      ...item,
      ...(item.buy_amount && {
        buy_amount: ethers.utils.formatEther(item.buy_amount),
      }),
      ...(item.buy_price && {
        buy_price: ethers.utils.formatEther(item.buy_price),
      }),
      ...(item.sell_amount && {
        sell_amount: ethers.utils.formatEther(item.sell_amount),
      }),
      ...(item.sell_price && {
        sell_amount: ethers.utils.formatEther(item.sell_price),
      }),
    }));

    const ethPrice = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&precision=2`,
    )
      .then(r => r.json())
      .then(r => r.ethereum.usd as number);

    return {
      shareTotalValue: pyraMarkets[0]?.total_value,
      shareTotalSupply,
      shareTotalVolume: pyraMarkets[0]?.total_volume,
      shareActivities,
      ethPrice,
    };
  },
);

export const loadCreatorContents = createAsyncThunk(
  "creator/loadCreatorContents",
  async (args: { chainId: number; assetId: string; connector: Connector }) => {
    const { chainId, assetId, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      connector,
    });
    const files = await pyraZone.loadFilesInPyraZone(assetId);
    return { files };
  },
);

export const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    setPyraZone: (state, action: PayloadAction<PyraZoneRes>) => {
      state.pyraZone = action.payload;
    },
    setShareBuyPrice: (state, action: PayloadAction<ethers.BigNumber>) => {
      state.shareBuyPrice = action.payload;
    },
    setTierKeyBuyPrice: (state, action: PayloadAction<ethers.BigNumber>) => {
      state.tierKeyBuyPrice = action.payload;
    },
    setShareHolders: (
      state,
      action: PayloadAction<PyraMarketShareHolderRes[]>,
    ) => {
      state.shareHolders = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(checkOrCreatePryaZone.fulfilled, (state, action) => {
      state.pyraZone = action.payload;
    });
    builder.addCase(loadCreatorBaseInfos.fulfilled, (state, action) => {
      const { shareBuyPrice, tierKeyBuyPrice, shareHolders } = action.payload;
      state.shareBuyPrice = shareBuyPrice;
      state.tierKeyBuyPrice = tierKeyBuyPrice;
      state.shareHolders = shareHolders;
    });
    builder.addCase(loadCreatorShareInfos.fulfilled, (state, action) => {
      const {
        shareTotalValue,
        shareTotalSupply,
        shareTotalVolume,
        shareActivities,
      } = action.payload;
      state.shareTotalValue = shareTotalValue;
      state.shareTotalSupply = shareTotalSupply;
      state.shareTotalVolume = shareTotalVolume;
      state.shareActivities = shareActivities;
    });
    builder.addCase(loadCreatorContents.fulfilled, (state, action) => {
      const { files } = action.payload;
      state.contentFiles = files;
    });
  },
});

export default creatorSlice.reducer;
