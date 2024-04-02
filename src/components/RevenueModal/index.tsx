import React, { useEffect, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, StakeWrapper, UnstakeWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  loadCreatorShareInfos,
  loadShareSellPrice,
  stake,
  unstake,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { uuid } from "@/utils";

export interface RevenueModalProps {
  option: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const RevenueModal = ({
  option: defaultOption,
  visible,
  setVisible,
}: RevenueModalProps) => {
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [staking, setStaking] = useState(false);
  const [unstaking, setUnstaking] = useState(false);
  const [option, setOption] = useState(defaultOption);
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress, pkh } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    setOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    setValue("");
    setPrice("");
  }, [visible]);

  useEffect(() => {
    if (value) {
      if (parseFloat(value) < 0) {
        setValue("");
        return;
      }

      if (!creatorStates.userShareBalance) {
        creatorStates.userShareBalance = "10000";
      }

      if (parseFloat(value) > parseFloat(creatorStates.userShareBalance)) {
        setValue(creatorStates.userShareBalance);
        return;
      }

      dispatch(
        loadShareSellPrice({
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

  const cancel = () => {
    if (defaultOption !== 0) {
      setVisible(false);
    } else {
      setOption(0);
    }
  };

  const onInput = async (e: { target: { value: any } }) => {
    const v = e.target.value;
    setValue(v);
  };

  const handleStake = async () => {
    setStaking(true);
    try {
      if (!creatorStates.revenuePoolAddress || !creatorStates.shareAddress) {
        return;
      }
      const res = await dispatch(
        stake({
          chainId: globalStates.chainId,
          shareAddress: creatorStates.shareAddress,
          revenuePoolAddress: creatorStates.revenuePoolAddress,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Stake successfully");
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
    setStaking(false);
    return;
  };

  const handleUnstake = async () => {
    setUnstaking(true);
    try {
      if (!creatorStates.revenuePoolAddress || !creatorStates.shareAddress) {
        return;
      }
      const res = await dispatch(
        unstake({
          chainId: globalStates.chainId,
          revenuePoolAddress: creatorStates.revenuePoolAddress,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Unstake successfully");
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
    setUnstaking(false);
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
            <div className='stake-button' onClick={() => setOption(1)}>
              Stake
            </div>
            <div className='unstake-button' onClick={() => setOption(2)}>
              Unstake
            </div>
          </OutWrapper>
        ) : option === 1 ? (
          <StakeWrapper>
            <div className='title'>You own</div>
            <div className='share-number'>
              {creatorStates.userShareBalance &&
              parseFloat(creatorStates.userShareBalance) !== 0
                ? parseFloat(creatorStates.userShareBalance).toFixed(8)
                : "0.0"}{" "}
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
                placeholder='Set custom amount'
                onChange={onInput}
              />
              <div
                className='max'
                onClick={() => setValue(creatorStates.userShareBalance ?? "")}
              >
                Max
              </div>
            </div>
            <div className='stake-wrapper'>
              <div className='stake-info'>
                <div className='price'>
                  ${" "}
                  {creatorStates.ethPrice && price && parseFloat(price) !== 0
                    ? (parseFloat(price) * creatorStates.ethPrice).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {price && parseFloat(price) !== 0
                    ? parseFloat(price).toFixed(8)
                    : "0.0"}
                  {globalStates.chainCurrency}
                </div>
              </div>
              <div className='stake-button' onClick={handleStake}>
                {staking ? "Staking..." : "stake"}
              </div>
            </div>

            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                cancel
              </div>
            </div>
          </StakeWrapper>
        ) : (
          <UnstakeWrapper>
            <div className='title'>You staked</div>
            <div className='share-number'>
              {creatorStates.userShareBalance &&
              parseFloat(creatorStates.userShareBalance) !== 0
                ? parseFloat(creatorStates.userShareBalance).toFixed(8)
                : "0.0"}{" "}
              <span className='unit'>shares</span>
            </div>
            <div className='share-price'>
              = $
              {creatorStates.ethPrice && price && parseFloat(price) !== 0
                ? (parseFloat(price) * creatorStates.ethPrice).toFixed(4)
                : "0.0"}{" "}
              <span className='eth'>
                (
                {price && parseFloat(price) !== 0
                  ? parseFloat(price).toFixed(8)
                  : "0.0"}
                {globalStates.chainCurrency})
              </span>
            </div>
            <div className='input-wrapper'>
              <input
                type='number'
                className='input'
                value={value}
                placeholder='Set custom amount'
                onChange={onInput}
              />
              <div
                className='max'
                onClick={() => setValue(creatorStates.userShareBalance ?? "")}
              >
                Max
              </div>
            </div>
            <div className='unstake-wrapper'>
              <div className='unstake-info'>
                <div className='price'>
                  ${" "}
                  {creatorStates.ethPrice && price && parseFloat(price) !== 0
                    ? (parseFloat(price) * creatorStates.ethPrice).toFixed(4)
                    : "0.0"}
                </div>
                <div className='eth'>
                  {price && parseFloat(price) !== 0
                    ? parseFloat(price).toFixed(8)
                    : "0.0"}
                  {globalStates.chainCurrency}
                </div>
              </div>
              <div className='unstake-button' onClick={handleUnstake}>
                {unstaking ? "Unstaking..." : "Unstake"}
              </div>
            </div>
            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                cancel
              </div>
            </div>
          </UnstakeWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
