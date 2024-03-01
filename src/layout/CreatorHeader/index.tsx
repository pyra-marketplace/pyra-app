import React from "react";

import { Wrapper } from "./styled";

import DownArrowSvg from "@/assets/icons/down-arrow.svg";
import PyraSvg from "@/assets/pyra.svg";

export const CreatorHeader = (): React.ReactElement => {
  return (
    <Wrapper>
      <div className='inner-header'>
        <div className='left'>
          <div className='brand'>
            <img src={PyraSvg} alt='Pyra' />
            <span className='brand-name'>PYRA-WTF</span>
          </div>
        </div>
        <div className='right'>
          <div className='chip'>
            <span>0x65...00f1</span>
            <img
              src={DownArrowSvg}
              style={{ marginLeft: "28px", cursor: "pointer" }}
              alt='Down Arrow'
            />
          </div>
          <div className='chip'>
            <span>1.228</span>
            <span style={{ marginLeft: "18px" }}>ETH</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
