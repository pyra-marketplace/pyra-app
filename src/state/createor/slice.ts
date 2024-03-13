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
  contentAccessible?: boolean;
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
      // TODO: remove auto-create-share when new contract is ready
      const pyraMarket = new PyraMarket({
        chainId,
        connector,
      });
      await pyraMarket.createShare({
        shareName: "Test Share",
        shareSymbol: "TS",
        feePoint: 100,
      });
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

export const loadPyraZone = createAsyncThunk(
  "creator/loadPyraZone",
  async (args: { chainId: number; address: string }) => {
    const { chainId, address } = args;
    const pyraZones = await PyraZone.loadPyraZones({
      chainId,
      publishers: [address],
    });
    return pyraZones[0];
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
  async (args: {
    chainId: number;
    assetId: string;
    accountAddress?: string;
    tier?: ethers.BigNumberish;
    connector: Connector;
  }) => {
    const { chainId, assetId, accountAddress, tier, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const files = await pyraZone.loadFilesInPyraZone(assetId);
    const isAccessible = accountAddress
      ? await pyraZone.isAccessible({
          tier: tier || 0,
          account: accountAddress,
        })
      : undefined;
    return { files, isAccessible };
  },
);

export const unlockCreatorContents = createAsyncThunk(
  "creator/unlockCreatorContents",
  async (args: { chainId: number; assetId: string; connector: Connector }) => {
    const { chainId, assetId, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const folder = await pyraZone.loadFolderInPyraZone(assetId);
    console.log("unlocking folder...", { folder });
    const unlockedFolder = folder
      ? await pyraZone.unlockFolder(folder.folderId)
      : undefined;
    return { unlockedFolder };
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
    builder.addCase(loadPyraZone.fulfilled, (state, action) => {
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
      const { files, isAccessible } = action.payload;
      state.contentFiles = files;
      state.contentAccessible = isAccessible;
    });
    builder.addCase(unlockCreatorContents.fulfilled, (state, action) => {
      const { unlockedFolder } = action.payload;
      if (unlockedFolder) {
        const contentFiles: MirrorFileRecord = {};
        Object.values(unlockedFolder.mirrorRecord).forEach(mirror => {
          contentFiles[mirror.mirrorId] = mirror.mirrorFile;
        });
        state.contentFiles = contentFiles;
        state.contentAccessible = true;
      }
    });
  },
});

export default creatorSlice.reducer;
