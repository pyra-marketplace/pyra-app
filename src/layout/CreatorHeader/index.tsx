import React from "react";

import { useStore } from "@meteor-web3/hooks";

import { Wrapper } from "./styled";

import DownArrowSvg from "@/assets/icons/down-arrow.svg";
import PyraSvg from "@/assets/pyra.svg";
import { stringAbbreviation } from "@/utils";

export const CreatorHeader = (): React.ReactElement => {
  const { address } = useStore();

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
            <span>{address && stringAbbreviation(address, 4, 4)}</span>
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
