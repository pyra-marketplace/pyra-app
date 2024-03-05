import React from "react";

import { Wrapper } from "./styled";

import SearchIconSvg from "@/assets/icons/search.svg";
import PyraSvg from "@/assets/pyra.svg";

export const HomeHeader = (): React.ReactElement => {
  return (
    <Wrapper>
      <div className='inner-header'>
        <div className='left'>
          <div className='brand'>
            <img src={PyraSvg} alt='Pyra' />
            <span className='brand-name'>PYRA</span>
          </div>
          <div className='search'>
            <img className='search-icon' src={SearchIconSvg} alt='Search' />
          </div>
        </div>
        <div className='right'>
          <div className='link'>Home</div>
          <div className='link'>Create</div>
          <button className='link'>Connect Wallet</button>
        </div>
      </div>
    </Wrapper>
  );
};
