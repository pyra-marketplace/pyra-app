import React, { useContext } from "react";

import { Auth, message } from "@meteor-web3/components";
import { MeteorContext, useAction, useStore } from "@meteor-web3/hooks";
import { useLocation, useNavigate } from "react-router-dom";

import { Wrapper } from "./styled";

import SearchIconSvg from "@/assets/icons/search.svg";
import PyraSvg from "@/assets/pyra.svg";
import { useSelector } from "@/state/hook";
import { stringAbbreviation } from "@/utils";

export const HomeHeader = (): React.ReactElement => {
  const navigate = useNavigate();
  const { pkh, address } = useStore();
  const meteorContext = useContext(MeteorContext);
  const autoConnecting = useSelector(state => state.global.autoConnecting);

  const handleConnect = async () => {
    if (autoConnecting) {
      message.info("Please wait for auto connecting...");
      return;
    }
    const connectRes = await Auth.openModal(
      {
        appId: process.env.METEOR_APP_ID!,
      },
      meteorContext,
    );
    console.log(connectRes);
  };

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
          <div className='link' onClick={() => navigate("/")}>
            Home
          </div>
          <div
            className='link'
            onClick={() => {
              if (!address) {
                message.error("Please connect wallet first");
                return;
              }
              navigate("/creator/" + address);
            }}
          >
            Create
          </div>
          <button className='link' onClick={handleConnect}>
            {autoConnecting
              ? "Connecting..."
              : pkh
                ? stringAbbreviation(address, 4, 4)
                : "Connect Wallet"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};
