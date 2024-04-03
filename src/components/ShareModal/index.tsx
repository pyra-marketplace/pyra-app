import React, { useEffect, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, SellWrapper, BuyWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  buyShares,
  loadCreatorShareInfos,
  loadShareBuyPrice,
  loadShareSellPrice,
  sellShares,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { uuid } from "@/utils";

export interface ShareModalProps {
  option: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ShareModal = ({
  option: defaultOption,
  visible,
  setVisible,
}: ShareModalProps) => {
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [option, setOption] = useState(defaultOption);
  const userShareBalance = useSelector(state => state.creator.userShareBalance);
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress, pkh } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    setOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    if (value) {
      if (parseFloat(value) < 0) {
        setValue("");
        return;
      }

      if (!creatorStates.userShareBalance) {
        return;
      }

      if (
        option === 2 &&
        parseFloat(value) > parseFloat(creatorStates.userShareBalance)
      ) {
        setValue(creatorStates.userShareBalance);
        return;
      }

      dispatch(
        (option === 1 ? loadShareBuyPrice : loadShareSellPrice)({
          chainId: globalStates.chainId,
          address: (address || userAddress)!,
          connector,
          amount: value,
        }),
      ).then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          setPrice(res.payload as string);
        }
      });
    } else {
      setPrice("");
    }
  }, [value]);

  useEffect(() => {
    setValue("");
  }, [option]);

  const onInput = async (e: { target: { value: any } }) => {
    const v = e.target.value;
    setValue(v);
  };

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
      const res = await dispatch(
        buyShares({
          chainId: globalStates.chainId,
          creator: (address || userAddress)!,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Buy shares successfully");
        dispatch(
          loadCreatorShareInfos({
            chainId: globalStates.chainId,
            address: (address || userAddress)!,
            userAddress,
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
      const res = await dispatch(
        sellShares({
          chainId: globalStates.chainId,
          creator: (address || userAddress)!,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Sell shares successfully");
        dispatch(
          loadCreatorShareInfos({
            chainId: globalStates.chainId,
            address: (address || userAddress)!,
            userAddress,
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

  // console.log({ userShareBalance });
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
              Sell Share
            </div>
            <div className='buy-button' onClick={() => setOption(2)}>
              Buy Share
            </div>
          </OutWrapper>
        ) : option === 1 ? (
          <BuyWrapper>
            <div className='title'>Own Creator’s share and start earning!</div>
            <div
              className='option'
              onClick={() => {
                setValue("0.01");
              }}
              style={{
                backgroundColor: value === "0.01" ? "#f6f6f6" : "unset",
              }}
            >
              0.01 Share
            </div>
            <div
              className='option'
              onClick={() => setValue("0.1")}
              style={{
                backgroundColor: value === "0.1" ? "#f6f6f6" : "unset",
              }}
            >
              0.1 Share
            </div>
            <div
              className='option'
              onClick={() => setValue("1")}
              style={{
                backgroundColor: value === "1" ? "#f6f6f6" : "unset",
              }}
            >
              1 Share
            </div>
            <div className='input-wrapper'>
              Amount of Shares
              <input
                type='number'
                className='input'
                value={value}
                placeholder='Set custom amount'
                onChange={onInput}
              />
            </div>
            <div className='buy-wrapper'>
              <div className='buy-info'>
                <div className='price'>
                  ${" "}
                  {creatorStates.ethPrice && price && parseFloat(price) !== 0
                    ? (parseFloat(price) * creatorStates.ethPrice).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {price && parseFloat(price) !== 0
                    ? parseFloat(price).toFixed(8)
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
            <div className='share-number'>
              {creatorStates.userShareBalance || 0}{" "}
              <span className='unit'>share</span>
            </div>
            <div className='share-price'>
              = $
              {creatorStates.ethPrice &&
              creatorStates.shareSellPrice &&
              parseFloat(creatorStates.shareSellPrice) !== 0
                ? (
                    parseFloat(creatorStates.shareSellPrice) *
                    creatorStates.ethPrice
                  ).toFixed(4)
                : "0.0"}{" "}
              <span className='eth'>
                ({" "}
                {creatorStates.shareSellPrice &&
                parseFloat(creatorStates.shareSellPrice) !== 0
                  ? parseFloat(creatorStates.shareSellPrice).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency})
              </span>
            </div>
            <div className='input-wrapper'>
              <input
                type='number'
                className='input'
                value={value}
                onChange={e => setValue(e.target.value)}
              />
              <div
                className='max'
                onClick={() => setValue(creatorStates.userShareBalance ?? "")}
              >
                Max
              </div>
            </div>
            <div className='sell-wrapper'>
              <div className='sell-info'>
                <div className='price'>
                  ${" "}
                  {creatorStates.ethPrice && price && parseFloat(price) !== 0
                    ? (parseFloat(price) * creatorStates.ethPrice).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {price && parseFloat(price) !== 0
                    ? parseFloat(price).toFixed(8)
                    : "0.0"}{" "}
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
