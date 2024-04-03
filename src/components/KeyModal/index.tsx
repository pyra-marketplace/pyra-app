import React, { useEffect, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, SellWrapper, BuyWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  buyTierkey,
  loadClaimableRevenue,
  loadCreatorBaseInfos,
  sellTierkey,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { uuid } from "@/utils";

export interface KeyModalProps {
  option: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const KeyModal = ({
  option: defaultOption,
  visible,
  setVisible,
}: KeyModalProps) => {
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [option, setOption] = useState(defaultOption);
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    setOption(defaultOption);
  }, [defaultOption]);

  const cancel = () => {
    if (defaultOption !== 0) {
      setVisible(false);
    } else {
      setOption(0);
    }
  };

  const buy = async () => {
    setBuying(true);
    try {
      if (!creatorStates.pyraZone?.asset_id) {
        return;
      }
      const res = await dispatch(
        buyTierkey({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone.asset_id,
          connector,
          tier: 0,
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Buy tier key successfully");
        dispatch(
          loadCreatorBaseInfos({
            chainId: globalStates.chainId,
            address: (address || userAddress)!,
            userAddress,
            assetId: creatorStates.pyraZone.asset_id,
            connector,
          }),
        );
        dispatch(
          loadClaimableRevenue({
            chainId: globalStates.chainId,
            revenuePoolAddress: creatorStates.revenuePoolAddress!,
            address: (address || userAddress)!,
            connector,
          }),
        );
      }
    } catch (e: any) {
      console.warn(e);
      message.error(e.reason);
    }
    setBuying(false);
    return;
  };

  const sell = async () => {
    setSelling(true);
    try {
      if (!creatorStates.pyraZone?.asset_id) {
        return;
      }
      const res = await dispatch(
        sellTierkey({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone.asset_id,
          connector,
          keyId: "0",
          tier: 0,
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Sell tier key successfully");
        dispatch(
          loadCreatorBaseInfos({
            chainId: globalStates.chainId,
            address: (address || userAddress)!,
            userAddress,
            assetId: creatorStates.pyraZone.asset_id,
            connector,
          }),
        );
        dispatch(
          loadClaimableRevenue({
            chainId: globalStates.chainId,
            revenuePoolAddress: creatorStates.revenuePoolAddress!,
            address: (address || userAddress)!,
            connector,
          }),
        );
      }
    } catch (e: any) {
      console.warn(e);
      message.error(e.reason);
    }
    setSelling(false);
    return;
  };

  return (
    <FullScreenModal
      id={`file-info-modal-${uuid()}`}
      portal
      controlVisible={visible}
      onCancel={() => setVisible(false)}
    >
      <Wrapper>
        <div className='close-wrapper'>
          <img
            src={closeImg}
            className='close'
            onClick={() => setVisible(false)}
          />
        </div>
        {option === 0 ? (
          <OutWrapper>
            <div className='sell-button' onClick={() => setOption(1)}>
              Sell Key
            </div>
            <div className='buy-button' onClick={() => setOption(2)}>
              Buy Key
            </div>
          </OutWrapper>
        ) : option === 1 ? (
          <BuyWrapper>
            <div
              className='option'
              style={{
                backgroundColor: "#f6f6f6",
              }}
            >
              1 Key
            </div>
            <div className='buy-wrapper'>
              <div className='buy-info'>
                <div className='price'>
                  ${" "}
                  {globalStates.ethPrice &&
                  creatorStates.tierKeyBuyPrice &&
                  parseFloat(creatorStates.tierKeyBuyPrice) !== 0
                    ? (
                        parseFloat(creatorStates.tierKeyBuyPrice) *
                        globalStates.ethPrice
                      ).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {creatorStates.tierKeyBuyPrice &&
                  parseFloat(creatorStates.tierKeyBuyPrice) !== 0
                    ? parseFloat(creatorStates.tierKeyBuyPrice).toFixed(8)
                    : "0.0"}{" "}
                  {globalStates.chainCurrency}
                </div>
              </div>
              <div className='buy-button' onClick={buy}>
                {buying ? "Buying..." : "Buy"}
              </div>
            </div>

            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                cancel
              </div>
            </div>
          </BuyWrapper>
        ) : (
          <SellWrapper>
            <div className='title'>You own</div>
            <div className='key-number'>
              {creatorStates.userTierKeyBalance || "0"}{" "}
              <span className='unit'>
                {creatorStates.userTierKeyBalance === "0" ||
                creatorStates.userTierKeyBalance === "1"
                  ? "key"
                  : "keys"}
              </span>
            </div>
            <div className='key-price'>
              = $
              {globalStates.ethPrice &&
              creatorStates.tierKeySellPrice &&
              parseFloat(creatorStates.tierKeySellPrice) !== 0
                ? (
                    parseFloat(creatorStates.tierKeySellPrice) *
                    globalStates.ethPrice
                  ).toFixed(4)
                : "0.0"}{" "}
              <span className='eth'>
                (
                {creatorStates.tierKeySellPrice &&
                parseFloat(creatorStates.tierKeySellPrice) !== 0
                  ? parseFloat(creatorStates.tierKeySellPrice).toFixed(8)
                  : "0.0"}
                {globalStates.chainCurrency})
              </span>
            </div>
            <div className='sell-wrapper'>
              <div className='sell-info'>
                <div className='price'>
                  ${" "}
                  {globalStates.ethPrice &&
                  creatorStates.tierKeySellPrice &&
                  parseFloat(creatorStates.tierKeySellPrice) !== 0
                    ? (
                        parseFloat(creatorStates.tierKeySellPrice) *
                        globalStates.ethPrice
                      ).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {creatorStates.tierKeySellPrice &&
                  parseFloat(creatorStates.tierKeySellPrice) !== 0
                    ? parseFloat(creatorStates.tierKeySellPrice).toFixed(8)
                    : "0.0"}
                  {globalStates.chainCurrency}
                </div>
              </div>
              <div className='sell-button' onClick={sell}>
                {selling ? "Selling..." : "Sell"}
              </div>
            </div>
            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                cancel
              </div>
            </div>
          </SellWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
