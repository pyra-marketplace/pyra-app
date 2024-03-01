import React, { useState } from "react";

import { TabButtonsWrap } from "./styled";

export interface TabButtonsProps {
  tabs: string[];
  defaultSelectedTab?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  defaultSelectedTab,
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

  return (
    <TabButtonsWrap className={className} style={style}>
      {tabs.map(tab => (
        <button
          key={tab}
          className='tab-button'
          data-active={selectedTabButton === tab}
          onClick={() => setSelectedTabButton(tab)}
        >
          {tab}
        </button>
      ))}
    </TabButtonsWrap>
  );
};
