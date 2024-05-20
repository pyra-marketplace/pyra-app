import React, { useEffect, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, TradeWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  buyShares,
  loadCreatorShareInfos,
  loadShareBuyPrice,
  loadShareSellPrice,
  sellShares,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { betterErrorPrompt, uuid } from "@/utils";

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
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress, pkh } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    setOption(defaultOption);
    setValue("");
    setPrice("");
  }, [defaultOption, visible]);

  useEffect(() => {
    setValue("");
    setPrice("");
  }, [option]);

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
      ).unwrap();
      if (res) {
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
      betterErrorPrompt(e);
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
      ).unwrap();
      if (res) {
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
      betterErrorPrompt(e);
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
        ) : (
          <TradeWrapper>
            <div className='option-container'>
              <div className='option-wrapper'>
                <div
                  className='option'
                  style={{
                    ...(option === 1 && {
                      background: "#F6F6F6",
                      color: "#000",
                    }),
                  }}
                  onClick={() => setOption(1)}
                >
                  Buy
                </div>
                <div
                  className='option'
                  style={{
                    ...(option === 2 && {
                      background: "#F6F6F6",
                      color: "#000",
                    }),
                  }}
                  onClick={() => setOption(2)}
                >
                  Sell
                </div>
              </div>
            </div>
            <div className='title-wrapper'>
              <div className='title'>You own</div>
              <div className='value'>
                {creatorStates.userShareBalance || "0.0"}{" "}
              </div>
            </div>
            <div className='title'>
              Quantities to {option === 1 ? "buy" : "sell"}
            </div>
            <div className='input-wrapper'>
              <input
                type='number'
                className='input'
                value={value}
                placeholder='Set custom amount'
                onChange={onInput}
              />
              {option === 2 && (
                <div
                  className='max'
                  onClick={() => setValue(creatorStates.userShareBalance ?? "")}
                >
                  Max
                </div>
              )}
            </div>
            <div className={option === 1 ? "buy-wrapper" : "sell-wrapper"}>
              <div className={option === 1 ? "buy-info" : "sell-info"}>
                <div className='price'>
                  ${" "}
                  {globalStates.ethPrice && price && parseFloat(price) !== 0
                    ? (parseFloat(price) * globalStates.ethPrice).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {price && parseFloat(price) !== 0
                    ? parseFloat(price).toFixed(8)
                    : "0.0"}{" "}
                  {globalStates.chainCurrency}
                </div>
              </div>
              <div
                className={option === 1 ? "buy-button" : "sell-button"}
                onClick={() => {
                  if (option === 1) {
                    buy();
                  } else {
                    sell();
                  }
                }}
              >
                {option === 1
                  ? buying
                    ? "Buying..."
                    : "Buy"
                  : selling
                    ? "Selling..."
                    : "Sell"}
              </div>
            </div>
            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                Cancel
              </div>
            </div>
          </TradeWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
