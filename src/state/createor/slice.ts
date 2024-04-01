import { Connector, MirrorFileRecord } from "@meteor-web3/connector";
import {
  Auth as TwitterAuth,
  ChainId,
  PyraMarket,
  PyraMarketShareActivityRes,
  PyraMarketShareHolderRes,
  PyraZone,
  PyraZoneRes,
  PyraZoneTierkeyHolderRes,
  PyraMarketRes,
  RevenuePool,
} from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export interface CreatorStates {
  pyraZone?: PyraZoneRes;
  pyraMarket?: PyraMarketRes;
  shareBuyPrice?: string;
  shareSellPrice?: string;
  tierKeyBuyPrice?: string;
  tierKeyHolders?: PyraZoneTierkeyHolderRes[];
  shareHolders?: PyraMarketShareHolderRes[];
  shareTotalValue?: string;
  shareTotalSupply?: string;
  userShareBalance?: string;
  revenuePoolShareBalance?: string;
  revenue?: string;
  ethPrice?: number;
  shareTotalVolume?: string;
  shareActivities?: PyraMarketShareActivityRes[];
  contentFiles?: MirrorFileRecord;
  contentAccessible?: boolean;
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

const initialState: CreatorStates = {
  pyraZone: undefined,
  shareBuyPrice: undefined,
  tierKeyBuyPrice: undefined,
  tierKeyHolders: undefined,
  shareHolders: undefined,
  shareTotalValue: undefined,
  shareTotalSupply: undefined,
  userShareBalance: undefined,
  revenuePoolShareBalance: undefined,
  revenue: undefined,
  ethPrice: undefined,
  shareTotalVolume: undefined,
  shareActivities: undefined,
  contentFiles: undefined,
  contentAccessible: undefined,
  userInfo: undefined,
};

export const createPryaZone = createAsyncThunk(
  "global/createPryaZone",
  async (args: { chainId: number; address: string; connector: Connector }) => {
    const { chainId, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      connector,
    });
    await pyraZone.createPyraZone();
    return true;
  },
);

export const createShare = createAsyncThunk(
  "global/createShare",
  async (args: { chainId: number; connector: Connector }) => {
    const { chainId, connector } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    await pyraMarket.createShare({
      shareName: "Test Share",
      shareSymbol: "TS",
    });
    return true;
  },
);

export const buyShares = createAsyncThunk(
  "creator/buyShares",
  async (args: {
    chainId: number;
    connector: Connector;
    creator: string;
    amount: ethers.BigNumber;
  }) => {
    const { chainId, connector, creator, amount } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    await pyraMarket.buyShares({
      creator,
      amount,
    });
    return true;
  },
);

export const sellShares = createAsyncThunk(
  "creator/sellShares",
  async (args: {
    chainId: number;
    connector: Connector;
    creator: string;
    amount: ethers.BigNumber;
  }) => {
    const { chainId, connector, creator, amount } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    await pyraMarket.sellShares({
      creator,
      amount,
    });
    return true;
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
    const pyraZone = pyraZones[0];
    const pyraMarket = (
      await PyraMarket.loadPyraMarkets({
        chainId,
        publishers: [address],
      })
    )[0];
    return { pyraZone, pyraMarket };
  },
);

export const loadCreatorBaseInfos = createAsyncThunk(
  "creator/loadCreatorBaseInfos",
  async (args: {
    chainId: number;
    address: string;
    assetId: string;
    connector: Connector;
    tier?: number;
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
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const tierKeyBuyPrice = await pyraZone.loadBuyPrice(tier || 0);
    console.log({ shareBuyPrice, tierKeyBuyPrice });
    const tierKeyHolders = await PyraZone.loadPyraZoneTierkeyHolders({
      chainId,
      assetId,
      tier: tier || 0,
    });
    const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
      chainId,
      publisher: address,
    });
    console.log({ tierKeyHolders, shareHolders });
    return {
      shareBuyPrice: ethers.utils.formatEther(shareBuyPrice),
      tierKeyBuyPrice: ethers.utils.formatEther(tierKeyBuyPrice),
      tierKeyHolders,
      shareHolders,
    };
  },
);

export const loadShareSellPrice = createAsyncThunk(
  "creator/loadShareSellPrice",
  async (args: {
    chainId: number;
    address: string;
    connector: Connector;
    amount: string;
  }) => {
    const { chainId, address, connector, amount } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    const shareSellPrice = await pyraMarket.loadSellPrice({
      creator: address,
      amount: ethers.utils.parseEther(amount),
    });

    return ethers.utils.formatEther(shareSellPrice);
  },
);

export const loadShareBuyPrice = createAsyncThunk(
  "creator/loadShareBuyPrice",
  async (args: {
    chainId: number;
    address: string;
    connector: Connector;
    amount: string;
  }) => {
    const { chainId, address, connector, amount } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    const shareBuyPrice = await pyraMarket.loadBuyPrice({
      creator: address,
      amount: ethers.utils.parseEther(amount),
    });

    return ethers.utils.formatEther(shareBuyPrice);
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
      total_supply: ethers.utils.formatEther(item.total_supply),
      total_volume: ethers.utils.formatEther(item.total_volume),
    }));

    const shareAddress = pyraMarkets[0]?.share;
    const revenuePoolAddress = pyraMarkets[0]?.revenue_pool;

    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    const shareTotalSupply = await pyraMarket.loadTotalSupply(shareAddress);
    const userShareBalance = await pyraMarket.loadShareBalance({
      shareAddress,
      address,
    });
    const revenuePoolShareBalance = await pyraMarket.loadShareBalance({
      shareAddress,
      address: revenuePoolAddress,
    });
    const revenuePool = new RevenuePool({
      chainId,
      revenuePoolAddress,
      connector,
    });
    const revenue = await revenuePool.loadClaimableRevenue();
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
      `https://api.coingecko.com/api/v3/simple/price?ids=${chainId === 137 || chainId === 80001 ? "matic-network" : "ethereum"}&vs_currencies=usd&precision=2`,
    )
      .then(r => r.json())
      .then(
        r =>
          r[chainId === 137 || chainId === 80001 ? "matic-network" : "ethereum"]
            .usd as number,
      );

    return {
      shareTotalValue: pyraMarkets[0]?.total_value,
      shareTotalSupply: ethers.utils.formatEther(shareTotalSupply),
      shareTotalVolume: pyraMarkets[0]?.total_volume,
      shareActivities,
      userShareBalance: ethers.utils.formatEther(userShareBalance),
      revenuePoolShareBalance: ethers.utils.formatEther(
        revenuePoolShareBalance,
      ),
      revenue: ethers.utils.formatEther(revenue),
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

export const loadCreatorUserInfo = createAsyncThunk(
  "creator/loadCreatorUserInfo",
  async (args: { address: string }) => {
    const { address } = args;
    try {
      const userInfo = await TwitterAuth.info({
        address,
      });
      return userInfo;
    } catch (e) {
      console.warn(e);
    }
    return undefined;
  },
);

export const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    setPyraZone: (state, action: PayloadAction<PyraZoneRes>) => {
      state.pyraZone = action.payload;
    },
    setShareBuyPrice: (state, action: PayloadAction<string>) => {
      state.shareBuyPrice = action.payload;
    },
    setTierKeyBuyPrice: (state, action: PayloadAction<string>) => {
      state.tierKeyBuyPrice = action.payload;
    },
    setShareHolders: (
      state,
      action: PayloadAction<PyraMarketShareHolderRes[]>,
    ) => {
      state.shareHolders = action.payload;
    },
    setContentAccessible: (state, action: PayloadAction<boolean>) => {
      state.contentAccessible = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<CreatorStates["userInfo"]>) => {
      state.userInfo = action.payload;
    },
    clearAllInfos: state => {
      state = { ...initialState };
    },
  },
  extraReducers: builder => {
    builder.addCase(loadPyraZone.fulfilled, (state, action) => {
      const { pyraZone, pyraMarket } = action.payload;
      state.pyraZone = pyraZone;
      state.pyraMarket = pyraMarket;
    });
    builder.addCase(loadCreatorBaseInfos.fulfilled, (state, action) => {
      const { shareBuyPrice, tierKeyBuyPrice, tierKeyHolders, shareHolders } =
        action.payload;
      state.shareBuyPrice = shareBuyPrice;
      state.tierKeyBuyPrice = tierKeyBuyPrice;
      state.tierKeyHolders = tierKeyHolders;
      state.shareHolders = shareHolders;
    });
    builder.addCase(loadShareSellPrice.fulfilled, (state, action) => {
      state.shareSellPrice = action.payload;
    });
    builder.addCase(loadCreatorShareInfos.fulfilled, (state, action) => {
      const {
        shareTotalValue,
        shareTotalSupply,
        shareTotalVolume,
        shareActivities,
        userShareBalance,
        revenuePoolShareBalance,
        revenue,
        ethPrice,
      } = action.payload;
      state.shareTotalValue = shareTotalValue;
      state.shareTotalSupply = shareTotalSupply;
      state.shareTotalVolume = shareTotalVolume;
      state.shareActivities = shareActivities;
      state.userShareBalance = userShareBalance;
      state.revenuePoolShareBalance = revenuePoolShareBalance;
      state.revenue = revenue;
      state.ethPrice = ethPrice;
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
    builder.addCase(loadCreatorUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

export default creatorSlice.reducer;
