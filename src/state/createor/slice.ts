/* eslint-disable no-empty */
import {
  Connector,
  MirrorFileRecord,
  StructuredFolder,
  StructuredFolderRecord,
} from "@meteor-web3/connector";
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
  PublisherDailyRecordRes,
  PublisherProfileRes,
} from "@pyra-marketplace/pyra-sdk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { ipfs } from "@/utils";
import { adaptFolders } from "@/utils/file";

export interface CreatorStates {
  emptyUserInfo: boolean;
  emptyProfile: boolean;
  emptyPyraMarket: boolean;
  emptyPyraZone: boolean;
  isGuidingPage?: boolean;
  pyraZone?: PyraZoneRes;
  pyraMarket?: PyraMarketRes;
  publisherProfile?: PublisherProfileRes;
  selectedTier: number;
  shareBuyPrice?: string;
  shareSellPrice?: string;
  tierKeyBuyPrice?: string;
  tierKeySellPrice?: string;
  userTierKeyBalance?: string;
  tierKeyHolders?: PyraZoneTierkeyHolderRes[];
  shareHolders?: PyraMarketShareHolderRes[];
  userShareHolder?: PyraMarketShareHolderRes;
  userTierKeys?: PyraZoneTierkeyHolderRes[][];
  shareAddress?: string;
  revenuePoolAddress?: string;
  shareTotalValue?: string;
  shareTotalSupply?: string;
  userShareBalance?: string;
  revenuePoolShareBalance?: string;
  revenue?: string;
  shareTotalVolume?: string;
  shareActivities?: PyraMarketShareActivityRes[];
  publisherDailyRecord?: PublisherDailyRecordRes[];
  contentFolders?: StructuredFolderRecord;
  contentAccessible?: boolean[];
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
  emptyUserInfo: false,
  emptyProfile: false,
  emptyPyraMarket: false,
  emptyPyraZone: false,
  pyraZone: undefined,
  publisherProfile: undefined,
  selectedTier: -1, // -1 means selected All tiers
  shareBuyPrice: undefined,
  tierKeyBuyPrice: undefined,
  tierKeySellPrice: undefined,
  userTierKeyBalance: undefined,
  tierKeyHolders: undefined,
  shareHolders: undefined,
  userShareHolder: undefined,
  userTierKeys: undefined,
  shareAddress: undefined,
  revenuePoolAddress: undefined,
  shareTotalValue: undefined,
  shareTotalSupply: undefined,
  userShareBalance: undefined,
  revenuePoolShareBalance: undefined,
  revenue: undefined,
  shareTotalVolume: undefined,
  shareActivities: undefined,
  contentFolders: undefined,
  contentAccessible: undefined,
  userInfo: undefined,
};

export const createPryaZone = createAsyncThunk(
  "global/createPryaZone",
  async (args: { chainId: number; address: string; connector: Connector }) => {
    const { chainId, connector } = args;
    try {
      const pyraZone = new PyraZone({
        chainId,
        connector,
      });
      await pyraZone.createPyraZone();
    } catch (error: any) {
      throw new Error(error.reason ?? error.message);
    }
    return true;
  },
);

export const createShare = createAsyncThunk(
  "global/createShare",
  async (args: { chainId: number; username: string; connector: Connector }) => {
    const { chainId, username, connector } = args;
    const pyraMarket = new PyraMarket({
      chainId,
      connector,
    });
    try {
      await pyraMarket.createShare({
        shareName: `${username.slice(0, 1).toUpperCase()}${username.slice(1)} Share`,
        shareSymbol: `PYRA_${username.replaceAll("_", "").slice(0, 3).toUpperCase()}`,
      });
    } catch (error: any) {
      throw new Error(error.reason ?? error.message);
    }
    return true;
  },
);

export const updatePublisherProfile = createAsyncThunk(
  "global/updatePublisherProfile",
  async (args: {
    address: string;
    connector: Connector;
    profile: {
      nickname?: string;
      coverImageUrl?: string;
      coverImageFile?: File;
    };
  }) => {
    const { address, connector, profile } = args;
    if (
      !profile.nickname &&
      !profile.coverImageUrl &&
      !profile.coverImageFile
    ) {
      return false;
    }
    let coverImageUrl = profile.coverImageUrl;
    if (profile.coverImageFile) {
      coverImageUrl = await connector
        .uploadFile(profile.coverImageFile)
        .then(ipfs.getFileLink);
    }
    await PyraMarket.updatePublisherProfile({
      publisher: address,
      nickName: profile.nickname,
      coverImageUrl: coverImageUrl!,
      connector,
    });
    return true;
  },
);

export const loadPublisherProfile = createAsyncThunk(
  "global/loadPublisherProfile",
  async (args: { address: string }) => {
    const { address } = args;
    const profile = await PyraMarket.loadPublisherProfile(address);
    return profile;
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

export const buyTierkey = createAsyncThunk(
  "creator/buyTierkey",
  async (args: {
    chainId: number;
    assetId: string;
    connector: Connector;
    tier: number;
  }) => {
    const { chainId, assetId, connector, tier } = args;
    console.log({ args });
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const keyId = await pyraZone.buyTierkey(tier);
    return keyId;
  },
);

export const sellTierkey = createAsyncThunk(
  "creator/sellTierkey",
  async (args: {
    chainId: number;
    assetId: string;
    connector: Connector;
    tier: number;
    keyId: string;
  }) => {
    const { chainId, assetId, connector, tier, keyId } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    await pyraZone.sellTierkey({ tier, keyId });
  },
);

export const stake = createAsyncThunk(
  "creator/stake",
  async (args: {
    chainId: number;
    shareAddress: string;
    revenuePoolAddress: string;
    connector: Connector;
    amount: ethers.BigNumber;
  }) => {
    const { chainId, shareAddress, revenuePoolAddress, connector, amount } =
      args;
    const pyraZone = new RevenuePool({
      chainId,
      shareAddress,
      revenuePoolAddress,
      connector,
    });
    await pyraZone.stake(amount);
  },
);

export const unstake = createAsyncThunk(
  "creator/unstake",
  async (args: {
    chainId: number;
    revenuePoolAddress: string;
    connector: Connector;
    amount: ethers.BigNumber;
  }) => {
    const { chainId, revenuePoolAddress, connector, amount } = args;
    const pyraZone = new RevenuePool({
      chainId,
      revenuePoolAddress,
      connector,
    });
    await pyraZone.unstake(amount);
  },
);

export const claim = createAsyncThunk(
  "creator/claim",
  async (args: {
    chainId: number;
    revenuePoolAddress: string;
    connector: Connector;
  }) => {
    const { chainId, revenuePoolAddress, connector } = args;
    const pyraZone = new RevenuePool({
      chainId,
      revenuePoolAddress,
      connector,
    });
    await pyraZone.claim();
  },
);

export const loadClaimableRevenue = createAsyncThunk(
  "creator/loadClaimableRevenue",
  async (args: {
    chainId: number;
    revenuePoolAddress: string;
    address: string;
    connector: Connector;
  }) => {
    const { chainId, revenuePoolAddress, connector } = args;
    const revenuePool = new RevenuePool({
      chainId,
      revenuePoolAddress,
      connector,
    });
    const revenue = await revenuePool.loadClaimableRevenue();
    return ethers.utils.formatEther(revenue);
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
    let pyraZone = pyraZones[0] as PyraZoneRes | undefined;
    if (pyraZone) {
      pyraZone = {
        ...pyraZone,
        tierkey_prices: pyraZone.tierkey_prices.map(price =>
          ethers.utils.formatEther(price),
        ),
      };
    }
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
  async (
    args: {
      chainId: number;
      address: string;
      userAddress?: string;
      assetId: string;
      connector: Connector;
      tier?: number;
    },
    { getState },
  ) => {
    const state = getState() as { creator: CreatorStates };
    const { chainId, address, userAddress, assetId, connector, tier } = args;
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
    let tierKeySellPrice;
    try {
      tierKeySellPrice = await pyraZone.loadSellPrice(tier || 0);
    } catch (error) {
      console.warn(error);
    }
    let userTierKeyBalance;
    try {
      if (userAddress) {
        userTierKeyBalance = await pyraZone.loadTierkeyBalance({
          tier: tier || 0,
          address: userAddress,
        });
      }
    } catch (error) {}
    const tierKeyHolders = await PyraZone.loadPyraZoneTierkeyHolders({
      chainId,
      assetId,
      tier: tier || 0,
    });
    const tierLength = state.creator.pyraZone?.tierkeys.length || 3;
    const userTierKeys: PyraZoneTierkeyHolderRes[][] = [
      ...new Array(tierLength),
    ].fill([]);
    if (userAddress) {
      for (let i = 0; i < tierLength; i++) {
        userTierKeys[i] = await PyraZone.loadPyraZoneTierkeyHolders({
          chainId,
          assetId,
          tier: i,
          tierkeyHolder: userAddress,
        });
        userTierKeys[i] = userTierKeys[i].map(item => ({
          ...item,
          ...(item.remaining_price && {
            remaining_price: ethers.utils.formatEther(item.remaining_price),
          }),
        }));
      }
    }
    const shareHolders = await PyraMarket.loadPyraMarketShareHolders({
      chainId,
      publisher: address,
    });

    return {
      shareBuyPrice: ethers.utils.formatEther(shareBuyPrice),
      tierKeyBuyPrice: ethers.utils.formatEther(tierKeyBuyPrice),
      tierKeySellPrice: tierKeySellPrice
        ? ethers.utils.formatEther(tierKeySellPrice)
        : "0",
      userTierKeyBalance: userTierKeyBalance
        ? userTierKeyBalance.toString()
        : "0",
      tierKeyHolders,
      userTierKeys,
      shareHolders,
    };
  },
);

export const loadTierkeyBalance = createAsyncThunk(
  "creator/loadTierkeyBalance",
  async (args: {
    chainId: number;
    assetId: string;
    connector: Connector;
    tier: number;
    userAddress: string;
  }) => {
    const { chainId, assetId, connector, tier, userAddress } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const userTierKeyBalance = await pyraZone.loadTierkeyBalance({
      tier: tier || 0,
      address: userAddress,
    });

    return userTierKeyBalance.toString();
  },
);

export const loadUserTierKeys = createAsyncThunk(
  "creator/userTierKeys",
  async (args: {
    chainId: number;
    assetId: string;
    tier: number;
    userAddress: string;
  }) => {
    const { chainId, assetId, tier, userAddress } = args;
    let userTierKeys = await PyraZone.loadPyraZoneTierkeyHolders({
      chainId,
      assetId,
      tier: tier || 0,
      tierkeyHolder: userAddress,
    });
    userTierKeys = userTierKeys.map(item => ({
      ...item,
      ...(item.remaining_price && {
        remaining_price: ethers.utils.formatEther(item.remaining_price),
      }),
    }));
    return userTierKeys;
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
  async (args: {
    chainId: number;
    address: string;
    userAddress?: string;
    connector: Connector;
  }) => {
    const { chainId, address, userAddress, connector } = args;
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
    let userShareBalance;
    try {
      if (userAddress) {
        userShareBalance = await pyraMarket.loadShareBalance({
          shareAddress,
          address: userAddress,
        });
      }
    } catch (error) {}
    const revenuePoolShareBalance = await pyraMarket.loadShareBalance({
      shareAddress,
      address: revenuePoolAddress,
    });
    const revenuePool = new RevenuePool({
      chainId,
      revenuePoolAddress,
      connector,
    });
    let revenue;
    try {
      revenue = await revenuePool.loadClaimableRevenue();
    } catch (error) {}
    let shareActivities = await PyraMarket.loadPyraMarketShareActivities({
      chainId,
      publisher: address,
      orderBy: "block_number",
      orderType: "desc",
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
        sell_price: ethers.utils.formatEther(item.sell_price),
      }),
    }));
    let userShareHolders = await PyraMarket.loadPyraMarketShareHolders({
      chainId,
      publisher: address,
      shareholder: userAddress,
    });
    userShareHolders = userShareHolders.map((item: any) => ({
      ...item,
      ...(item.staked_amount && {
        staked_amount: ethers.utils.formatEther(item.staked_amount),
      }),
      ...(item.total_amount && {
        total_amount: ethers.utils.formatEther(item.total_amount),
      }),
      ...(item.claimed_revenue && {
        claimed_revenue: ethers.utils.formatEther(item.claimed_revenue),
      }),
    }));

    let publisherDailyRecord = await PyraMarket.loadPublisherDailyRecordChart({
      chainId,
      publisher: address,
      days: 15,
    });
    publisherDailyRecord = publisherDailyRecord.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      share_volume: ethers.utils.formatEther(item.share_volume),
    }));

    return {
      shareTotalValue: pyraMarkets[0]?.total_value,
      shareTotalSupply: ethers.utils.formatEther(shareTotalSupply),
      shareTotalVolume: pyraMarkets[0]?.total_volume,
      shareActivities,
      shareAddress,
      revenuePoolAddress,
      userShareBalance: userShareBalance
        ? ethers.utils.formatEther(userShareBalance)
        : "0",
      userShareHolder: userShareHolders[0],
      revenuePoolShareBalance: ethers.utils.formatEther(
        revenuePoolShareBalance,
      ),
      revenue: revenue ? ethers.utils.formatEther(revenue) : "0",
      publisherDailyRecord,
    };
  },
);

export const loadCreatorContents = createAsyncThunk(
  "creator/loadCreatorContents",
  async (
    args: {
      chainId: number;
      assetId: string;
      accountAddress?: string;
      connector: Connector;
    },
    { getState },
  ) => {
    const state = getState() as { creator: CreatorStates };
    const { chainId, assetId, accountAddress, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const folders = await pyraZone.loadFoldersInPyraZone(assetId);
    const tierLength = state.creator.pyraZone?.tierkeys.length || 3;
    const isAccessible: boolean[] = [...new Array(tierLength)].fill(false);
    if (accountAddress) {
      for (let i = 0; i < tierLength; i++) {
        isAccessible[i] = await pyraZone.isAccessible({
          tier: i,
          account: accountAddress,
        });
      }
    }
    console.log({ isAccessible });
    return { folders, isAccessible };
  },
);

export const loadContentAccessible = createAsyncThunk(
  "creator/loadContentAccessible",
  async (
    args: {
      chainId: number;
      assetId: string;
      accountAddress: string;
      connector: Connector;
    },
    { getState },
  ) => {
    const state = getState() as { creator: CreatorStates };
    const { chainId, assetId, accountAddress, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const tierLength = state.creator.pyraZone?.tierkeys.length || 3;
    const isAccessible: boolean[] = [...new Array(tierLength)].fill(false);
    if (accountAddress) {
      for (let i = 0; i < tierLength; i++) {
        isAccessible[i] = await pyraZone.isAccessible({
          tier: i,
          account: accountAddress,
        });
      }
    }
    console.log({ isAccessible });
    return isAccessible;
  },
);

export const unlockCreatorContents = createAsyncThunk(
  "creator/unlockCreatorContents",
  async (
    args: { chainId: number; assetId: string; connector: Connector },
    { getState },
  ) => {
    const state = getState() as { creator: CreatorStates };
    const { chainId, assetId, connector } = args;
    const pyraZone = new PyraZone({
      chainId,
      assetId,
      connector,
    });
    const unlockFoldersResult = await Promise.allSettled(
      Object.values(state.creator.contentFolders || {}).map(folder => {
        return pyraZone.unlockFolder(folder.folderId);
      }),
    );
    const unlockedFolders = unlockFoldersResult
      .filter(item => item.status === "fulfilled")
      .map(item => (item as PromiseFulfilledResult<StructuredFolder>).value);
    console.log("unlocking folder...", {
      unlockFoldersResult,
      unlockedFolders,
    });
    return { unlockedFolders };
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

export const loadShareActivity = createAsyncThunk(
  "creator/loadShareActivity",
  async (args: {
    chainId: number;
    address: string;
    page?: number;
    pageSize?: number;
    orderBy?: "block_number";
    orderType?: "asc" | "desc";
  }) => {
    const { chainId, address, page, pageSize, orderBy, orderType } = args;
    let shareActivities = await PyraMarket.loadPyraMarketShareActivities({
      chainId,
      publisher: address,
      page,
      pageSize,
      orderBy,
      orderType,
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
        sell_price: ethers.utils.formatEther(item.sell_price),
      }),
    }));
    return shareActivities;
  },
);

export const loadShareHolders = createAsyncThunk(
  "creator/loadShareHolders",
  async (args: {
    chainId: number;
    address: string;
    page?: number;
    pageSize?: number;
    orderBy?: "total_amount";
    orderType?: "asc" | "desc";
  }) => {
    const { chainId, address, page, pageSize, orderBy, orderType } = args;
    let shareHolders = await PyraMarket.loadPyraMarketShareHolders({
      chainId,
      publisher: address,
      page,
      pageSize,
      orderBy,
      orderType,
    });
    shareHolders = shareHolders.map((item: any) => ({
      ...item,
      ...(item.staked_amount && {
        staked_amount: ethers.utils.formatEther(item.staked_amount),
      }),
      ...(item.total_amount && {
        total_amount: ethers.utils.formatEther(item.total_amount),
      }),
      ...(item.claimed_revenue && {
        claimed_revenue: ethers.utils.formatEther(item.claimed_revenue),
      }),
    }));
    return shareHolders;
  },
);

export const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    setEmptyUserInfo: (state, action: PayloadAction<boolean>) => {
      state.emptyUserInfo = action.payload;
    },
    setEmptyProfile: (state, action: PayloadAction<boolean>) => {
      state.emptyProfile = action.payload;
    },
    setEmptyPyraMarket: (state, action: PayloadAction<boolean>) => {
      state.emptyPyraMarket = action.payload;
    },
    setEmptyPyraZone: (state, action: PayloadAction<boolean>) => {
      state.emptyPyraZone = action.payload;
    },
    setIsGuidingPage: (state, action: PayloadAction<boolean>) => {
      state.isGuidingPage = action.payload;
    },
    setPyraZone: (state, action: PayloadAction<PyraZoneRes>) => {
      state.pyraZone = action.payload;
    },
    setSelectedTier: (state, action: PayloadAction<number>) => {
      state.selectedTier = action.payload;
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
    setContentAccessible: (
      state,
      action: PayloadAction<boolean[] | undefined>,
    ) => {
      const accessible = action.payload;
      if (
        state.contentAccessible &&
        action.payload &&
        state.contentAccessible.length === accessible?.length &&
        state.contentAccessible.every((v, i) => v === accessible[i])
      ) {
        // if the contentAccessible is not changed, do nothing
        return;
      }
      state.contentAccessible = action.payload;
    },
    setContentAccessibleByTier: (
      state,
      action: PayloadAction<{ tier: number; accessible: boolean }>,
    ) => {
      const { tier, accessible } = action.payload;
      state.contentAccessible = state.contentAccessible || [];
      state.contentAccessible[tier] = accessible;
    },
    setUserInfo: (state, action: PayloadAction<CreatorStates["userInfo"]>) => {
      state.userInfo = action.payload;
    },
    clearAllInfos: state => {
      state = { ...initialState };
    },
    resetEmpty: state => {
      state.emptyUserInfo = false;
      state.emptyProfile = false;
      state.emptyPyraMarket = false;
      state.emptyPyraZone = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadPyraZone.fulfilled, (state, action) => {
      const { pyraZone, pyraMarket } = action.payload;
      state.pyraZone = pyraZone;
      state.pyraMarket = pyraMarket;
    });
    builder.addCase(loadPublisherProfile.fulfilled, (state, action) => {
      state.publisherProfile = action.payload;
    });
    builder.addCase(loadCreatorBaseInfos.fulfilled, (state, action) => {
      const {
        shareBuyPrice,
        tierKeyBuyPrice,
        tierKeySellPrice,
        userTierKeyBalance,
        tierKeyHolders,
        shareHolders,
        userTierKeys,
      } = action.payload;
      state.shareBuyPrice = shareBuyPrice;
      state.tierKeyBuyPrice = tierKeyBuyPrice;
      state.tierKeySellPrice = tierKeySellPrice;
      state.userTierKeyBalance = userTierKeyBalance;
      state.tierKeyHolders = tierKeyHolders;
      state.shareHolders = shareHolders;
      state.userTierKeys = userTierKeys;
    });
    builder.addCase(loadShareSellPrice.fulfilled, (state, action) => {
      state.shareSellPrice = action.payload;
    });
    builder.addCase(loadClaimableRevenue.fulfilled, (state, action) => {
      state.revenue = action.payload;
    });
    builder.addCase(loadCreatorShareInfos.fulfilled, (state, action) => {
      const {
        shareTotalValue,
        shareTotalSupply,
        shareTotalVolume,
        shareActivities,
        shareAddress,
        revenuePoolAddress,
        userShareBalance,
        userShareHolder,
        revenuePoolShareBalance,
        revenue,
        publisherDailyRecord,
      } = action.payload;
      state.shareTotalValue = shareTotalValue;
      state.shareTotalSupply = shareTotalSupply;
      state.shareTotalVolume = shareTotalVolume;
      state.shareActivities = shareActivities;
      state.shareAddress = shareAddress;
      state.revenuePoolAddress = revenuePoolAddress;
      state.userShareBalance = userShareBalance;
      state.userShareHolder = userShareHolder;
      state.revenuePoolShareBalance = revenuePoolShareBalance;
      state.revenue = revenue;
      state.publisherDailyRecord = publisherDailyRecord;
    });
    builder.addCase(loadCreatorContents.fulfilled, (state, action) => {
      const { folders, isAccessible } = action.payload;
      state.contentFolders = adaptFolders(folders);
      state.contentAccessible = isAccessible;
    });
    builder.addCase(loadContentAccessible.fulfilled, (state, action) => {
      state.contentAccessible = action.payload;
    });
    builder.addCase(unlockCreatorContents.fulfilled, (state, action) => {
      const { unlockedFolders } = action.payload;
      const contentFolders: StructuredFolderRecord = {
        ...state.contentFolders,
      };
      unlockedFolders.forEach(folder => {
        if (contentFolders[folder.folderId]) {
          contentFolders[folder.folderId] = folder;
        }
      });
      state.contentFolders = adaptFolders(contentFolders);
    });
    builder.addCase(loadCreatorUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

export default creatorSlice.reducer;
