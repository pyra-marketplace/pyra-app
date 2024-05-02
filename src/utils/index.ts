import { message } from "@meteor-web3/components";
import { IPFS } from "@meteor-web3/utils";
import { ChainId, DEPLOYED_ADDRESSES } from "@pyra-marketplace/pyra-sdk";
import { ethers } from "ethers";
export * from "./ui";

export const ipfs = new IPFS();

function getWindowFeatures() {
  let left = 0;
  let top = 0;
  const width = 600;
  const height = innerHeight;
  top = Math.max(screenY, (outerHeight - height) / 2 + screenY + 25);
  left = Math.max(screenX + (outerWidth - width) / 2, 0);
  return `width=${width}, height=${height}, top=${top}, left=${left}, popup`;
}

export const openTwitterAuth = () => {
  const TWITTER_AUTH_URL = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=MWFyTkV3aWt1T0RoeWxfSF9rRG46MTpjaQ&state=state&scope=tweet.read%20users.read&redirect_uri=${encodeURIComponent(location.origin + "/twitter-callback")}&code_challenge=gsdsdfndsbdSDFfhgdgeriporweuSFGHlrpwoebsdgs450235_fgsdg&code_challenge_method=plain`;

  open(TWITTER_AUTH_URL, "twitterTab", getWindowFeatures());
};

export const buildSortedItems = <T>(items: T[], getDate: (item: T) => Date) => {
  const rules = [
    {
      name: "Today",
      rule: (item: T) => {
        const today = new Date();
        const date = getDate(item);
        return (
          today.getFullYear() === date.getFullYear() &&
          today.getMonth() === date.getMonth() &&
          today.getDate() === date.getDate()
        );
      },
    },
    {
      name: "Yesterday",
      rule: (item: T) => {
        const today = new Date();
        const yesterday = new Date(today.setDate(today.getDate() - 1));
        const date = getDate(item);
        return (
          yesterday.getFullYear() === date.getFullYear() &&
          yesterday.getMonth() === date.getMonth() &&
          yesterday.getDate() === date.getDate()
        );
      },
    },
    {
      name: "This Week",
      rule: (item: T) => {
        const today = new Date();
        const thisWeek = new Date(
          today.setDate(today.getDate() - today.getDay()),
        );
        const date = getDate(item);
        return date >= thisWeek;
      },
    },
    {
      name: "This Month",
      rule: (item: T) => {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const date = getDate(item);
        return date >= thisMonth;
      },
    },
    {
      name: "This Year",
      rule: (item: T) => {
        const today = new Date();
        const thisYear = new Date(today.getFullYear(), 0, 1);
        const date = getDate(item);
        return date >= thisYear;
      },
    },
    {
      name: "Last Year And Earlier",
      rule: (item: T) => {
        const today = new Date();
        const thisYear = new Date(today.getFullYear(), 0, 1);
        const date = getDate(item);
        return date < thisYear;
      },
    },
  ];
  const sortedItems: { title: string; items: T[] }[] = [];
  // rules.forEach(rule => {
  //   sortedFolders[rule.name] = folders.filter(rule.rule);
  // });
  rules.forEach(rule => {
    sortedItems.push({ title: rule.name, items: [] });
  });
  items.forEach(item => {
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].rule(item)) {
        sortedItems[i].items.push(item);
        break;
      }
    }
  });
  return sortedItems;
};

export function stringAbbreviation(str?: string, prefix = 6, suffix = 4) {
  if (!str) return;
  return `${str.slice(0, prefix)}...${str.slice(-suffix, str.length)}`;
}

export function uuid() {
  const s: any = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}

export const getCurrencyNameByCurrencyAddress = (
  currencyAddress: string,
  chainId: ChainId = ChainId.PolygonMumbai,
) => {
  // const map: Record<string, string> = {
  //   "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e": "USDC",
  //   "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F": "DAI",
  //   "0x3C68CE8504087f89c640D02d133646d98e64ddd9": "WETH",
  //   "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889": "WMATIC",
  //   "0x0000000000000000000000000000000000000000": "",
  // };
  let map = (DEPLOYED_ADDRESSES as any)[chainId];
  if (map) {
    map = Object.keys(map).reduce(
      (r, k) => Object.assign(r, { [map[k]]: k }),
      {},
    );
    return map[currencyAddress] ?? "";
  }
  return "";
};

export function normalizedAddress(address: string) {
  return ethers.utils.getAddress(address);
}

export const getDefaultAvatar = (address?: string) =>
  address
    ? `https://mint.fun/api/avatar/${normalizedAddress(address)}?size=150`
    : "";

export const betterToFixed = (
  value?: string | number,
  decimals = 4,
  defaultEmptyString = "0.0",
) => {
  if (!value) return defaultEmptyString;
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  const formattedString = value.toLocaleString(undefined, {
    useGrouping: false,
    maximumFractionDigits: decimals,
  });
  if (formattedString === "0") return defaultEmptyString;
  return formattedString;
};

export const fullWideNumber = (
  value?: string | number,
  defaultEmptyString = "0.0",
) => {
  if (!value) return defaultEmptyString;
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  const formattedString = value.toLocaleString(undefined, {
    useGrouping: false,
    maximumSignificantDigits: 21,
  });
  if (formattedString === "0") return defaultEmptyString;
  return formattedString;
};

export const betterErrorPrompt = (error: any, prompt: string = "Error") => {
  let errorString: string;
  try {
    if (error.reason) {
      errorString = error.reason;
    } else if (error.message) {
      errorString = error.message;
    } else if (typeof error === "string") {
      errorString = error;
    } else {
      errorString = JSON.stringify(error);
    }
  } catch (e) {
    errorString = "";
  }
  if (errorString.toLowerCase().includes("request failed with status code")) {
    errorString = "Network error";
  }
  if (errorString.toLowerCase().includes("user rejected transaction")) {
    errorString = "User rejected transaction";
  }
  console.warn(`${prompt}: `, { error, errorString });
  message.error(`${prompt}: ` + errorString.slice(0, 100));
};
