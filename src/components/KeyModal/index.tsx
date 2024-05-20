import React, { useEffect, useRef, useState } from "react";

import { FullScreenModal, message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { PyraZoneTierkeyHolderRes } from "@pyra-marketplace/pyra-sdk";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

import { Wrapper, OutWrapper, BuyWrapper, ScrollableSection } from "./styled";

import closeImg from "@/assets/icons/close-btn.svg";
import {
  buyTierkey,
  loadClaimableRevenue,
  loadCreatorBaseInfos,
  loadTierkeyBalance,
  loadUserTierKeys,
  sellTierkey,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section } from "@/styled";
import { betterErrorPrompt, uuid } from "@/utils";

export interface KeyModalProps {
  option: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  currentTier: number;
  setCurrentTier: (tier: number) => void;
}

const ScrollSection = ({
  userTierKeys,
}: {
  userTierKeys?: PyraZoneTierkeyHolderRes[];
}) => {
  const trendingPyraMarkets = useSelector(
    state => state.home.trendingPyraMarkets,
  );
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [currentKeyId, setCurrentKeyId] = useState("");
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    if (userTierKeys) {
      setCurrentKeyId(userTierKeys[0]?.key_id);
    }
  }, [userTierKeys]);

  useEffect(() => {
    if (scrollSectionRef.current) {
      const handleScroll = () => {
        if (scrollSectionRef.current) {
          setHideLeftArrow(scrollSectionRef.current.scrollLeft === 0);
          setHideRightArrow(
            scrollSectionRef.current.scrollLeft >=
              scrollSectionRef.current.scrollWidth -
                scrollSectionRef.current.clientWidth -
                5,
          );
        }
      };
      scrollSectionRef.current.addEventListener("scroll", handleScroll);
      return () => {
        scrollSectionRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollSectionRef]);

  const handleScroll = (to: number) => {
    if (scrollSectionRef.current) {
      scrollSectionRef.current.scroll({
        left: scrollSectionRef.current.scrollLeft + to,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section padding='0 32px 0px' gap='32px'>
      <Section style={{ position: "absolute", left: 0, right: 0 }}>
        <ScrollableSection
          className='hideScrollbar'
          width='100%'
          gap='16px'
          flexDirection='row'
          ref={scrollSectionRef}
        >
          <div
            className='left-arrow-btn'
            onClick={() =>
              !hideLeftArrow &&
              handleScroll(
                -(
                  (scrollSectionRef.current?.clientWidth &&
                    (scrollSectionRef.current?.clientWidth * 2) / 3) ??
                  0
                ),
              )
            }
            data-hidden={hideLeftArrow}
          >
            <svg
              width='16'
              height='30'
              viewBox='0 0 16 30'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.5 27.4342L13.75 15L2.5 2.5658'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='square'
              />
            </svg>
          </div>
          <div
            className='right-arrow-btn'
            onClick={() =>
              !hideRightArrow &&
              handleScroll(
                (scrollSectionRef.current?.clientWidth &&
                  (scrollSectionRef.current?.clientWidth * 2) / 3) ??
                  0,
              )
            }
            data-hidden={hideRightArrow}
          >
            <svg
              width='16'
              height='30'
              viewBox='0 0 16 30'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.5 27.4342L13.75 15L2.5 2.5658'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='square'
              />
            </svg>
          </div>

          {userTierKeys?.map((item, index) => (
            <div
              key={item.key_id}
              className='key-box'
              style={{
                ...(currentKeyId === item.key_id && {
                  borderColor: "#fe5a0277",
                }),
              }}
              onClick={() => setCurrentKeyId(item.key_id)}
            >
              <div
                className='id'
                style={{
                  ...(currentKeyId === item.key_id && {
                    color: "#121212",
                  }),
                }}
              >
                Key #{item.key_id}
              </div>
              <div
                className='price'
                style={{
                  ...(currentKeyId === item.key_id && {
                    color: "#545454",
                  }),
                }}
              >
                {item.remaining_price && parseFloat(item.remaining_price) !== 0
                  ? parseFloat(item.remaining_price).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            </div>
          ))}
        </ScrollableSection>
      </Section>
    </Section>
  );
};

export const KeyModal = ({
  option: defaultOption,
  visible,
  setVisible,
  currentTier,
  setCurrentTier,
}: KeyModalProps) => {
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [tierkeyBalance, setTierkeyBalance] = useState("");
  const [userTierKeys, setUserTierKeys] =
    useState<PyraZoneTierkeyHolderRes[]>();
  const [option, setOption] = useState(defaultOption);
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress } = useStore();
  const creatorStates = useSelector(state => state.creator);

  useEffect(() => {
    setOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    setOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    if (!creatorStates.pyraZone?.asset_id) {
      return;
    }
    dispatch(
      loadTierkeyBalance({
        chainId: globalStates.chainId,
        assetId: creatorStates.pyraZone?.asset_id,
        userAddress: userAddress!,
        connector,
        tier: currentTier,
      }),
    ).then(res => {
      if (res.meta.requestStatus === "fulfilled") {
        setTierkeyBalance(res.payload as string);
      }
    });
    dispatch(
      loadUserTierKeys({
        chainId: globalStates.chainId,
        assetId: creatorStates.pyraZone?.asset_id,
        userAddress: userAddress!,
        tier: currentTier,
      }),
    ).then(res => {
      if (res.meta.requestStatus === "fulfilled") {
        setUserTierKeys(res.payload as PyraZoneTierkeyHolderRes[]);
      }
    });
  }, [currentTier]);

  useEffect(() => {
    if (creatorStates.userTierKeyBalance) {
      setTierkeyBalance(creatorStates.userTierKeyBalance);
    }
  }, [creatorStates.userTierKeyBalance]);

  useEffect(() => {
    if (creatorStates.userTierKeys) {
      setUserTierKeys(creatorStates.userTierKeys[0]);
    }
  }, [creatorStates.userTierKeys]);

  const cancel = () => {
    if (defaultOption !== 0) {
      setVisible(false);
    } else {
      setOption(0);
    }
  };

  const buy = async () => {
    try {
      if (!creatorStates.pyraZone?.asset_id) {
        return;
      }
      setBuying(true);
      const res = await dispatch(
        buyTierkey({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone.asset_id,
          connector,
          tier: currentTier,
        }),
      ).unwrap();
      if (res) {
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
        dispatch(
          loadTierkeyBalance({
            chainId: globalStates.chainId,
            assetId: creatorStates.pyraZone?.asset_id,
            userAddress: userAddress!,
            connector,
            tier: currentTier,
          }),
        ).then(res => {
          if (res.meta.requestStatus === "fulfilled") {
            setTierkeyBalance(res.payload as string);
          }
        });
      }
    } catch (e: any) {
      betterErrorPrompt(e);
    }
    setBuying(false);
    return;
  };

  const sell = async () => {
    try {
      if (!creatorStates.pyraZone?.asset_id) {
        return;
      }
      if (!userTierKeys || userTierKeys.length === 0) {
        message.info("You own 0 keys.");
        return;
      }
      setSelling(true);
      const res = await dispatch(
        sellTierkey({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone.asset_id,
          connector,
          keyId: userTierKeys[0].key_id,
          tier: currentTier,
        }),
      ).unwrap();
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
      dispatch(
        loadTierkeyBalance({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone?.asset_id,
          userAddress: userAddress!,
          connector,
          tier: currentTier,
        }),
      ).then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          setTierkeyBalance(res.payload as string);
        }
      });
    } catch (e: any) {
      betterErrorPrompt(e);
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
        ) : (
          <BuyWrapper>
            <div className='option-container'>
              <div className='option-wrapper'>
                {creatorStates.pyraZone?.tierkeys
                  .slice(0, 3)
                  ?.map((item, index) => (
                    <div
                      className='option'
                      key={index}
                      style={{
                        ...(currentTier === index && {
                          background: "#F6F6F6",
                          color: "#000",
                        }),
                      }}
                      onClick={() => setCurrentTier(index)}
                    >
                      Tier {index + 1}
                    </div>
                  ))}
              </div>
            </div>
            <div className='title-wrapper'>
              <div className='title'>You own</div>
              <div className='value'>{tierkeyBalance || "0.0"} </div>
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
            <div className='divider'>
              <div className='line'></div>
              <div className='text'>or</div>
              <div className='line'></div>
            </div>
            <div className='sell-wrapper'>
              <div
                className='key-wrapper'
                style={{
                  ...(userTierKeys?.length === 0 && { display: "none" }),
                }}
              >
                <ScrollSection userTierKeys={userTierKeys} />
              </div>
              <div className='sell-button' onClick={sell}>
                {selling ? "Selling..." : "Sell"}
              </div>
            </div>
            <div className='cancel-wrapper'>
              <div className='cancel' onClick={cancel}>
                Cancel
              </div>
            </div>
          </BuyWrapper>
        )}
      </Wrapper>
    </FullScreenModal>
  );
};
