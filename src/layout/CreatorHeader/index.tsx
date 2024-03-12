import React, { useContext } from "react";

import { Auth } from "@meteor-web3/components";
import { MeteorContext, useStore } from "@meteor-web3/hooks";

import { Wrapper } from "./styled";

import DownArrowSvg from "@/assets/icons/down-arrow.svg";
import PyraSvg from "@/assets/pyra.svg";
import { useSelector } from "@/state/hook";
import { stringAbbreviation } from "@/utils";

export const CreatorHeader = (): React.ReactElement => {
  const { address } = useStore();
  const globalStates = useSelector(state => state.global);
  const meteorContext = useContext(MeteorContext);

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
          <div
            className='chip'
            style={{ cursor: "pointer" }}
            onClick={async () => {
              await Auth.openModal(
                {
                  appId: process.env.PYRA_APP_ID!,
                },
                meteorContext,
              );
            }}
          >
            <span>
              {globalStates.autoConnecting
                ? "Connecting..."
                : address
                  ? stringAbbreviation(address, 4, 4)
                  : "Connect Wallet"}
            </span>
            <img
              src={DownArrowSvg}
              style={{ marginLeft: "28px" }}
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
