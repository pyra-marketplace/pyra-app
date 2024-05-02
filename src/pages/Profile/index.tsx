import React, { useEffect, useState } from "react";

import { message } from "@meteor-web3/components";
import { useStore } from "@meteor-web3/hooks";
import { CircularProgress, Skeleton } from "@mui/material";
import { PyraMarketShareHolderPortfolioRes } from "@pyra-marketplace/pyra-sdk";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  BannerContainer,
  CreatorWrapper,
  GuidePageSection,
  PlainTabButton,
  PortfolioContainer,
  ShareCardSection,
  TwitterIcon,
} from "./styled";

import TwitterIconSvg from "@/assets/icons/twitter-icon.svg";
import DefaultAvatarPng from "@/assets/images/default-avatar.png";
import DefaultBannerPng from "@/assets/images/default-banner.png";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import InfiniteScrollList from "@/components/InfiniteScrollList";
import Selector from "@/components/Selector";
import { loadShareSellPrice } from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import {
  loadPyraMarketShareHolderPortfolios,
  loadPyraZoneTierkeyHolderPortfolios,
  profileSlice,
} from "@/state/profile/slice";
import { Divider, FlexRow, Section } from "@/styled";
import { getDefaultAvatar, stringAbbreviation } from "@/utils";

export const Profile: React.FC = () => {
  const tabs: Array<"Portfolio" | "Watchlist"> = ["Portfolio", "Watchlist"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [pyraMarketShareHoldersLoading, setPyraMarketShareHoldersLoading] =
    useState(true);
  const [pyraZoneTierkeyHoldersLoading, setPyraZoneTierkeyHoldersLoading] =
    useState(true);
  const [isGuidePage, setIsGuidePage] = useState(false);
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const { connector, address: userAddress, pkh } = useStore();
  const profile = useSelector(state => state.profile);
  const loc = useLocation();

  useEffect(() => {
    console.log({ profile });
  }, [profile]);

  useEffect(() => {
    creatorStates.userShareBalance &&
      (address || userAddress) &&
      dispatch(
        loadShareSellPrice({
          chainId: globalStates.chainId,
          address: (address || userAddress)!,
          connector,
          amount: creatorStates.userShareBalance,
        }),
      );
  }, [creatorStates.userShareBalance]);

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    initPyraMarketShareHolders(profile.pyraMarketSortBy);
  }, [userAddress, globalStates.autoConnecting, profile.pyraMarketSortBy]);

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    initPyraZoneTierkeyHolders(profile.pyraZoneSortBy);
  }, [userAddress, globalStates.autoConnecting, profile.pyraZoneSortBy]);

  const initPyraMarketShareHolders = async (
    sortBy: "shares_price" | "update_at",
  ) => {
    if (!userAddress) {
      navigate("/");
      return;
    }
    setPyraMarketShareHoldersLoading(true);
    try {
      const baseInfos = await dispatch(
        loadPyraMarketShareHolderPortfolios({
          chainId: globalStates.chainId,
          userAddress,
          orderBy: sortBy,
          orderType: "desc",
        }),
      ).unwrap();
      console.log({ baseInfos });
    } catch (e: any) {
      console.error("Init failed: ", e);
      message.error(
        "Init Pyra market share holders failed: " +
          (e.reason || e.message || e).slice(0, 100),
      );
    } finally {
      setPyraMarketShareHoldersLoading(false);
    }
  };

  const initPyraZoneTierkeyHolders = async (
    sortBy: "tierkeys_price" | "update_at",
  ) => {
    if (!userAddress) {
      navigate("/");
      return;
    }
    setPyraZoneTierkeyHoldersLoading(true);
    try {
      const baseInfos = await dispatch(
        loadPyraZoneTierkeyHolderPortfolios({
          chainId: globalStates.chainId,
          userAddress,
          orderBy: sortBy,
          orderType: "desc",
        }),
      ).unwrap();
      console.log({ baseInfos });
    } catch (e: any) {
      console.error("Init failed: ", e);
      message.error(
        "Init Pyra zone tier key holders failed: " +
          (e.reason || e.message || e).slice(0, 100),
      );
    } finally {
      setPyraZoneTierkeyHoldersLoading(false);
    }
  };

  useEffect(() => {
    setIsGuidePage(false);
  }, [userAddress]);

  return (
    <CreatorWrapper>
      <BannerContainer>
        <img
          className='banner-img'
          src={
            creatorStates.pyraZone?.publisher_profile?.cover_image_url ||
            DefaultBannerPng
          }
        />
        <div className='banner-section'>
          <div className='user-base-info'>
            {creatorStates.userInfo ? (
              <img
                className='user-avatar'
                src={
                  creatorStates.userInfo?.twitter.profile_image_url ||
                  getDefaultAvatar(creatorStates.userInfo?.address) ||
                  DefaultAvatarPng
                }
              />
            ) : (
              <Skeleton
                className='user-avatar'
                variant='rounded'
                sx={{ bgcolor: "grey.400" }}
              />
            )}
            <FlexRow gap='12px'>
              {creatorStates.userInfo ? (
                <>
                  <p className='title-text'>
                    {creatorStates.pyraZone?.publisher_profile?.nick_name ||
                      creatorStates.pyraZone?.publisher_profile?.user_info
                        ?.name ||
                      stringAbbreviation(
                        creatorStates.pyraZone?.publisher,
                        4,
                        4,
                      )}
                  </p>
                  <TwitterIcon
                    onClick={() => {
                      window.open(
                        `https://twitter.com/${creatorStates.userInfo?.twitter.username}`,
                        "_blank",
                      );
                    }}
                  >
                    <img src={TwitterIconSvg} />
                  </TwitterIcon>
                </>
              ) : (
                <Skeleton
                  className='title-text'
                  width='100px'
                  sx={{ bgcolor: "grey.400" }}
                />
              )}
            </FlexRow>
            <p className='desc-text'>
              {address || userAddress ? (
                stringAbbreviation(address || userAddress, 4, 4)
              ) : (
                <Skeleton
                  className='desc-text'
                  width='100px'
                  sx={{ bgcolor: "grey.400" }}
                />
              )}
            </p>
          </div>
        </div>
      </BannerContainer>
      {!isGuidePage && (
        <>
          <FlexRow
            width='100%'
            alignItems='center'
            justifyContent='space-between'
            padding='26px 32px'
          >
            <FlexRow flex='0 0 auto' gap='9px'>
              {tabs.map((tab, idx) => (
                <PlainTabButton
                  key={idx}
                  data-active={tab === selectedTab}
                  onClick={() => {
                    if (idx === 1) {
                      return;
                    }
                    setSelectedTab(tab);
                  }}
                  style={{ color: idx === 1 ? "#ccc" : "#545454" }}
                >
                  {tab}
                </PlainTabButton>
              ))}
            </FlexRow>
          </FlexRow>
          <Section width='100%' padding='0px 32px' gap='24px'>
            <Divider width='100%' border='1px solid #E2E2E2' />
          </Section>
          {
            <>
              {selectedTab === tabs[0] ? (
                <PortfolioSection
                  loading={
                    pyraMarketShareHoldersLoading ||
                    pyraZoneTierkeyHoldersLoading
                  }
                />
              ) : null}
            </>
          }
        </>
      )}
      {/* {(pyraMarketShareHoldersLoading || pyraZoneTierkeyHoldersLoading) && (
        <GuidePageSection
          width='100%'
          alignItems='center'
          justifyContent='center'
          padding='24px'
        >
          <FlexRow width='100%' gap='24px' justifyContent='center'>
            <p style={{ fontSize: "24px" }}>Loading...</p>
            <CircularProgress />
          </FlexRow>
        </GuidePageSection>
      )} */}
    </CreatorWrapper>
  );
};

const PortfolioSection = ({ loading }: { loading?: boolean }) => {
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const profile = useSelector(state => state.profile);

  return (
    <Section width='100%' padding='32px' gap='36px'>
      <PortfolioContainer>
        <div className='info-wrapper'>
          <div className='info-container'>
            <div className='title'>Key value</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                $
                {globalStates.ethPrice &&
                profile.keyValue &&
                parseFloat(profile.keyValue) !== 0
                  ? (
                      parseFloat(profile.keyValue) * globalStates.ethPrice
                    ).toFixed(4)
                  : "0.0"}{" "}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>
                {profile.keyValue && parseFloat(profile.keyValue) !== 0
                  ? parseFloat(profile.keyValue).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            )}
          </div>
          <div className='info-container'>
            <div className='title'>Share value</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                $
                {globalStates.ethPrice &&
                profile.shareValue &&
                parseFloat(profile.shareValue) !== 0
                  ? (
                      parseFloat(profile.shareValue) * globalStates.ethPrice
                    ).toFixed(4)
                  : "0.0"}{" "}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>
                {profile.shareValue && parseFloat(profile.shareValue) !== 0
                  ? parseFloat(profile.shareValue).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            )}
          </div>
          <div className='info-container'>
            <div className='title'>Total revenue</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                $
                {globalStates.ethPrice &&
                profile.totalRevenue &&
                parseFloat(profile.totalRevenue) !== 0
                  ? (
                      parseFloat(profile.totalRevenue) * globalStates.ethPrice
                    ).toFixed(4)
                  : "0.0"}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>
                {profile.totalRevenue && parseFloat(profile.totalRevenue) !== 0
                  ? parseFloat(profile.totalRevenue).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            )}
          </div>
        </div>
        <div className='list-container'>
          <ListSection />
        </div>
      </PortfolioContainer>
    </Section>
  );
};

const ListSection = () => {
  const navigate = useNavigate();
  const globalStates = useSelector(state => state.global);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const defaultPageSize = 10;

  return (
    <Section width='100%'>
      <FlexRow width='100%' gap='20px' alignItems='flex-start'>
        <ShareCardSection>
          <div className='tool-wrapper'>
            <p className='title-text'>Shares</p>
            <Selector
              options={["Price high to low", "Recently"]}
              defaultSelectedItem
              onChange={item => {
                if (
                  (profile.pyraMarketSortBy === "shares_price" &&
                    item === "Price high to low") ||
                  (profile.pyraMarketSortBy === "update_at" &&
                    item === "Recently")
                ) {
                  return;
                }
                dispatch(
                  profileSlice.actions.setPyraMarketSortBy(
                    item === "Price high to low" ? "shares_price" : "update_at",
                  ),
                );
              }}
            />
          </div>
          <div className='list-section'>
            <InfiniteScroll
              forceLoading={!profile.pyraMarketShareHolders}
              defaultData={profile.pyraMarketShareHolders?.slice(
                0,
                defaultPageSize,
              )}
              loadMore={async page => {
                const res = profile.pyraMarketShareHolders?.slice(
                  defaultPageSize * (page - 1),
                  defaultPageSize * (page - 1) + defaultPageSize,
                );
                return res || [];
              }}
              placeHolder={[...new Array(5)].map((_, idx) => (
                <div key={idx} className='item'>
                  <div className='creator-info'>
                    <Skeleton variant='rounded' className='avatar' />
                    <Skeleton className='user-name' width={100} />
                  </div>
                  <div className='amount'>
                    <Skeleton width={100} />
                  </div>
                  <div className='price'>
                    <Skeleton width={150} />
                  </div>
                </div>
              ))}
              renderItem={({ dataItem: holder, idx }) => (
                <div key={idx} className='item'>
                  <div className='creator-info'>
                    <div
                      className='avatar'
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/creator/" + holder.publisher)}
                    >
                      <img
                        src={
                          holder.publisher_profile?.user_info
                            ?.profile_image_url ||
                          getDefaultAvatar(holder.publisher)
                        }
                      />
                    </div>
                    <div
                      className='user-name'
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/creator/" + holder.publisher)}
                    >
                      {holder.publisher_profile?.user_info?.name ||
                        stringAbbreviation(holder.publisher, 4, 4)}
                    </div>
                  </div>
                  <div className='amount'>
                    <span>{holder.shares_amount ?? "0.0"}</span>
                  </div>
                  <div className='price'>
                    <span>
                      {holder.shares_price &&
                      parseFloat(holder.shares_price) !== 0
                        ? parseFloat(holder.shares_price).toFixed(8)
                        : "0.0"}{" "}
                      {globalStates.chainCurrency}
                    </span>
                  </div>
                </div>
              )}
            />
          </div>
        </ShareCardSection>
        <ShareCardSection>
          <div className='tool-wrapper'>
            <p className='title-text'>Keys</p>
            <Selector
              options={["Price high to low", "Recently"]}
              defaultSelectedItem
              onChange={item => {
                if (
                  (profile.pyraZoneSortBy === "tierkeys_price" &&
                    item === "Price high to low") ||
                  (profile.pyraZoneSortBy === "update_at" &&
                    item === "Recently")
                ) {
                  return;
                }
                dispatch(
                  profileSlice.actions.setPyraZoneSortBy(
                    item === "Price high to low"
                      ? "tierkeys_price"
                      : "update_at",
                  ),
                );
              }}
            />
          </div>
          <div className='list-section'>
            <InfiniteScroll
              forceLoading={!profile.pyraZoneTierkeyHolders}
              defaultData={profile.pyraZoneTierkeyHolders?.slice(
                0,
                defaultPageSize,
              )}
              loadMore={async page => {
                const res = profile.pyraZoneTierkeyHolders?.slice(
                  defaultPageSize * (page - 1),
                  defaultPageSize * (page - 1) + defaultPageSize,
                );
                return res || [];
              }}
              placeHolder={[...new Array(5)].map((_, idx) => (
                <div key={idx} className='item'>
                  <div className='creator-info'>
                    <Skeleton variant='rounded' className='avatar' />
                    <Skeleton className='user-name' width={100} />
                  </div>
                  <div className='amount'>
                    <Skeleton width={100} />
                  </div>
                  <div className='price'>
                    <Skeleton width={150} />
                  </div>
                </div>
              ))}
              renderItem={({ dataItem: holder, idx }) => (
                <div key={idx} className='item'>
                  <div className='creator-info'>
                    <div
                      className='avatar'
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          "/creator/" + holder.publisher_profile?.publisher,
                        )
                      }
                    >
                      <img
                        src={
                          holder.publisher_profile?.user_info
                            ?.profile_image_url ||
                          getDefaultAvatar(holder.publisher_profile?.publisher)
                        }
                      />
                    </div>
                    <div
                      className='user-name'
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          "/creator/" +
                            holder.publisher_profile?.user_info?.name,
                        )
                      }
                    >
                      {holder.publisher_profile?.user_info?.name ||
                        stringAbbreviation(
                          holder.publisher_profile?.publisher,
                          4,
                          4,
                        )}
                    </div>
                  </div>
                  <div className='amount'>
                    <span>{holder.tierkeys_count ?? "0"}</span>
                  </div>
                  <div className='price'>
                    <span>
                      {holder.tierkeys_price &&
                      parseFloat(holder.tierkeys_price) !== 0
                        ? parseFloat(holder.tierkeys_price).toFixed(8)
                        : "0.0"}{" "}
                      {globalStates.chainCurrency}
                    </span>
                  </div>
                </div>
              )}
            />
          </div>
        </ShareCardSection>
      </FlexRow>
    </Section>
  );
};
