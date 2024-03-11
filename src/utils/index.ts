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
