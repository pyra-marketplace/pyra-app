import React, { useEffect, useState } from "react";

import { TabButtonsWrap } from "./styled";

export interface TabButtonsProps {
  tabs: string[];
  defaultSelectedTab?: string | number;
  controlledSelectedTab?: string | number;
  onChange?: (tab: string, idx: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  defaultSelectedTab,
  controlledSelectedTab,
  onChange,
  className,
  style,
}) => {
  const [selectedTabButton, setSelectedTabButton] = useState(
    (typeof defaultSelectedTab === "number"
      ? tabs[defaultSelectedTab]
      : defaultSelectedTab) ||
      tabs[0] ||
      "",
  );

  useEffect(() => {
    if (controlledSelectedTab) {
      setSelectedTabButton(
        typeof controlledSelectedTab === "number"
          ? tabs[controlledSelectedTab]
          : controlledSelectedTab,
      );
    }
  }, [controlledSelectedTab]);

  const handleChangeTab = (idx: number) => {
    if (!controlledSelectedTab) {
      setSelectedTabButton(tabs[idx]);
    }
    onChange?.(tabs[idx], idx);
  };

  return (
    <TabButtonsWrap className={className} style={style}>
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          className='tab-button'
          data-active={selectedTabButton === tab}
          onClick={() => handleChangeTab(idx)}
        >
          {tab}
        </button>
      ))}
    </TabButtonsWrap>
  );
};
