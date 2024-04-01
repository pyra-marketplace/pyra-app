import React, { useEffect, useRef, useState } from "react";

import { Media, message } from "@meteor-web3/components";
import { MirrorFile } from "@meteor-web3/connector";
import { useStore } from "@meteor-web3/hooks";
import {
  AvatarGroup,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  DialogActions,
  Button,
} from "@mui/material";
import { PyraZone, PyraZoneRes } from "@pyra-marketplace/pyra-sdk";
import { Auth as TwitterAuth } from "@pyra-marketplace/pyra-sdk";
import { ethers } from "ethers";
import { useNavigate, useParams } from "react-router-dom";

import {
  BannerContainer,
  BlackButton,
  ContentInfoContainer,
  ContentSectionWrap,
  CreatorWrapper,
  DateSortedSectionWrap,
  EmptySectionWrap,
  FilesContentSectionWrap,
  FinderContainer,
  GuidePageSection,
  LockedSectionWrap,
  MainContentContainer,
  PlainButton,
  PlainTabButton,
  PopupButtonWrap,
  TopBarContainer,
} from "./styled";

import BrowserIconSvg from "@/assets/icons/browser-icon.svg";
import CopyIconSvg from "@/assets/icons/copy.svg";
import DoubleDownArrowIconSvg from "@/assets/icons/double-down-arrow.svg";
import DownArrowIconSvg from "@/assets/icons/down-arrow.svg";
import EditIconSvg from "@/assets/icons/edit.svg";
import EmptySectionIconSvg from "@/assets/icons/empty-section.svg";
import LoadingWhiteIconSvg from "@/assets/icons/loading-white.svg";
import MoreIconSvg from "@/assets/icons/more-icon.svg";
import SearchIconSvg from "@/assets/icons/search.svg";
import SortIconSvg from "@/assets/icons/sort.svg";
import TopbarFilterIconSvg from "@/assets/icons/topbar-filter.svg";
import TopbarFlowIconSvg from "@/assets/icons/topbar-flow.svg";
import TopbarGridIconSvg from "@/assets/icons/topbar-grid.svg";
import TopbarListIconSvg from "@/assets/icons/topbar-list.svg";
import TopbarWindowIconSvg from "@/assets/icons/topbar-window.svg";
import TwitterIconSvg from "@/assets/icons/twitter-icon.svg";
import DefaultAvatarPng from "@/assets/images/default-avatar.png";
import DefaultBannerPng from "@/assets/images/default-banner.png";
import { FileInfoModal } from "@/components/FileInfoModal";
import { ShareModal } from "@/components/ShareModal";
import { TabButtons } from "@/components/TabButtons";
import {
  createPryaZone,
  createShare,
  creatorSlice,
  loadCreatorBaseInfos,
  loadCreatorContents,
  loadCreatorShareInfos,
  loadCreatorUserInfo,
  loadPyraZone,
  unlockCreatorContents,
} from "@/state/createor/slice";
import { globalSlice } from "@/state/global/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Divider, FlexRow, GridWrap, Section } from "@/styled";
import {
  buildSortedItems,
  getCurrencyNameByCurrencyAddress,
  stringAbbreviation,
  stringToColor,
} from "@/utils";

export const NewCreator: React.FC = () => {
  const tabs: Array<"Share" | "Content"> = ["Share", "Content"];
  const [selectedTab, setSelectedTab] = useState(tabs[1]);
  const [tradeKeyLoading, setTradeKeyLoading] = useState(false);
  const [creatingPyraZone, setCreatingPyraZone] = useState(false);
  const [isGuidePage, setIsGuidePage] = useState(false);
  const [emptyPyraZone, setEmptyPyraZone] = useState(false);
  const [emptyPyraMarket, setEmptyPyraMarket] = useState(false);
  const [emptyProfile, setEmptyProfile] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const { connector, address: userAddress, pkh } = useStore();
  const fileRecord = useSelector(state => state.creator.contentFiles);
  const files = Object.values(fileRecord || {});
  const contentAccessible = useSelector(
    state => state.creator.contentAccessible,
  );
  const userInfo = useSelector(state => state.global.userInfo);

  useEffect(() => {
    dispatch(creatorSlice.actions.clearAllInfos());
  }, []);

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    init();
  }, [address, userAddress, globalStates.autoConnecting]);

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    contentInit();
  }, [
    selectedTab,
    creatorStates.pyraZone,
    address,
    userAddress,
    globalStates.autoConnecting,
  ]);

  const init = async () => {
    // if ((await connector.getCurrentWallet()) === undefined) {
    //   navigate("/");
    //   return;
    // }
    if (!address && !userAddress) {
      navigate("/");
      return;
    }
    try {
      const _address = address || userAddress!;
      let pyraZone: PyraZoneRes;
      if (_address === userAddress) {
        dispatch(creatorSlice.actions.setContentAccessible(true));
        if (globalStates.userInfo) {
          dispatch(creatorSlice.actions.setUserInfo(globalStates.userInfo));
        } else {
          dispatch(loadCreatorUserInfo({ address: _address }));
        }
        const { pyraZone: _pyraZone, pyraMarket: _pyraMarket } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: _address,
          }),
        ).unwrap();
        pyraZone = _pyraZone;
        // if (!pyraZone) {
        //   // create pyra zone
        //   setCreatingPyraZone(true);
        //   try {
        //     if (
        //       !(await dispatch(
        //         createPryaZone({
        //           chainId: globalStates.chainId,
        //           address: _address,
        //           connector,
        //         }),
        //       ).unwrap())
        //     ) {
        //       throw new Error("failed to create");
        //     }
        //     pyraZone = (
        //       await dispatch(
        //         loadPyraZone({
        //           chainId: globalStates.chainId,
        //           address: _address,
        //         }),
        //       ).unwrap()
        //     ).pyraZone;
        //   } catch (e: any) {
        //     console.error("Create pyra zone failed: ", e);
        //     message.error("Create pyra zone failed: " + (e.reason || e.message || e));
        //     return;
        //   }
        //   setCreatingPyraZone(false);
        // }
        if (!_pyraMarket) {
          setEmptyPyraMarket(true);
        } else {
          setEmptyPyraMarket(false);
        }
        if (!_pyraZone) {
          setEmptyPyraZone(true);
        } else {
          setEmptyPyraZone(false);
        }
        if (!_pyraZone || !_pyraMarket) {
          message.info("You need to create your pyra zone first.");
          setIsGuidePage(true);
          return;
        }
      } else {
        dispatch(loadCreatorUserInfo({ address: _address }));
        pyraZone = (
          await dispatch(
            loadPyraZone({
              chainId: globalStates.chainId,
              address: _address,
            }),
          ).unwrap()
        ).pyraZone;
        if (!pyraZone) {
          message.error("Wrong address or empty pyra zone.");
          setEmptyPyraZone(true);
          return;
        }
      }
      console.log({ pyraZone });
      setEmptyPyraZone(false);
      const baseInfos = await dispatch(
        loadCreatorBaseInfos({
          chainId: globalStates.chainId,
          address: _address,
          assetId: pyraZone.asset_id,
          connector,
        }),
      ).unwrap();
      console.log({ baseInfos });
    } catch (e: any) {
      console.error("Init failed: ", e);
      message.error("Init failed: " + (e.reason || e.message || e));
    }
  };

  const contentInit = async () => {
    if (!address && !userAddress) {
      navigate("/");
      return;
    }
    try {
      const _address = address || userAddress!;
      if (selectedTab === "Content") {
        if (!creatorStates.pyraZone) return;
        const contentInfo = await dispatch(
          loadCreatorContents({
            chainId: globalStates.chainId,
            assetId: creatorStates.pyraZone.asset_id,
            accountAddress: userAddress,
            connector,
          }),
        ).unwrap();
        console.log({
          args: {
            chainId: globalStates.chainId,
            assetId: creatorStates.pyraZone.asset_id,
            accountAddress: userAddress,
            connector,
          },
          contentInfo,
        });
        if (_address !== userAddress && contentInfo.isAccessible) {
          // try to unlock content folder
          try {
            const { unlockedFolder } = await dispatch(
              unlockCreatorContents({
                chainId: globalStates.chainId,
                assetId: creatorStates.pyraZone.asset_id,
                connector,
              }),
            ).unwrap();
            console.log({ unlockedFolder });
          } catch (e: any) {
            console.warn("unlock folder failed: ", e);
          }
        }
      } else {
        await dispatch(
          loadCreatorShareInfos({
            chainId: globalStates.chainId,
            address: _address,
            connector,
          }),
        )
          .unwrap()
          .then(console.log);
      }
    } catch (e: any) {
      console.error("Content init failed: ", e);
      message.error("Content init failed: " + (e.reason || e.message || e));
    }
  };

  const handleBindTwitter = async () => {
    setAuthenticating(true);
    const { url } = await TwitterAuth.login({
      connector,
      redirectUrl: location.href,
    });
    location.replace(url);
  };

  const handleAuth = async () => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (address && code && state) {
      setAuthenticating(true);
      try {
        const userInfo = await TwitterAuth.bind({
          code,
          state,
        });
        console.log({ userInfo });
        const uri = new URL(window.location.href);
        uri.searchParams.delete("code");
        uri.searchParams.delete("state");
        window.history.pushState({}, "", uri);
        dispatch(
          globalSlice.actions.setUserInfo({
            address: address!,
            did: pkh!,
            twitter: userInfo,
          }),
        );
        message.success("Bing twitter successfully.");
      } catch (e: any) {
        console.warn(e);
        message.error("Bind twitter failed, please try again.");
      }
      setAuthenticating(false);
      return;
    }
  };

  const loadUserInfo = async () => {
    const _address = address || userAddress!;
    if (_address && _address === userAddress) {
      try {
        const userInfo = await TwitterAuth.info({
          address: _address,
        });
        dispatch(globalSlice.actions.setUserInfo(userInfo));
        console.log({ userInfo });
      } catch (e: any) {
        dispatch(globalSlice.actions.setUserInfo(undefined));
        setIsGuidePage(true);
        console.warn(e);
      }
    }
  };

  useEffect(() => {
    setIsGuidePage(false);
    loadUserInfo();
  }, [address, userAddress]);

  const handleCreateShare = async () => {
    try {
      const res = await dispatch(
        createShare({ chainId: globalStates.chainId, connector }),
      ).unwrap();
      if (res) {
        message.success("Create share successfully.");
        setEmptyPyraMarket(false);
      }
    } catch (e: any) {
      console.warn("Create share failed: ", e);
      message.error("Create share failed: " + (e.reason || e.message || e));
    }
  };

  const handleCreatePyraZone = async () => {
    try {
      const res = await dispatch(
        createPryaZone({
          chainId: globalStates.chainId,
          address: userAddress!,
          connector,
        }),
      ).unwrap();
      if (res) {
        message.success("Create pyra zone successfully.");
        setEmptyPyraZone(false);
      }
    } catch (e: any) {
      console.warn("Create pyra zone failed: ", e);
      message.error("Create pyra zone failed: " + (e.reason || e.message || e));
    }
  };

  useEffect(() => {
    handleAuth();
  }, [address]);

  return (
    <CreatorWrapper>
      <BannerContainer>
        <img className='banner-img' src={DefaultBannerPng} />
        <div className='banner-section'>
          <div className='user-base-info'>
            <img
              className='user-avatar'
              src={
                creatorStates.userInfo?.twitter.profile_image_url ||
                DefaultAvatarPng
              }
            />
            <p className='title-text'>
              {creatorStates.userInfo?.twitter.name ||
                stringAbbreviation(creatorStates.pyraZone?.publisher, 4, 4)}
            </p>
            <p className='desc-text'>
              {(address || userAddress) &&
                stringAbbreviation(address || userAddress, 4, 4)}
            </p>
          </div>
          <div className='user-extra-info'>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>
                {ethers.utils.formatEther(
                  creatorStates.pyraMarket?.total_volume || 0,
                )}
              </p>
              <p className='desc-text'>Total volume</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>
                ${ethers.utils.formatEther(creatorStates.tierKeyBuyPrice || 0)}
              </p>
              <p className='desc-text'>Share value</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>
                {creatorStates.shareHolders?.length || 0}
              </p>
              <p className='desc-text'>Share holders</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>
                {ethers.utils.formatEther(creatorStates.tierKeyBuyPrice || 0)}{" "}
                {globalStates.chainCurrency}
              </p>
              <p className='desc-text'>Key price</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>
                {creatorStates.pyraZone?.tierkey_sales || 0}
              </p>
              <p className='desc-text'>Key sales</p>
            </div>
          </div>
        </div>
      </BannerContainer>
      {!isGuidePage && (
        <>
          <FlexRow
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            padding='26px 32px'
          >
            <ContentInfoContainer>
              {/* <p className='content-desc'>
                Lil Pudgys is a collection of 22,222 NFTs originating from Pudgy
                ...
              </p> */}
              <p className='item-desc'>
                {[
                  {
                    title: "Items",
                    data: creatorStates.pyraZone?.files_count,
                  },
                  {
                    title: "Created",
                    data: creatorStates.pyraZone?.publish_at
                      ? new Date(
                          Number(creatorStates.pyraZone.publish_at) * 1000,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "--",
                  },
                  // {
                  //   title: "Creator earnings",
                  //   data: "5%",
                  // },
                  {
                    title: "Chain",
                    data: globalStates.chainName,
                  },
                ].map((item, idx) => {
                  return (
                    <>
                      {idx !== 0 && <span>{"  ·  "}</span>}
                      <span>{item.title}</span>{" "}
                      <span className='bold'>{item.data}</span>
                    </>
                  );
                })}
              </p>
            </ContentInfoContainer>
            <FlexRow gap='21px' flex='0 0 auto'>
              <img src={BrowserIconSvg} style={{ cursor: "pointer" }} />
              <img src={TwitterIconSvg} style={{ cursor: "pointer" }} />
              <img src={MoreIconSvg} style={{ cursor: "pointer" }} />
            </FlexRow>
          </FlexRow>
          <Section width='100%' padding='10px 32px' gap='24px'>
            <FlexRow width='100%' gap='9px'>
              {["Items", "Offers", "Analytics", "Activity"].map((tab, idx) => (
                <PlainTabButton key={idx} data-active={idx === 0}>
                  {tab}
                </PlainTabButton>
              ))}
            </FlexRow>
            <Divider width='100%' border='1px solid #E2E2E2' />
          </Section>
          <Section width='100%' padding='12px 32px' gap='36px'>
            <TopBarContainer width='100%' gap='12px'>
              <PlainButton>
                <img src={TopbarFilterIconSvg} />
              </PlainButton>
              <FlexRow className='live-prompt' flex='0 0 auto'>
                <span className='bold-text'>Live</span>
              </FlexRow>
              <FlexRow className='normal-text' padding='0 12px' flex='0 0 auto'>
                {creatorStates.pyraZone?.files_count} results
              </FlexRow>
              <FlexRow className='search'>
                <img src={SearchIconSvg} width={20} height={20} />
                <input
                  className='search-input'
                  placeholder='Search by name or trait'
                />
              </FlexRow>
              <FlexRow className='selector' flex='0 0 auto'>
                <span className='bold-text'>Price low to high</span>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_3246_927)'>
                    <path
                      d='M13 7L8 12L3 7'
                      stroke='#121212'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_3246_927'>
                      <rect width='16' height='16' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </FlexRow>
              <TabButtons
                small
                tabs={[
                  TopbarListIconSvg,
                  TopbarGridIconSvg,
                  TopbarWindowIconSvg,
                  TopbarFlowIconSvg,
                ].map((icon, idx) => (
                  <img key={idx} src={icon} />
                ))}
                defaultSelectedTab={2}
              />
            </TopBarContainer>
            <MainContentContainer>
              <div className='sidebar'>
                <div className='list-item' data-active={true}>
                  <div className='list-title'>
                    <span>Status</span>
                    <svg
                      className='down-arrow'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M3 7L8 12L13 7'
                        stroke='#545454'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <FlexRow
                    width='100%'
                    gap='12px'
                    wrap
                    style={{ marginBottom: "13px" }}
                  >
                    {["All", "Listed", "On auction", "New", "Has offers"].map(
                      (item, idx) => (
                        <PlainButton key={idx} small black={idx === 0}>
                          {idx === 1 && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#3EC574",
                              }}
                            />
                          )}
                          {item}
                        </PlainButton>
                      ),
                    )}
                  </FlexRow>
                </div>
                <div className='list-item'>
                  <div className='list-title'>
                    <span>Creator earnings</span>
                    <svg
                      className='down-arrow'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M3 7L8 12L13 7'
                        stroke='#545454'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className='list-item'>
                  <div className='list-title'>
                    <span>Price</span>
                    <svg
                      className='down-arrow'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M3 7L8 12L13 7'
                        stroke='#545454'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {contentAccessible && (
                <>
                  {files.length > 0 && (
                    <FilesContentSection files={files} /* foldItems */ />
                  )}
                  {files.length === 0 && (
                    <EmptySection tip='Nothing here yet, go create your first asset!' />
                  )}
                </>
              )}
              {!contentAccessible && <LockedSection />}
            </MainContentContainer>
          </Section>
        </>
      )}
      {isGuidePage && (
        <GuidePageSection
          width='100%'
          alignItems='center'
          justifyContent='center'
          padding='24px'
        >
          {(!address || address === userAddress) && (
            <Section width='100%' alignItems='center'>
              <p>
                To enter your personal space, you need to follow instructions
                below:
                <br />
                1. Bind your Twitter account.
                <BlackButton
                  disabled={!!(pkh && userInfo)}
                  onClick={handleBindTwitter}
                >
                  {authenticating
                    ? "Authenticating..."
                    : pkh && !userInfo
                      ? "Bind Twitter"
                      : pkh && userInfo
                        ? "Finished"
                        : "Waiting..."}
                </BlackButton>
                <br />
                2. Create your first share.
                <BlackButton
                  disabled={!emptyPyraMarket}
                  onClick={handleCreateShare}
                >
                  {emptyPyraMarket ? "Create share" : "Finished"}
                </BlackButton>
                <br />
                3. Create PyraZone.
                <BlackButton
                  disabled={!emptyPyraZone && !emptyPyraMarket}
                  onClick={handleCreatePyraZone}
                >
                  {emptyPyraZone
                    ? emptyPyraMarket
                      ? "Create share first"
                      : "Create PyraZone"
                    : "Finished"}
                </BlackButton>
                <br />
                4. Update your profile.
                <BlackButton
                  disabled={!emptyProfile}
                  onClick={() => message.info("Clicked")}
                >
                  {emptyProfile ? "Update profile" : "Finished"}
                </BlackButton>
              </p>
            </Section>
          )}
          {address && address !== userAddress && (
            <p>Wrong address or empty pyra zone.</p>
          )}
        </GuidePageSection>
      )}
      <ShareModal visible={shareModal} setVisible={setShareModal} />
    </CreatorWrapper>
  );
};

const FilesContentSection = ({
  files,
  foldItems,
}: {
  files: MirrorFile[];
  foldItems?: boolean;
}) => {
  const itemCount = files.length;
  const minColumnGap = 18;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardItemRef = useRef<HTMLDivElement>(null);
  const [columnGap, setColumnGap] = useState(minColumnGap);
  const [rowGap, setRowGap] = useState(minColumnGap * 1.7);
  const [lineHeight, setLineHeight] = useState(0);

  const handleResize = () => {
    if (sectionRef.current && cardItemRef.current) {
      setLineHeight(cardItemRef.current.clientHeight);
      const sectionWidth = sectionRef.current.clientWidth;
      const cardItemWidth = cardItemRef.current.clientWidth;
      const columnCount = Math.floor(
        sectionWidth / (cardItemWidth + minColumnGap),
      );
      if (itemCount < columnCount) {
        setColumnGap(minColumnGap);
        setRowGap(0);
      } else {
        let columnGap =
          (sectionWidth - cardItemWidth * columnCount - 1) / (columnCount - 1);
        columnGap = columnGap > 120 ? 120 : columnGap;
        let rowGap = columnGap * 1.7;
        rowGap = rowGap > 100 ? 100 : rowGap;
        setColumnGap(columnGap);
        setRowGap(rowGap);
      }
    }
  };

  useEffect(handleResize, [sectionRef.current, cardItemRef.current]);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <FilesContentSectionWrap
      ref={sectionRef}
      onResize={handleResize}
      rowGap={`${rowGap}px`}
      columnGap={`${columnGap}px`}
      foldItems={foldItems}
      lineHeight={lineHeight}
    >
      {files.map((file, idx) => {
        return (
          <div
            className='file-card'
            key={idx}
            ref={idx === 0 ? cardItemRef : undefined}
            onClick={async () => {
              await FileInfoModal.open({ file });
            }}
          >
            <div className='preview' style={{ background: "#000000" }}>
              <Media
                mediaUrl={file.content.resources[0]}
                mediaMimeType={"image/png"}
              />
            </div>
            <div className='file-info'>
              <p>{file.content.title}</p>
              {file.accessControl?.monetizationProvider?.dataAsset?.assetId && (
                <>
                  {(file.accessControl.monetizationProvider.dataAsset as any)
                    .assetDetail && (
                    <p style={{ marginTop: "15px" }}>
                      {ethers.utils.formatEther(
                        (
                          file.accessControl.monetizationProvider
                            .dataAsset as any
                        ).assetDetail?.amount || 0,
                      )}{" "}
                      {getCurrencyNameByCurrencyAddress(
                        (
                          file.accessControl.monetizationProvider
                            .dataAsset as any
                        ).assetDetail?.currency,
                      )}
                    </p>
                  )}
                </>
              )}
              {/* <p style={{ marginTop: "9px" }} className='grey'>
                Last sale: 1.1 ETH
              </p> */}
            </div>
          </div>
        );
      })}
    </FilesContentSectionWrap>
  );
};

const FinderContentSection = () => {
  const [sortBy, setSortBy] = useState<"Date" | "Default">("Date");

  const contentAccessible = useSelector(
    state => state.creator.contentAccessible,
  );
  const fileRecord = useSelector(state => state.creator.contentFiles);
  const files = Object.values(fileRecord || {});
  const sortedFiles = buildSortedItems(
    files,
    file => new Date(file.content.updatedAt),
  );

  const SortButton = (
    <PopupButtonWrap>
      <img src={SortIconSvg} alt='Sort' />
      <div className='popup-list'>
        <span
          className='list-item'
          data-active={sortBy === "Default"}
          onClick={() => setSortBy("Default")}
        >
          Default
        </span>
        <span
          className='list-item'
          data-active={sortBy === "Date"}
          onClick={() => setSortBy("Date")}
        >
          by date
        </span>
      </div>
    </PopupButtonWrap>
  );

  return (
    <FinderContainer style={{ marginTop: "-49px" }}>
      <FlexRow className='tool-bar'>
        {SortButton}
        <FlexRow gap='14px' flex='0 0 auto' style={{ cursor: "pointer" }}>
          <span>All</span>
          <img src={DownArrowIconSvg} alt='Down arrow' />
        </FlexRow>
      </FlexRow>
      {contentAccessible && (
        <Section className='inner-container'>
          {sortBy === "Date" &&
            sortedFiles.map(({ title, items }, idx) => {
              if (items.length > 0) {
                return (
                  <DateSortedSection files={items} dateText={title} key={idx} />
                );
              }
            })}
          {sortBy === "Default" && <DateSortedSection files={files} />}
          {files.length === 0 && (
            <EmptySection tip='Nothing here yet, go create your first asset!' />
          )}
        </Section>
      )}
      {!contentAccessible && <LockedSection />}
    </FinderContainer>
  );
};

const DateSortedSection = ({
  files,
  dateText,
}: {
  files: MirrorFile[];
  dateText?: string;
}) => {
  const [folded, setFolded] = useState(true);

  return (
    <DateSortedSectionWrap>
      <FlexRow width='100%' justifyContent='space-between'>
        {dateText && <p className='date-text'>{dateText}</p>}
        <FlexRow className='fold-bar' onClick={() => setFolded(v => !v)}>
          {folded ? (
            <>
              <img src={DoubleDownArrowIconSvg} /> {"Show all"}{" "}
              <span className='files-count'>({files.length})</span>
            </>
          ) : (
            <>
              <img
                src={DoubleDownArrowIconSvg}
                style={{ transform: "rotate(180deg)" }}
              />{" "}
              {"Fold"}
            </>
          )}
        </FlexRow>
      </FlexRow>
      <ContentSection files={files} foldItems={folded} />
    </DateSortedSectionWrap>
  );
};

const ContentSection = ({
  files,
  foldItems,
}: {
  files: MirrorFile[];
  foldItems?: boolean;
}) => {
  const itemCount = files.length;
  const minColumnGap = 32;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardItemRef = useRef<HTMLDivElement>(null);
  const [columnGap, setColumnGap] = useState(minColumnGap);
  const [rowGap, setRowGap] = useState(minColumnGap * 1.7);
  const [lineHeight, setLineHeight] = useState(0);

  const handleResize = () => {
    if (sectionRef.current && cardItemRef.current) {
      setLineHeight(cardItemRef.current.clientHeight);
      const sectionWidth = sectionRef.current.clientWidth;
      const cardItemWidth = cardItemRef.current.clientWidth;
      const columnCount = Math.floor(
        sectionWidth / (cardItemWidth + minColumnGap),
      );
      if (itemCount < columnCount) {
        setColumnGap(minColumnGap);
        setRowGap(0);
      } else {
        let columnGap =
          (sectionWidth - cardItemWidth * columnCount - 1) / (columnCount - 1);
        columnGap = columnGap > 80 ? 80 : columnGap;
        let rowGap = columnGap * 1.7;
        rowGap = rowGap > 100 ? 100 : rowGap;
        setColumnGap(columnGap);
        setRowGap(rowGap);
      }
    }
  };

  useEffect(handleResize, [sectionRef.current, cardItemRef.current]);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ContentSectionWrap
      ref={sectionRef}
      onResize={handleResize}
      rowGap={`${rowGap}px`}
      columnGap={`${columnGap}px`}
      foldItems={foldItems}
      lineHeight={lineHeight}
    >
      {files.map((file, idx) => {
        return (
          <div
            className='file-card'
            key={idx}
            ref={idx === 0 ? cardItemRef : undefined}
            onClick={async () => {
              await FileInfoModal.open({ file });
            }}
          >
            <div className='preview' style={{ background: "#000000" }}>
              <Media
                mediaUrl={file.content.resources[0]}
                mediaMimeType={"image/png"}
              />
            </div>
            <p className='file-name'>{file.content.title}</p>
          </div>
        );
      })}
    </ContentSectionWrap>
  );
};

const LockedSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const { connector } = useStore();

  const [tradeKeyLoading, setTradeKeyLoading] = useState(false);

  return (
    <LockedSectionWrap>
      <Section
        width='100%'
        alignItems='center'
        justifyContent='center'
        gap='22px'
      >
        <p className='locked-tip'>
          Unlock{" "}
          {creatorStates.contentFiles &&
            Object.values(creatorStates.contentFiles).length + "+ "}
          curations
        </p>
        <BlackButton
          onClick={async () => {
            if (!creatorStates.pyraZone || tradeKeyLoading) {
              message.info("Wait for loading...");
              return;
            }
            setTradeKeyLoading(true);
            try {
              const pyraZone = new PyraZone({
                chainId: globalStates.chainId,
                assetId: creatorStates.pyraZone.asset_id,
                connector,
              });
              const keyId = await pyraZone.buyTierkey(0);
              console.log({ keyId });
              const { unlockedFolder } = await dispatch(
                unlockCreatorContents({
                  chainId: globalStates.chainId,
                  assetId: creatorStates.pyraZone.asset_id,
                  connector,
                }),
              ).unwrap();
              console.log({ unlockedFolder });
            } finally {
              setTradeKeyLoading(false);
            }
          }}
        >
          Buy key
          {tradeKeyLoading && <img src={LoadingWhiteIconSvg} alt='loading' />}
        </BlackButton>
      </Section>
      <Section
        width='100%'
        alignItems='center'
        padding='120px 0'
        flex='0 0 auto'
        gap='22px'
      >
        {Object.values(creatorStates.tierKeyHolders || {}).length > 0 && (
          <>
            <FlexRow gap='4px'>
              <AvatarGroup>
                {Object.values(creatorStates.tierKeyHolders || {})
                  .slice(0, 5)
                  .map((holder, idx) => {
                    return (
                      <Avatar
                        key={idx}
                        sx={{
                          bgcolor: stringToColor(
                            holder.user_info?.name || holder.tierkey_holder,
                          ),
                          border: "none !important",
                          cursor: "pointer",
                        }}
                        src={holder.user_info?.profile_image_url}
                        onClick={() => {
                          dispatch(creatorSlice.actions.clearAllInfos());
                          navigate("/creator/" + holder.tierkey_holder);
                        }}
                      >
                        {(
                          holder.user_info?.name || holder.tierkey_holder
                        ).slice(-2)}
                      </Avatar>
                    );
                  })}
              </AvatarGroup>
              {Object.values(creatorStates.tierKeyHolders || {}).length > 5 && (
                <span className='locked-bottom-extra-tip'>
                  +
                  {Object.values(creatorStates.tierKeyHolders || {}).length - 5}
                </span>
              )}
            </FlexRow>
            <p className='locked-bottom-tip'>also bought this collection</p>
          </>
        )}
      </Section>
    </LockedSectionWrap>
  );
};

const EmptySection = ({ tip }: { tip: string }) => {
  return (
    <EmptySectionWrap width='100%' padding='60px 0'>
      <img src={EmptySectionIconSvg} />
      <p className='empty-tip'>{tip}</p>
    </EmptySectionWrap>
  );
};
