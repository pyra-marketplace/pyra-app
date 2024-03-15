import React, { useContext, useEffect, useState } from "react";

import { Auth, message } from "@meteor-web3/components";
import { MeteorContext, useAction, useStore } from "@meteor-web3/hooks";
import { Auth as TwitterAuth } from "@pyra-marketplace/pyra-sdk";
import { useLocation, useNavigate } from "react-router-dom";

import { Wrapper } from "./styled";

import SearchIconSvg from "@/assets/icons/search.svg";
import PyraSvg from "@/assets/pyra.svg";
import { globalSlice } from "@/state/global/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { stringAbbreviation } from "@/utils";

export const HomeHeader = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pkh, address } = useStore();
  const meteorContext = useContext(MeteorContext);
  const autoConnecting = useSelector(state => state.global.autoConnecting);
  const userInfo = useSelector(state => state.global.userInfo);

  const [authenticating, setAuthenticating] = useState(false);

  const handleConnect = async () => {
    if (autoConnecting) {
      message.info("Please wait for auto connecting...");
      return;
    }
    if (authenticating) {
      message.info("Please wait for authenticating...");
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

  const handleBindTwitter = async () => {
    setAuthenticating(true);
    const { url } = await TwitterAuth.login({
      connector: meteorContext.connector,
      redirectUrl: location.href,
    });
    location.replace(url);
  };

  const handleAuth = async () => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (code && state) {
      setAuthenticating(true);
      try {
        const userInfo = await TwitterAuth.bind({
          code,
          state,
        });
        console.log({ userInfo });
        dispatch(globalSlice.actions.setUserInfo(userInfo));
        message.success("Bing twitter successfully.");
      } catch (e: any) {
        console.warn(e);
        message.error("Bind twitter failed, please try again.");
      }
      setAuthenticating(false);
      return;
    }
    if (address) {
      try {
        const userInfo = await TwitterAuth.info({
          address,
        });
        dispatch(globalSlice.actions.setUserInfo(userInfo));
        console.log({ userInfo });
      } catch (e: any) {
        dispatch(globalSlice.actions.setUserInfo(undefined));
        console.warn(e);
      }
    }
  };

  useEffect(() => {
    handleAuth();
  }, [address, location]);

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
          <button
            className='link'
            onClick={() => {
              if (pkh && !userInfo) {
                handleBindTwitter();
              } else {
                handleConnect();
              }
            }}
          >
            {autoConnecting
              ? "Connecting..."
              : authenticating
                ? "Authenticating..."
                : pkh && !userInfo
                  ? "Bind twitter"
                  : pkh && userInfo
                    ? stringAbbreviation(address, 4, 4)
                    : "Connect Wallet"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};
