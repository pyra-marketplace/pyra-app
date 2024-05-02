import React, { useEffect, useState } from "react";

import { TabButtonsWrap } from "./styled";

export interface TabButtonsProps<T = React.ReactNode> {
  tabs: T[];
  defaultSelectedTab?: T | number;
  controlledSelectedTab?: T | number;
  onChange?: (tab: T, idx: number) => void;
  className?: string;
  style?: React.CSSProperties;
  small?: boolean;
  plain?: boolean;
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  defaultSelectedTab,
  controlledSelectedTab,
  onChange,
  className,
  style,
  small,
  plain,
}) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(
    (typeof defaultSelectedTab === "number"
      ? defaultSelectedTab
      : tabs.indexOf(defaultSelectedTab)) || 0,
  );

  useEffect(() => {
    if (controlledSelectedTab) {
      setSelectedTabIdx(
        typeof controlledSelectedTab === "number"
          ? controlledSelectedTab
          : tabs.indexOf(controlledSelectedTab),
      );
    }
  }, [controlledSelectedTab]);

  const handleChangeTab = (idx: number) => {
    if (!controlledSelectedTab) {
      setSelectedTabIdx(idx);
    }
    onChange?.(tabs[idx], idx);
  };

  return (
    <TabButtonsWrap
      className={className}
      style={style}
      small={small}
      plain={plain}
    >
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          className='tab-button'
          data-active={selectedTabIdx === idx}
          onClick={() => handleChangeTab(idx)}
        >
          {tab}
        </button>
      ))}
    </TabButtonsWrap>
  );
};
