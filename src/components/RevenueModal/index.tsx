import React, { useEffect, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, StakeWrapper } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  loadCreatorShareInfos,
  loadShareSellPrice,
  stake,
  unstake,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { betterErrorPrompt, uuid } from "@/utils";

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
    setValue("");
  }, [defaultOption]);

  useEffect(() => {
    setValue("");
  }, [visible]);

  useEffect(() => {
    if (value) {
      if (parseFloat(value) < 0) {
        setValue("");
        return;
      }

      if (!creatorStates.userShareBalance) {
        return;
      }

      if (parseFloat(value) > parseFloat(creatorStates.userShareBalance)) {
        setValue(creatorStates.userShareBalance);
        return;
      }
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
      await dispatch(
        stake({
          chainId: globalStates.chainId,
          shareAddress: creatorStates.shareAddress,
          revenuePoolAddress: creatorStates.revenuePoolAddress,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      ).unwrap();
      message.success("Stake successfully");
      dispatch(
        loadCreatorShareInfos({
          chainId: globalStates.chainId,
          address: (address || userAddress)!,
          userAddress,
          connector,
        }),
      );
    } catch (e: any) {
      betterErrorPrompt(e);
    }
    setStaking(false);
    return;
  };

  const handleUnstake = async () => {
    try {
      if (!creatorStates.revenuePoolAddress || !creatorStates.shareAddress) {
        return;
      }
      setUnstaking(true);
      await dispatch(
        unstake({
          chainId: globalStates.chainId,
          revenuePoolAddress: creatorStates.revenuePoolAddress,
          connector,
          amount: ethers.utils.parseEther(value),
        }),
      ).unwrap();
      message.success("Unstake successfully");
      dispatch(
        loadCreatorShareInfos({
          chainId: globalStates.chainId,
          address: (address || userAddress)!,
          userAddress,
          connector,
        }),
      );
    } catch (e: any) {
      betterErrorPrompt(e);
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
        ) : (
          <StakeWrapper>
            <div className='option'>
              {option === 1 ? "Stake" : "Unstake"} shares
            </div>
            <div className='tip'>
              {option === 1
                ? "Stake shares and receive revenue while staking."
                : "Request staked share withdrawal."}
            </div>
            {option === 1 && (
              <div className='title-wrapper'>
                <div className='title'>Available to stake</div>
                <div className='value'>
                  {creatorStates.userShareBalance &&
                  parseFloat(creatorStates.userShareBalance) !== 0
                    ? parseFloat(creatorStates.userShareBalance).toFixed(8)
                    : "0.0"}
                </div>
              </div>
            )}
            <div className='title-wrapper'>
              <div className='title'>Staked amount</div>
              <div className='value'>
                {creatorStates.userShareHolder?.staked_amount ?? "0.0"}
              </div>
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
            <div className={option === 1 ? "stake-wrapper" : "unstake-wrapper"}>
              <div
                className={option === 1 ? "stake-button" : "unstake-button"}
                onClick={() => {
                  if (option === 1) {
                    handleStake();
                  } else {
                    handleUnstake();
                  }
                }}
              >
                {option === 1
                  ? staking
                    ? "Staking..."
                    : "stake"
                  : unstaking
                    ? "Unstaking..."
                    : "unstake"}
              </div>
            </div>
            {option === 1 && (
              <div
                className='tip'
                style={{ color: "#FE5C02", marginBottom: 0 }}
              >
                · You can unstake and get shares returned anytime.
              </div>
            )}
            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                cancel
              </div>
            </div>
          </StakeWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
