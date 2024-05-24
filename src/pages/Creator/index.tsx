import React, { useEffect, useRef, useState } from "react";

import { Media, message } from "@meteor-web3/components";
import {
  MirrorFile,
  SignalType,
  StructuredFolder,
  StructuredFolderRecord,
} from "@meteor-web3/connector";
import { useStore } from "@meteor-web3/hooks";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AvatarGroup, Avatar, CircularProgress, Skeleton } from "@mui/material";
import {
  PyraMarketShareActivityRes,
  PyraMarketShareHolderRes,
  PyraZone,
  PyraZoneRes,
  Auth as TwitterAuth,
} from "@pyra-marketplace/pyra-sdk";
import EChartsReact from "echarts-for-react";
import { useDropzone, ErrorCode as DropzoneErrorCode } from "react-dropzone";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  BannerContainer,
  BlackButton,
  BlackButtonLabel,
  ContentInfoContainer,
  ContentSectionWrap,
  CreatorWrapper,
  DateSortedSectionWrap,
  EmptySectionWrap,
  FilesContentSectionWrap,
  FinderContainer,
  GuidePageSection,
  NewUserGuidingPageContainer,
  LockedSectionWrap,
  MainContentContainer,
  PlainButton,
  PlainTabButton,
  PopupButtonWrap,
  ShareCardSection,
  ShareContainer,
  SidebarPlainButton,
  TopBarContainer,
  TwitterIcon,
  VisuallyHiddenInput,
  EmptyFileSection,
} from "./styled";

import DoubleDownArrowIconSvg from "@/assets/icons/double-down-arrow.svg";
import EmptySectionIconSvg from "@/assets/icons/empty-section.svg";
import LoadingWhiteIconSvg from "@/assets/icons/loading-white.svg";
import TwitterIconSvg from "@/assets/icons/twitter-icon.svg";
import DefaultAvatarPng from "@/assets/images/default-avatar.png";
import DefaultBannerPng from "@/assets/images/default-banner.png";
import LinkingTwitterPng from "@/assets/images/linking-twitter.png";
import QuestionPng from "@/assets/images/question.png";
import { FileInfoModal } from "@/components/FileInfoModal";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { KeyModal } from "@/components/KeyModal";
import { RevenueModal } from "@/components/RevenueModal";
import Selector from "@/components/Selector";
import { ShareModal } from "@/components/ShareModal";
import { TextInput } from "@/components/TextInput";
import { useAuth } from "@/hooks/useAuth";
import {
  claim,
  createPryaZone,
  createShare,
  creatorSlice,
  loadClaimableRevenue,
  loadContentAccessible,
  loadCreatorBaseInfos,
  loadCreatorContents,
  loadCreatorShareInfos,
  loadCreatorUserInfo,
  loadPublisherProfile,
  loadPyraZone,
  loadShareActivity,
  loadShareHolders,
  loadShareSellPrice,
  unlockCreatorContents,
  updatePublisherProfile,
} from "@/state/createor/slice";
import { globalSlice } from "@/state/global/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { modalSlice } from "@/state/modal/slice";
import { Divider, FlexRow, Section } from "@/styled";
import {
  betterErrorPrompt,
  betterToFixed,
  buildSortedItems,
  fullWideNumber,
  getCurrencyNameByCurrencyAddress,
  getDefaultAvatar,
  stringAbbreviation,
  stringToColor,
} from "@/utils";
import { ECOption, appEcharts } from "@/utils/echart.config";

export const Creator: React.FC = () => {
  const tabs: Array<"Content" | "Share" | "Activity"> = [
    "Content",
    "Share",
    "Activity",
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [isNewCreator, setIsNewCreator] = useState(false);
  const [shareModalOption, setShareModalOption] = useState(0);
  const [keyModalOption, setKeyModalOption] = useState(1);
  const [hoverBanner, setHoverBanner] = useState(false);
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const modalStates = useSelector(state => state.modal);
  const { connector, address: userAddress, pkh } = useStore();
  const isGuidePage = useSelector(state =>
    !address || address === userAddress
      ? state.creator.emptyUserInfo ||
        state.creator.emptyProfile ||
        state.creator.emptyPyraMarket ||
        state.creator.emptyPyraZone
      : state.creator.emptyPyraMarket || state.creator.emptyPyraZone,
  );
  const fileRecord = useSelector(state => state.creator.contentFolders);
  const files = Object.values(fileRecord || {});
  const contentAccessible = useSelector(
    state => state.creator.contentAccessible,
  );
  const loc = useLocation();

  useEffect(() => {
    dispatch(creatorSlice.actions.setIsGuidingPage(isGuidePage));
  }, [isGuidePage]);

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
    dispatch(creatorSlice.actions.clearAllInfos());
  }, []);

  useEffect(() => {
    dispatch(creatorSlice.actions.resetEmpty());
    if (globalStates.autoConnecting) return;
    init();
  }, [address, userAddress, globalStates.autoConnecting]);

  useEffect(() => {
    if (globalStates.autoConnecting || isNewCreator) return;
    contentInit();
  }, [
    isNewCreator,
    // selectedTab,
    address,
    userAddress,
    globalStates.autoConnecting,
  ]);

  useEffect(() => {
    if (globalStates.autoConnecting) return;
    const _address = address || userAddress!;
    dispatch(
      loadCreatorShareInfos({
        chainId: globalStates.chainId,
        address: _address,
        userAddress,
        connector,
      }),
    )
      .unwrap()
      .then(console.log);
  }, [isNewCreator, address, userAddress, globalStates.autoConnecting]);

  useEffect(() => {
    setIsNewCreator(false);
  }, [selectedTab, loc.pathname]);

  const init = async () => {
    // if ((await connector.getCurrentWallet()) === undefined) {
    //   navigate("/");
    //   return;
    // }
    if (!address && !userAddress) {
      navigate("/");
      return;
    }
    setLoading(true);
    try {
      const _address = address || userAddress!;
      let pyraZone: PyraZoneRes;
      const profile = await dispatch(
        loadPublisherProfile({ address: _address }),
      ).unwrap();
      if (_address === userAddress) {
        const userInfo = await dispatch(
          loadCreatorUserInfo({ address: _address }),
        ).unwrap();
        const { pyraZone: _pyraZone, pyraMarket: _pyraMarket } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: _address,
          }),
        ).unwrap();
        if (!userInfo) {
          dispatch(creatorSlice.actions.setEmptyUserInfo(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyUserInfo(false));
        }
        if (!profile.cover_image_url || !profile.nick_name) {
          dispatch(creatorSlice.actions.setEmptyProfile(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyProfile(false));
        }
        if (!_pyraMarket) {
          dispatch(creatorSlice.actions.setEmptyPyraMarket(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyPyraMarket(false));
        }
        if (!_pyraZone) {
          dispatch(creatorSlice.actions.setEmptyPyraZone(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyPyraZone(false));
        }
        if (
          !_pyraZone ||
          !_pyraMarket ||
          !profile.cover_image_url ||
          !profile.nick_name
        ) {
          message.info("You need to create your pyra zone first.");
          return;
        }
        pyraZone = _pyraZone;
      } else {
        dispatch(loadCreatorUserInfo({ address: _address }));
        const { pyraZone: _pyraZone, pyraMarket: _pyraMarket } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: _address,
          }),
        ).unwrap();
        if (!_pyraMarket) {
          dispatch(creatorSlice.actions.setEmptyPyraMarket(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyPyraMarket(false));
        }
        if (!_pyraZone) {
          dispatch(creatorSlice.actions.setEmptyPyraZone(true));
        } else {
          dispatch(creatorSlice.actions.setEmptyPyraZone(false));
        }
        if (!_pyraZone || !_pyraMarket) {
          message.error("Wrong address or empty pyra zone.");
          return;
        }
        pyraZone = _pyraZone;
      }
      dispatch(creatorSlice.actions.setEmptyPyraZone(false));
      const baseInfos = await dispatch(
        loadCreatorBaseInfos({
          chainId: globalStates.chainId,
          address: _address,
          userAddress,
          assetId: pyraZone.asset_id,
          connector,
        }),
      ).unwrap();
      console.log({ baseInfos });
    } catch (e: any) {
      betterErrorPrompt(e, "Init failed");
    } finally {
      setLoading(false);
    }
  };

  const contentInit = async () => {
    console.log("Init content...");
    if (!address && !userAddress) {
      navigate("/");
      return;
    }
    setContentLoading(true);
    try {
      const _address = address || userAddress!;
      if (_address === userAddress) {
        dispatch(
          creatorSlice.actions.setContentAccessible(
            [...new Array(3)].fill(true),
          ),
        );
      } else {
        dispatch(
          creatorSlice.actions.setContentAccessible(
            [...new Array(3)].fill(false),
          ),
        );
      }
      // if (selectedTab === "Content") {
      // if (!creatorStates.pyraZone) return;
      const { pyraZone: _pyraZone } = await dispatch(
        loadPyraZone({
          chainId: globalStates.chainId,
          address: _address,
        }),
      ).unwrap();
      if (!_pyraZone) {
        return;
      }
      let contentInfo;
      if (userAddress) {
        contentInfo = await dispatch(
          loadCreatorContents({
            chainId: globalStates.chainId,
            assetId: _pyraZone.asset_id,
            accountAddress: userAddress,
            connector,
          }),
        ).unwrap();
        console.log({
          args: {
            chainId: globalStates.chainId,
            assetId: _pyraZone.asset_id,
            accountAddress: userAddress,
            connector,
          },
          contentInfo,
        });
      }
      if (_address !== userAddress && contentInfo?.isAccessible.some(Boolean)) {
        // try to unlock content folder
        try {
          const { unlockedFolders } = await dispatch(
            unlockCreatorContents({
              chainId: globalStates.chainId,
              assetId: _pyraZone.asset_id,
              connector,
            }),
          ).unwrap();
          console.log({ unlockedFolders });
        } catch (e: any) {
          console.warn("unlock folder failed: ", e);
        }
      }
      // }
    } catch (e: any) {
      betterErrorPrompt(e, "Content init failed");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (!address || address === userAddress || !creatorStates.pyraZone) return;
    dispatch(
      unlockCreatorContents({
        chainId: globalStates.chainId,
        assetId: creatorStates.pyraZone?.asset_id,
        connector,
      }),
    )
      .unwrap()
      .then(console.log);
  }, [creatorStates.contentAccessible]);

  useEffect(() => {
    if (!address || address === userAddress) return;
    if (creatorStates.userTierKeys) {
      const accessible: boolean[] = [];
      for (let i = 0; i < creatorStates.userTierKeys.length; i++) {
        if (
          creatorStates.userTierKeys[i].length > 0 &&
          (i === 0 || accessible[i - 1])
        ) {
          accessible[i] = true;
        } else {
          accessible[i] = false;
        }
      }
      dispatch(creatorSlice.actions.setContentAccessible(accessible));
    }
  }, [creatorStates.userTierKeys]);

  const handleUpdateProfile = async (coverImage: File) => {
    try {
      const res = await dispatch(
        updatePublisherProfile({
          address: userAddress!,
          connector,
          profile: {
            coverImageFile: coverImage,
          },
        }),
      ).unwrap();
      if (res) {
        dispatch(loadPublisherProfile({ address: userAddress! }));
        message.success("Update profile successfully.");
        dispatch(creatorSlice.actions.setEmptyProfile(false));
      } else {
        message.error("Update profile failed.");
      }
    } catch (e: any) {
      betterErrorPrompt(e, "Update profile failed");
    }
  };

  useEffect(() => {
    console.log({ creatorStates });
  }, [creatorStates]);

  return (
    <CreatorWrapper>
      {!(
        (!address || address === userAddress) &&
        (creatorStates.emptyUserInfo || creatorStates.emptyProfile)
      ) && (
        <BannerContainer>
          <img
            className='banner-img'
            src={
              creatorStates.publisherProfile?.cover_image_url ||
              DefaultBannerPng
            }
          />
          <div
            className='banner-section'
            onMouseEnter={() => setHoverBanner(true)}
            onMouseLeave={() => setHoverBanner(false)}
          >
            {(!address || address === userAddress) && (
              <label
                className='banner-mask'
                style={{ opacity: hoverBanner ? 1 : 0 }}
              >
                <EditOutlinedIcon color='inherit' />
                <VisuallyHiddenInput
                  type='file'
                  accept='image/*'
                  onChange={e =>
                    e.target.files && handleUpdateProfile(e.target.files[0])
                  }
                />
              </label>
            )}
            <div className='user-base-info'>
              {loading ? (
                <Skeleton
                  variant='rounded'
                  className='user-avatar'
                  sx={{ bgcolor: "grey.400" }}
                />
              ) : (
                <img
                  className='user-avatar'
                  src={
                    creatorStates.publisherProfile?.user_info
                      ?.profile_image_url ||
                    getDefaultAvatar(
                      creatorStates.publisherProfile?.publisher,
                    ) ||
                    DefaultAvatarPng
                  }
                />
              )}
              <FlexRow gap='12px'>
                {creatorStates.publisherProfile ? (
                  <>
                    <p className='title-text'>
                      {creatorStates.publisherProfile.nick_name ||
                        creatorStates.publisherProfile.user_info?.name ||
                        stringAbbreviation(
                          creatorStates.publisherProfile.publisher,
                          4,
                          4,
                        )}
                    </p>
                    <TwitterIcon
                      onClick={() => {
                        window.open(
                          `https://twitter.com/${creatorStates.publisherProfile?.user_info?.username}`,
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
            {!creatorStates.emptyPyraMarket && (
              <div className='right'>
                <div className='buttons-wrapper'>
                  <div
                    className='button'
                    style={{
                      ...(!creatorStates.pyraMarket?.share && {
                        background: "#545454",
                      }),
                    }}
                    onClick={() => {
                      if (!creatorStates.pyraMarket?.share) {
                        return;
                      }
                      setShareModalOption(1);
                      dispatch(modalSlice.actions.setShareModalVisible(true));
                    }}
                  >
                    Trade share
                  </div>
                  <div
                    className='button'
                    style={{
                      ...(!(
                        creatorStates.pyraZone?.tierkeys?.length &&
                        creatorStates.pyraZone?.tierkeys?.length > 0
                      ) && {
                        background: "#545454",
                      }),
                    }}
                    onClick={() => {
                      if (
                        !(
                          creatorStates.pyraZone?.tierkeys?.length &&
                          creatorStates.pyraZone?.tierkeys?.length > 0
                        )
                      ) {
                        return;
                      }
                      setKeyModalOption(1);
                      dispatch(modalSlice.actions.setKeyModalVisible(true));
                    }}
                  >
                    Trade key
                  </div>
                </div>
                <div className='user-extra-info'>
                  <div className='user-extra-info-item'>
                    {loading ? (
                      <Skeleton
                        width='calc(100% - 20px)'
                        sx={{ bgcolor: "grey.400" }}
                      />
                    ) : (
                      <p className='sub-title-text'>
                        $
                        {globalStates.ethPrice &&
                        creatorStates?.shareTotalVolume &&
                        parseFloat(creatorStates.shareTotalVolume) !== 0
                          ? (
                              parseFloat(creatorStates.shareTotalVolume) *
                              globalStates.ethPrice
                            ).toFixed(4)
                          : "0.0"}
                      </p>
                    )}
                    <p className='desc-text'>Total volume</p>
                  </div>
                  <div className='user-extra-info-item'>
                    {loading ? (
                      <Skeleton
                        width='calc(100% - 20px)'
                        sx={{ bgcolor: "grey.400" }}
                      />
                    ) : (
                      <p className='sub-title-text'>
                        $
                        {globalStates.ethPrice &&
                        creatorStates?.shareTotalValue &&
                        parseFloat(creatorStates.shareTotalValue) !== 0
                          ? (
                              parseFloat(creatorStates?.shareTotalValue) *
                              globalStates.ethPrice
                            ).toFixed(4)
                          : "0.0"}{" "}
                      </p>
                    )}
                    <p className='desc-text'>Share value</p>
                  </div>
                  <div className='user-extra-info-item'>
                    {loading ? (
                      <Skeleton
                        width='calc(100% - 20px)'
                        sx={{ bgcolor: "grey.400" }}
                      />
                    ) : (
                      <p className='sub-title-text'>
                        {creatorStates.shareHolders?.length || 0}
                      </p>
                    )}
                    <p className='desc-text'>Share holders</p>
                  </div>
                  {!creatorStates.emptyPyraZone && (
                    <>
                      <div className='user-extra-info-item'>
                        {loading ? (
                          <Skeleton
                            width='calc(100% - 20px)'
                            sx={{ bgcolor: "grey.400" }}
                          />
                        ) : (
                          <p className='sub-title-text'>
                            {creatorStates.tierKeyBuyPrice &&
                            parseFloat(creatorStates.tierKeyBuyPrice) !== 0
                              ? parseFloat(
                                  creatorStates.tierKeyBuyPrice,
                                ).toFixed(8)
                              : "0.0"}{" "}
                            {globalStates.chainCurrency}
                          </p>
                        )}
                        <p className='desc-text'>Key price</p>
                      </div>
                      <div className='user-extra-info-item'>
                        {loading ? (
                          <Skeleton
                            width='calc(100% - 20px)'
                            sx={{ bgcolor: "grey.400" }}
                          />
                        ) : (
                          <p className='sub-title-text'>
                            {creatorStates.pyraZone?.tierkey_sales || 0}
                          </p>
                        )}
                        <p className='desc-text'>Key sales</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </BannerContainer>
      )}
      {!isGuidePage && (
        <>
          <FlexRow width='100%' padding='22px 32px 12px'>
            <ContentInfoContainer style={{ flex: "1 1 auto" }}>
              {loading ? (
                <Skeleton width='400px' className='item-desc' />
              ) : (
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
                      <React.Fragment key={item.title}>
                        {idx !== 0 && <span>{"  ·  "}</span>}
                        <span>{item.title}</span>{" "}
                        <span className='bold'>{item.data}</span>
                      </React.Fragment>
                    );
                  })}
                </p>
              )}
            </ContentInfoContainer>
          </FlexRow>
          <FlexRow
            width='100%'
            alignItems='center'
            justifyContent='space-between'
            padding='24px 32px'
          >
            <FlexRow flex='0 0 auto' gap='9px'>
              {tabs.map((tab, idx) => (
                <PlainTabButton
                  key={idx}
                  data-active={tab === selectedTab}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </PlainTabButton>
              ))}
            </FlexRow>
          </FlexRow>
          <Section width='100%' padding='0px 32px' gap='24px'>
            <Divider width='100%' border='1px solid #E2E2E2' />
          </Section>
          {selectedTab === tabs[0] ? (
            <FinderContentSection loading={contentLoading} />
          ) : selectedTab === tabs[1] ? (
            <ShareSection loading={contentLoading} />
          ) : (
            <ActivitySection loading={contentLoading} />
          )}
          {/* {contentLoading && (
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
        </>
      )}
      {isGuidePage && (
        <>
          {address && address !== userAddress && (
            <GuidePageSection
              width='100%'
              alignItems='center'
              justifyContent='center'
              padding='24px'
            >
              {/* {(!address || address === userAddress) && (
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
                    disabled={
                      (emptyPyraZone && emptyPyraMarket) ||
                      (!emptyPyraZone && !emptyPyraMarket)
                    }
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
                  <BlackButtonLabel data-disabled={!emptyProfile}>
                    {emptyProfile ? (
                      <>
                        Update profile
                        <VisuallyHiddenInput
                          type='file'
                          accept='image/*'
                          onChange={e =>
                            e.target.files &&
                            handleUpdateProfile(e.target.files[0])
                          }
                        />
                      </>
                    ) : (
                      "Finished"
                    )}
                  </BlackButtonLabel>
                </p>
              </Section>
            )} */}
              <p style={{ fontSize: "24px" }}>
                Wrong address or empty pyra zone.
              </p>
            </GuidePageSection>
          )}
          {(!address || address === userAddress) && <NewUserGuidingPage />}
        </>
      )}
      {/* {loading && (
        <GuidePageSection
          style={{
            ...(creatorStates.emptyUserInfo || creatorStates.emptyProfile
              ? { marginTop: "133px" }
              : undefined),
          }}
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
      <ShareModal
        option={shareModalOption}
        visible={modalStates.shareModalVisible}
        setVisible={(v: boolean) =>
          dispatch(modalSlice.actions.setShareModalVisible(v))
        }
      />
      <KeyModal
        option={keyModalOption}
        visible={modalStates.keyModalVisible}
        setVisible={(v: boolean) =>
          dispatch(modalSlice.actions.setKeyModalVisible(v))
        }
        currentTier={modalStates.keyModalCurrentTier}
        setCurrentTier={(v: number) =>
          dispatch(modalSlice.actions.setKeyModalCurrentTier(v))
        }
      />
    </CreatorWrapper>
  );
};

const FilesContentSection = ({
  files,
  foldItems,
}: {
  files?: (MirrorFile & { tier?: number; locked?: boolean })[];
  foldItems?: boolean;
}) => {
  const minColumnGap = 18;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardItemRef = useRef<HTMLDivElement>(null);
  const [columnGap, setColumnGap] = useState(minColumnGap);
  const [rowGap, setRowGap] = useState(minColumnGap * 1.7);
  const [lineHeight, setLineHeight] = useState(0);
  const [maxColumnCount, setMaxColumnCount] = useState(1);
  const itemCount = files?.length || maxColumnCount;

  const handleResize = () => {
    if (sectionRef.current && cardItemRef.current) {
      setLineHeight(cardItemRef.current.clientHeight);
      const sectionWidth = sectionRef.current.clientWidth;
      const cardItemWidth = cardItemRef.current.clientWidth;
      const columnCount = Math.floor(
        sectionWidth / (cardItemWidth + minColumnGap),
      );
      setMaxColumnCount(columnCount);
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
      {(files || [...new Array(maxColumnCount)]).map((file, idx) => {
        return (
          <FileCard
            key={idx}
            file={file}
            cardItemRef={idx === 0 ? cardItemRef : undefined}
          />
        );
      })}
    </FilesContentSectionWrap>
  );
};

const FileCard = ({
  file,
  cardItemRef,
}: {
  file?: MirrorFile & { tier?: number; locked?: boolean };
  cardItemRef?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div
      className='file-card'
      ref={cardItemRef}
      onClick={async () => {
        file &&
          (await FileInfoModal.open({
            file,
            locked: file.locked,
            tier: file.tier,
          }));
      }}
    >
      {file ? (
        <div className='preview'>
          <Media
            mediaUrl={file.locked ? QuestionPng : file.content.resources[0].url}
            mediaMimeType={file.content.resources[0].type}
          />
        </div>
      ) : (
        <Skeleton variant='rounded' className='preview' />
      )}
      <div className='file-info'>
        {file ? <p>{file.content.title}</p> : <Skeleton width='100%' />}
        {/* {file.accessControl?.monetizationProvider?.dataAsset?.assetId && (
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
      )} */}
        {/* <p style={{ marginTop: "9px" }} className='grey'>
        Last sale: 1.1 {globalStates.chainCurrency}
      </p> */}
      </div>
    </div>
  );
};

const FinderContentSection = ({ loading }: { loading?: boolean }) => {
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [files, setFiles] = useState<
    (MirrorFile & { tier: number; locked: boolean })[]
  >([]);

  const { address } = useParams<{ address?: string }>();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const contentAccessible = useSelector(state =>
    state.creator.selectedTier === -1
      ? state.creator.contentAccessible?.some(Boolean)
      : state.creator.contentAccessible?.[state.creator.selectedTier],
  );
  const tierAccessible = useSelector(state => state.creator.contentAccessible);
  const contentFolders = useSelector(state => state.creator.contentFolders);
  const tierKeys = creatorStates.pyraZone?.tierkeys;
  const selectedTier = useSelector(state => state.creator.selectedTier);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { address: userAddress } = useStore();

  useEffect(() => {
    let files: (MirrorFile & { tier: number; locked: boolean })[] = (
      tierKeys || []
    )
      .map((tierKey, idx) => {
        const locked = !tierAccessible?.[idx];
        const folders: StructuredFolder[] = [];
        Object.values(contentFolders || {}).forEach(folder => {
          if (
            folder.options?.signals?.find(
              signal =>
                signal.type === SignalType.asset && signal.id === tierKey,
            )
          ) {
            folders.push(folder);
          }
        });
        return folders
          .map(folder =>
            Object.values(folder?.mirrorRecord || {}).map(file => ({
              ...file.mirrorFile,
              tier: idx,
              locked,
            })),
          )
          .flat();
      })
      .flat();
    if (selectedTier !== -1) {
      files = files.filter(file => file.tier === selectedTier);
    }
    setFiles(files);
  }, [contentFolders, tierAccessible, selectedTier, tierKeys]);

  return (
    <Section width='100%' padding='12px 32px' gap='24px'>
      {/* <TopBarContainer width='100%' gap='12px'>
        <FlexRow className='selector' flex='0 0 auto'>
          <span className='bold-text'>latest</span>
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
        <FlexRow gap='14px' flex='0 0 auto' style={{ cursor: "pointer" }}>
          <span>All</span>
          <img src={DownArrowIconSvg} alt='Down arrow' />
        </FlexRow>
      </TopBarContainer> */}
      <MainContentContainer>
        <div className='sidebar'>
          <div className='sidebar-list-title'>
            <span>Pyra zone</span>
            <svg
              className='down-arrow'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g clipPath='url(#clip0_3696_4127)'>
                <path
                  d='M13 7L8 12L3 7'
                  stroke='#121212'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </g>
              <defs>
                <clipPath id='clip0_3696_4127'>
                  <rect width='16' height='16' fill='white' />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className='sidebar-list-item'>
            <Selector
              options={["latest", "oldest"]}
              defaultSelectedItem
              onChange={item => setSortBy(item as any)}
            />
            <Selector
              options={["All tiers"].concat(
                creatorStates.pyraZone?.tierkeys
                  .slice(0, 3)
                  .map((_, idx) => `Tier ${idx + 1}`) || [],
              )}
              defaultSelectedItem
              onChange={(_, idx) =>
                dispatch(creatorSlice.actions.setSelectedTier(idx - 1))
              }
            />
            {!creatorStates.pyraZone &&
              [...new Array(3)].map((_, idx) => (
                <Skeleton
                  variant='rounded'
                  key={idx}
                  width='100%'
                  height='48px'
                  sx={{ borderRadius: "12px" }}
                />
              ))}
            {creatorStates.pyraZone?.tierkeys.slice(0, 3).map((item, idx) => (
              <SidebarPlainButton
                key={idx}
                onClick={() => {
                  dispatch(modalSlice.actions.setKeyModalCurrentTier(idx));
                  dispatch(modalSlice.actions.setKeyModalVisible(true));
                }}
              >
                <span>Tier {idx + 1} key</span>
                <FlexRow gap='3px' flex='0'>
                  <svg
                    width='19'
                    height='19'
                    viewBox='0 0 19 19'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9.49957 1.19189V8.05236L4.5437 9.595L9.49957 1.19189ZM9.49957 1.19189V8.05236L14.4554 9.595L9.49957 1.19189ZM9.49957 17.8086V13.035L4.5437 10.3019L9.49957 17.8086ZM9.49957 17.8086V13.035L14.4554 10.3019L9.49957 17.8086Z'
                      fill='#98D4FF'
                    />
                    <path
                      d='M4.5437 9.595L9.49957 7.29199V12.0292L4.5437 9.595ZM14.4554 9.595L9.49957 7.29199V12.0292L14.4554 9.595Z'
                      fill='#98D4FF'
                    />
                  </svg>
                  {/* <span>0.6176</span> */}
                  <span>
                    {betterToFixed(
                      creatorStates.pyraZone?.tierkey_prices[idx],
                      4,
                    )}
                  </span>
                </FlexRow>
              </SidebarPlainButton>
            ))}
          </div>
        </div>
        {loading && <FilesContentSection />}
        {!loading && contentAccessible && (
          <>
            {files.length > 0 && (
              <FilesContentSection
                files={files.sort((a, b) => {
                  if (sortBy === "latest") {
                    return (
                      new Date(b.updatedAt || Date.now()).getTime() -
                      new Date(a.updatedAt || Date.now()).getTime()
                    );
                  } else {
                    return (
                      new Date(a.updatedAt || Date.now()).getTime() -
                      new Date(b.updatedAt || Date.now()).getTime()
                    );
                  }
                })}
              />
            )}
            {files.length === 0 && (
              <>
                {address && address !== userAddress && (
                  <EmptySection tip='Nothing here yet, go create your first asset!' />
                )}
                {(!address || address === userAddress) && (
                  <EmptyFileSection>
                    <p className='guide-title'>Create your first post</p>
                    <button
                      className='primary-btn'
                      onClick={() => navigate("/upload")}
                    >
                      <span>Create</span>
                      <RightArrow />
                    </button>
                  </EmptyFileSection>
                )}
              </>
            )}
          </>
        )}
        {!loading && !contentAccessible && <LockedSection />}
      </MainContentContainer>
    </Section>
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
      <FilesContentSection files={files} foldItems={folded} />
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
  const selectedTier = useSelector(state => state.creator.selectedTier);
  const contentAccessible = useSelector(
    state => state.creator.contentAccessible,
  );
  const { connector, address: userAddress } = useStore();
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
          Unlock {selectedTier === -1 ? "space" : `tier ${selectedTier + 1}`}
        </p>
        <BlackButton
          onClick={async () => {
            if (!userAddress) {
              message.info("Please login first");
              return;
            }
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
              // if you want to unlock the selectedTier, you must buy the tierKey from 0 to selectedTier
              const tierToBuy =
                selectedTier === -1
                  ? contentAccessible
                  : contentAccessible?.slice(0, selectedTier + 1);
              console.log({ tierToBuy, contentAccessible, selectedTier });
              if (!tierToBuy || tierToBuy.length === 0) {
                message.error("It seems nothing to buy? 🤔");
                return;
              }
              const keyIds: string[] = [];
              for (let i = 0; i < tierToBuy.length; i++) {
                if (!tierToBuy[i]) {
                  keyIds[i] = await pyraZone.buyTierkey(i);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
              console.log({ keyIds });
              const isAccessible = await dispatch(
                loadContentAccessible({
                  chainId: globalStates.chainId,
                  assetId: creatorStates.pyraZone.asset_id,
                  connector,
                  accountAddress: userAddress,
                }),
              ).unwrap();
              console.log({ isAccessible });
            } catch (e: any) {
              betterErrorPrompt(e, "Buy key failed");
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
                        src={
                          holder.user_info?.profile_image_url ||
                          getDefaultAvatar(holder.tierkey_holder)
                        }
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

const ShareSection = ({ loading }: { loading?: boolean }) => {
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);

  const [shareModal, setShareModal] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const [revenueModal, setRevenueModal] = useState(false);
  const [revenueModalOption, setRevenueModalOption] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress, pkh } = useStore();

  return (
    <Section width='100%' padding='32px' gap='36px'>
      <ShareContainer>
        <div className='info-wrapper'>
          <div className='info-container'>
            <div className='title'>TV</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                $
                {globalStates.ethPrice &&
                creatorStates.shareTotalValue &&
                parseFloat(creatorStates.shareTotalValue) !== 0
                  ? (
                      parseFloat(creatorStates?.shareTotalValue) *
                      globalStates.ethPrice
                    ).toFixed(4)
                  : "0.0"}{" "}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>
                {creatorStates.shareTotalValue &&
                parseFloat(creatorStates.shareTotalValue) !== 0
                  ? parseFloat(creatorStates.shareTotalValue).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            )}
          </div>
          <div className='info-container'>
            <div className='title'>Supply</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                {creatorStates.shareTotalSupply || "0.0"}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>Shares</div>
            )}
          </div>
          <div className='info-container'>
            <div className='title'>Volume</div>
            {loading ? (
              <Skeleton className='content' width={150} />
            ) : (
              <div className='content'>
                $
                {globalStates.ethPrice &&
                creatorStates?.shareTotalVolume &&
                parseFloat(creatorStates.shareTotalVolume) !== 0
                  ? (
                      parseFloat(creatorStates.shareTotalVolume) *
                      globalStates.ethPrice
                    ).toFixed(4)
                  : "0.0"}
              </div>
            )}
            {loading ? (
              <Skeleton className='added' width={150} />
            ) : (
              <div className='added'>
                {creatorStates.shareTotalVolume &&
                parseFloat(creatorStates.shareTotalVolume) !== 0
                  ? parseFloat(creatorStates.shareTotalVolume).toFixed(8)
                  : "0.0"}{" "}
                {globalStates.chainCurrency}
              </div>
            )}
          </div>
        </div>
        {/* <div className='more-info-container'>
          <div className='title'>You own</div>
          <div className='number'>
            {creatorStates.userShareBalance || "0.0"}{" "}
            <span className='unit'>shares</span>
          </div>
          <div className='added'>
            {creatorStates.shareSellPrice &&
            parseFloat(creatorStates.shareSellPrice) !== 0
              ? parseFloat(creatorStates.shareSellPrice).toFixed(8)
              : "0.0"}{" "}
            {globalStates.chainCurrency}
          </div>
          <div className='buttons'>
            <div
              className='buy'
              onClick={() => {
                setShareModalOption(1);
                setShareModal(true);
              }}
            >
              Buy Share
            </div>
            <div
              className='sell'
              onClick={() => {
                setShareModalOption(2);
                setShareModal(true);
              }}
            >
              Sell Share
            </div>
          </div>
        </div>
        <div className='more-info-container'>
          <div className='title'>You own</div>
          <div className='number'>
            {creatorStates.userTierKeyBalance || "0"}{" "}
            <span className='unit'>
              {creatorStates.userTierKeyBalance === "0" ||
              creatorStates.userTierKeyBalance === "1"
                ? "key"
                : "keys"}
            </span>
          </div>
          <div className='added'>
            {creatorStates.tierKeySellPrice &&
            parseFloat(creatorStates.tierKeySellPrice) !== 0
              ? parseFloat(creatorStates.tierKeySellPrice).toFixed(8)
              : "0.0"}{" "}
            {globalStates.chainCurrency}
          </div>
          <div className='buttons'>
            <div
              className='buy'
              onClick={() => {
                setKeyModalOption(1);
                setKeyModal(true);
              }}
            >
              Buy Key
            </div>
            <div
              className='sell'
              onClick={() => {
                setKeyModalOption(2);
                setKeyModal(true);
              }}
            >
              Sell Key
            </div>
          </div>
        </div> */}
        <div className='revenue-pool-container'>
          <div className='title'>Revenue pool</div>
          <div className='number'>
            {loading ? (
              <Skeleton width={100} sx={{ display: "inline-block" }} />
            ) : (
              <>{creatorStates.revenuePoolShareBalance || "0.0"}</>
            )}{" "}
            <span className='unit'>shares</span>
          </div>
          <div className='tip'>
            <div className='staked'>
              You staked:{" "}
              {loading ? (
                <Skeleton width={100} sx={{ display: "inline-block" }} />
              ) : (
                <>
                  {creatorStates.userShareHolder?.staked_amount ?? "0.0"} Shares
                </>
              )}
            </div>
          </div>
          <div className='buttons'>
            <div
              className='stake'
              onClick={() => {
                if (loading) return;
                setRevenueModalOption(1);
                setRevenueModal(true);
              }}
            >
              Stake Shares
            </div>
            <div
              className='unstake'
              onClick={() => {
                if (loading) return;
                setRevenueModalOption(2);
                setRevenueModal(true);
              }}
            >
              Unstake Shares
            </div>
          </div>
          <div className='tip'>
            <div className='rewards'>
              Revenue:{" "}
              {loading ? (
                <Skeleton
                  className='rewards'
                  width={150}
                  sx={{ display: "inline-block" }}
                />
              ) : (
                <>
                  {creatorStates.revenue &&
                  parseFloat(creatorStates.revenue) !== 0
                    ? parseFloat(creatorStates.revenue).toFixed(8)
                    : "0.0"}{" "}
                  {globalStates.chainCurrency} ≈ ${" "}
                  {globalStates.ethPrice &&
                  creatorStates?.revenue &&
                  parseFloat(creatorStates.revenue) !== 0
                    ? (
                        parseFloat(creatorStates.revenue) *
                        globalStates.ethPrice
                      ).toFixed(4)
                    : "0.0"}
                </>
              )}
            </div>
          </div>
          <div
            className='claim'
            onClick={async () => {
              if (loading) return;
              setClaiming(true);
              try {
                if (
                  !creatorStates.revenuePoolAddress ||
                  !creatorStates.shareAddress
                ) {
                  return;
                }
                const res = await dispatch(
                  claim({
                    chainId: globalStates.chainId,
                    revenuePoolAddress: creatorStates.revenuePoolAddress,
                    connector,
                  }),
                );
                if (res.meta.requestStatus === "fulfilled") {
                  message.success("Stake successfully");
                  dispatch(
                    loadClaimableRevenue({
                      chainId: globalStates.chainId,
                      revenuePoolAddress: creatorStates.revenuePoolAddress,
                      address: (address || userAddress)!,
                      connector,
                    }),
                  );
                }
              } catch (e: any) {
                betterErrorPrompt(e);
              }
              setClaiming(false);
              return;
            }}
          >
            {claiming ? "Claiming..." : "Claim"}
          </div>
        </div>
      </ShareContainer>

      <RevenueModal
        option={revenueModalOption}
        visible={revenueModal}
        setVisible={setRevenueModal}
      />
    </Section>
  );
};

const ActivitySection = ({ loading }: { loading?: boolean }) => {
  const navigate = useNavigate();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const dispatch = useDispatch();

  const chartOption: ECOption = {
    grid: {
      left: 120,
      top: 25,
      right: 80,
      bottom: 30,
    },
    // visualMap: [
    //   {
    //     show: false,
    //     type: "continuous",
    //     seriesIndex: 0,
    //     min: 0,
    //     max: 250,
    //   },
    // ],
    tooltip: {
      trigger: "axis",
      valueFormatter: value =>
        typeof value === "number"
          ? fullWideNumber(value)
          : value?.toString() || "",
      axisPointer: {
        type: "cross",
        // crossStyle: {
        //   color: "#999",
        // },
      },
    },
    xAxis: [
      {
        type: "category",
        // data: [
        //   "Nov 28",
        //   "Dec 5",
        //   "Dec 12",
        //   "Dec 19",
        //   "Dec 26",
        //   "Jan 2",
        //   "Jan 9",
        //   "Jan 16",
        //   "Jan 23",
        //   "Jan 30",
        //   "Feb 6",
        //   "Feb 13",
        //   "Feb 20",
        //   "Feb 27",
        //   "Mar 6",
        //   "Mar 13",
        //   "Mar 20",
        // ],
        data: creatorStates.publisherDailyRecord?.map(item => item.date) || [],
        axisPointer: {
          type: "shadow",
        },
        axisLabel: {
          fontFamily: "Inter-ExtraLight",
          fontWeight: 200,
          fontSize: "14px",
          color: "#545454",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: `Volume (${globalStates.chainCurrency})`,
        // min: 0,
        // max: 1.25,
        // interval: 0.25,
        axisLabel: {
          fontFamily: "Inter-ExtraLight",
          fontWeight: 200,
          fontSize: "14px",
          color: "#545454",
        },
        axisLine: {
          lineStyle: {
            color: "#C8C8C8",
          },
        },
        nameLocation: "middle",
        nameGap: 100,
        nameTextStyle: {
          fontFamily: "Inter-SemiBold",
          fontWeight: 600,
          fontSize: "14px",
          color: "#121212",
        },
      },
      // {
      //   type: "value",
      //   name: `Average price (${globalStates.chainCurrency})`,
      //   min: 0,
      //   max: 0.125,
      //   interval: 0.025,
      //   axisLabel: {
      //     fontFamily: "Inter-ExtraLight",
      //     fontWeight: 200,
      //     fontSize: "14px",
      //     color: "#545454",
      //   },
      //   axisLine: {
      //     lineStyle: {
      //       color: "#C8C8C8",
      //     },
      //   },
      //   nameLocation: "middle",
      //   nameGap: 60,
      //   nameTextStyle: {
      //     fontFamily: "Inter-SemiBold",
      //     fontWeight: 600,
      //     fontSize: "14px",
      //     color: "#121212",
      //   },
      // },
    ],
    series: [
      {
        name: "Volume",
        type: "bar",
        // data: [
        //   0.4, 1.1, 0.25, 0.1, 0.05, 0.1, 0.07, 0.02, 0, 0, 0, 0, 0, 0, 0.1,
        //   0.25, 0,
        // ],
        data:
          creatorStates.publisherDailyRecord?.map(item =>
            parseFloat(item.share_volume),
          ) || [],
        itemStyle: {
          color: "#E7E8EC",
          borderColor: "#C8C8C8",
          borderWidth: 1,
          borderRadius: [4, 4, 0, 0],
        },
      },
      // {
      //   name: "Average price",
      //   type: "line",
      //   yAxisIndex: 1,
      //   data: [
      //     0.11, 0.025, 0.01, 0.015, 0.02, 0.005, 0.006, 0.006, 0.006, 0.006,
      //     0.006, 0.006, 0.006, 0.006, 0.006, 0.02, 0.02,
      //   ],
      //   symbol: "circle",
      //   symbolSize: 11,
      //   showSymbol: false,
      //   lineStyle: {
      //     color: {
      //       type: "linear",
      //       x: 0,
      //       y: 0,
      //       x2: 1,
      //       y2: 1,
      //       colorStops: [
      //         {
      //           offset: 0,
      //           color: "#FFDB5B",
      //         },
      //         {
      //           offset: 1,
      //           color: "#FE5C02",
      //         },
      //       ],
      //     },
      //     width: 3,
      //   },
      // },
    ],
  };

  return (
    <Section width='100%' padding='32px' gap='50px'>
      {loading ? (
        <Skeleton variant='rounded' width='100%' height={391} />
      ) : (
        <EChartsReact
          style={{ width: "100%", height: "391px" }}
          echarts={appEcharts}
          option={chartOption}
        />
      )}
      <FlexRow width='100%' gap='16px' alignItems='flex-start'>
        <ShareCardSection>
          <p className='title-text'>Trades</p>
          <InfiniteScroll<PyraMarketShareActivityRes>
            className='hideScrollbar trade-activity-section'
            loadMore={(page, pageSize) =>
              dispatch(
                loadShareActivity({
                  chainId: globalStates.chainId,
                  address: creatorStates.pyraZone!.publisher!,
                  page,
                  pageSize,
                }),
              ).unwrap()
            }
            placeHolder={[...new Array(5)].map((_, idx) => (
              <div key={idx} className='activity-item'>
                <Skeleton variant='rounded' className='avatar' />
                <div className='user-name'>
                  <Skeleton width={100} />
                </div>
                <div className='activity-info'>
                  <Skeleton width={200} />
                </div>
              </div>
            ))}
            renderItem={({ dataItem: activity, idx }) => (
              <div
                key={idx}
                className='activity-item'
                style={{
                  cursor: "pointer",
                  /* ...(idx !== 0 && { marginTop: "16px" }), */
                }}
                onClick={() => navigate("/creator/" + activity.shareholder)}
              >
                <div className='avatar'>
                  <img
                    src={
                      activity.user_info?.profile_image_url ||
                      getDefaultAvatar(activity.shareholder)
                    }
                  />
                </div>
                <div className='user-name'>
                  {activity.user_info?.name ||
                    stringAbbreviation(activity.shareholder)}
                </div>
                <div className='activity-info'>
                  <span>
                    {activity.type === "Buy" ? "bought" : "sold"}{" "}
                    {activity.buy_amount || activity.sell_amount} share for{" "}
                  </span>
                  <span
                    className={activity.type === "Buy" ? "green" : "orange"}
                  >
                    {activity.buy_price || activity.sell_price}{" "}
                    {globalStates.chainCurrency}
                  </span>
                </div>
              </div>
            )}
          />
        </ShareCardSection>
        <ShareCardSection>
          <p className='title-text'>Holders</p>
          <InfiniteScroll<PyraMarketShareHolderRes>
            className='holders-section'
            loadMore={(page, pageSize) =>
              dispatch(
                loadShareHolders({
                  chainId: globalStates.chainId,
                  address: creatorStates.pyraZone!.publisher!,
                  page,
                  pageSize,
                }),
              ).unwrap()
            }
            placeHolder={[...new Array(6)].map((_, idx) => (
              <div key={idx} className='holder-item'>
                <Skeleton variant='rounded' className='avatar' />
                <div className='user-name'>
                  <Skeleton width={100} />
                </div>
              </div>
            ))}
            renderItem={({ dataItem: holder, idx }) => (
              <div
                key={idx}
                className='holder-item'
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/creator/" + holder.shareholder)}
              >
                <div className='avatar'>
                  <img
                    src={
                      holder.user_info?.profile_image_url ||
                      getDefaultAvatar(holder.shareholder)
                    }
                  />
                </div>
                <div className='user-name'>
                  {holder.user_info?.name ||
                    stringAbbreviation(holder.shareholder, 4, 4)}
                </div>
              </div>
            )}
          />
        </ShareCardSection>
      </FlexRow>
    </Section>
  );
};

const RightArrow = ({ fillColor = "white" }: { fillColor?: string }) => {
  return (
    <svg
      width='18'
      height='13'
      viewBox='0 0 18 13'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.5303 7.03033C17.8232 6.73744 17.8232 6.26256 17.5303 5.96967L12.7574 1.1967C12.4645 0.903806 11.9896 0.903806 11.6967 1.1967C11.4038 1.48959 11.4038 1.96447 11.6967 2.25736L15.9393 6.5L11.6967 10.7426C11.4038 11.0355 11.4038 11.5104 11.6967 11.8033C11.9896 12.0962 12.4645 12.0962 12.7574 11.8033L17.5303 7.03033ZM0 7.25H17V5.75H0V7.25Z'
        fill={fillColor}
      />
    </svg>
  );
};
const NewUserGuidingPage = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [creatingShare, setCreatingShare] = useState(false);
  const [creatingPyraZone, setCreatingPyraZone] = useState(false);
  const [inputNickname, setInputNickname] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File>();

  const { logout } = useAuth({ appId: process.env.PYRA_APP_ID! });
  const dispatch = useDispatch();
  const { address } = useParams<{ address?: string }>();
  const { connector, address: userAddress, pkh } = useStore();
  const globalStates = useSelector(state => state.global);
  const emptyUserInfo = useSelector(state => state.creator.emptyUserInfo);
  const emptyProfile = useSelector(state => state.creator.emptyProfile);
  const emptyPyraMarket = useSelector(state => state.creator.emptyPyraMarket);
  const emptyPyraZone = useSelector(state => state.creator.emptyPyraZone);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    disabled: !!coverImageFile,
    // Max File Size -> 2MB
    maxSize: 2 * 1024 * 1024,
    onDropRejected: fileRejections => {
      console.log({ fileRejections });
      switch (fileRejections[0].errors[0].code) {
        case DropzoneErrorCode.TooManyFiles:
          message.error(`You can only upload 1 image.`);
          break;
        case DropzoneErrorCode.FileTooLarge:
          message.error(`File size should be less than 2MB`);
          break;
        case DropzoneErrorCode.FileInvalidType:
          message.error("Invalid file type");
          break;
        default:
          message.error(
            "Upload failed: " + fileRejections[0].errors[0].message,
          );
          break;
      }
    },
  });

  useEffect(() => {
    console.log({ acceptedFiles });
    if (acceptedFiles.length > 0) {
      setCoverImageFile(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const handleBindTwitter = async () => {
    if (authenticating) {
      return;
    }
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
    if (userAddress && code && state) {
      if (authenticating) {
        return;
      }
      setAuthenticating(true);
      try {
        const userInfo = await TwitterAuth.bind({
          code,
          state,
        });
        console.log({ userInfo });
        dispatch(
          globalSlice.actions.setUserInfo({
            address: userAddress!,
            did: pkh!,
            twitter: userInfo,
          }),
        );
        message.success("Bing twitter successfully.");
        dispatch(creatorSlice.actions.setEmptyUserInfo(false));
      } catch (e: any) {
        console.warn(e);
        message.error("Bind twitter failed, please try again.");
      } finally {
        const uri = new URL(window.location.href);
        uri.searchParams.delete("code");
        uri.searchParams.delete("state");
        window.history.pushState({}, "", uri);
      }
      setAuthenticating(false);
      return;
    }
  };

  useEffect(() => {
    handleAuth();
  }, [userAddress]);

  const handleUpdateProfile = async () => {
    if (updatingProfile) {
      return;
    }
    if (!inputNickname) {
      message.error("Please input your nickname.");
      return;
    }
    if (!coverImageFile) {
      message.error("Please upload your cover image.");
      return;
    }
    setUpdatingProfile(true);
    try {
      const res = await dispatch(
        updatePublisherProfile({
          address: userAddress!,
          connector,
          profile: {
            nickname: inputNickname,
            coverImageFile,
          },
        }),
      ).unwrap();
      if (res) {
        dispatch(loadPublisherProfile({ address: userAddress! }));
        dispatch(creatorSlice.actions.setEmptyProfile(false));
        message.success("Update profile successfully.");
      } else {
        message.error("Update profile failed.");
      }
    } catch (e: any) {
      betterErrorPrompt(e, "Update profile failed");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCreateShare = async () => {
    if (creatingShare || !globalStates.userInfo?.twitter.username) {
      return;
    }
    setCreatingShare(true);
    try {
      const res = await dispatch(
        createShare({
          chainId: globalStates.chainId,
          username: globalStates.userInfo.twitter.username,
          connector,
        }),
      ).unwrap();
      if (res) {
        const { pyraZone, pyraMarket } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: userAddress!,
          }),
        ).unwrap();
        console.log("created share: ", { pyraZone, pyraMarket });
        dispatch(creatorSlice.actions.setEmptyPyraMarket(false));
        message.success("Create share successfully.");
      }
    } catch (e: any) {
      betterErrorPrompt(e, "Create share failed");
    } finally {
      setCreatingShare(false);
    }
  };

  const handleCreatePyraZone = async () => {
    if (creatingPyraZone) {
      return;
    }
    setCreatingPyraZone(true);
    try {
      const res = await dispatch(
        createPryaZone({
          chainId: globalStates.chainId,
          address: userAddress!,
          connector,
        }),
      ).unwrap();
      if (res) {
        const { pyraZone, pyraMarket } = await dispatch(
          loadPyraZone({
            chainId: globalStates.chainId,
            address: userAddress!,
          }),
        ).unwrap();
        console.log("created pyraZone: ", { pyraZone, pyraMarket });
        dispatch(creatorSlice.actions.setEmptyPyraZone(false));
        message.success("Create pyra zone successfully.");
      }
    } catch (e: any) {
      betterErrorPrompt(e, "Create pyra zone failed");
    } finally {
      setCreatingPyraZone(false);
    }
  };

  return (
    <NewUserGuidingPageContainer
      style={{ marginTop: emptyUserInfo || emptyProfile ? "133px" : "58px" }}
    >
      <Section flex='0 1 60%'>
        {emptyUserInfo ? (
          <Section className='linking-social-section'>
            <img style={{ width: "fit-content" }} src={LinkingTwitterPng} />
            <Section width='100%' gap='18px'>
              <p className='guide-title'>Link your socials</p>
              <p className='guide-desc'>
                Connect your Twitter account to verify your identity and make it
                easier for friends to discover and trade your token.
              </p>
            </Section>
            <div className='linking-card'>
              <span>Link your Twitter</span>
              <button className='primary-btn' onClick={handleBindTwitter}>
                {authenticating ? "Authenticating..." : "Link"}
                {authenticating && (
                  <img alt='loading' src={LoadingWhiteIconSvg} />
                )}
              </button>
            </div>
            <FlexRow
              flex='0 0 auto'
              gap='8px'
              className='logout'
              onClick={async () => {
                await logout();
                location.replace("/");
              }}
            >
              <span>Log out</span>
              <RightArrow fillColor='#545454' />
            </FlexRow>
          </Section>
        ) : emptyProfile ? (
          <Section className='update-profile-section'>
            <Section width='100%' gap='18px'>
              <p className='guide-title'>Enter your nickname</p>
              <TextInput type='text' onChange={setInputNickname} />
            </Section>
            <div className='upload-area' {...getRootProps()}>
              <input {...getInputProps()} />
              {coverImageFile && (
                <div className='preview-container'>
                  <div
                    className='delete-btn'
                    onClick={event => {
                      event.stopPropagation();
                      setCoverImageFile(undefined);
                    }}
                  >
                    X
                  </div>
                  <img
                    className='preview-img'
                    src={URL.createObjectURL(coverImageFile)}
                  />
                </div>
              )}
              <svg
                width='36'
                height='36'
                viewBox='0 0 36 36'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6 15C6 6.75 7.5 6 18 6C28.5 6 30 6.75 30 15'
                  stroke='#202025'
                  strokeWidth='2.25'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M18 30L18 13.5'
                  stroke='#202025'
                  strokeWidth='2.25'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M24 19.5L18 13.5L12 19.5'
                  stroke='#202025'
                  strokeWidth='2.25'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <p className='upload-text'>Upload cover image for your space</p>
              <p className='upload-tip'>image size needs to be less than 2MB</p>
            </div>
            <FlexRow width='100%' justifyContent='flex-end'>
              <button className='primary-btn' onClick={handleUpdateProfile}>
                <span>Next</span>
                {updatingProfile ? (
                  <img src={LoadingWhiteIconSvg} alt='loading' />
                ) : (
                  <RightArrow />
                )}
              </button>
            </FlexRow>
          </Section>
        ) : emptyPyraMarket ? (
          <Section className='create-share-section'>
            <Section width='100%' gap='18px'>
              <p className='guide-title'>Create your share token</p>
              <p className='guide-desc'>
                {
                  "Everyone on pyra.wtf is represented by shares. They can be bought and sold on a person's profile and their price goes up and down based on how many are currently circulating."
                }
                <br />
                {
                  "You'll earn trading fees every time yourshares are bought and sold by anyone."
                }
                <br />
                {
                  "To create your profile, buy the first share of yourself for free."
                }
              </p>
            </Section>
            <button className='primary-btn' onClick={handleCreateShare}>
              <span>Create</span>
              {creatingShare ? (
                <img src={LoadingWhiteIconSvg} alt='loading' />
              ) : (
                <RightArrow />
              )}
            </button>
          </Section>
        ) : emptyPyraZone ? (
          <Section className='create-share-section'>
            <Section width='100%' gap='18px'>
              <p className='guide-title'>Initialize your Pyra zone</p>
              <p className='guide-desc'>
                {
                  "Pyra zone is a private space to you to share contents with your loyal fans.  Zones are accessed by Key NFTs and their price goes up by a floor lifting curve."
                }
                <br />
                {
                  "You'll earn 20% income from Keys' sales. Left 80% will be divided to share holders."
                }
                <br />
                {"To create your Pyra zone, deploy your Key NFTs. "}
              </p>
            </Section>
            <button className='primary-btn' onClick={handleCreatePyraZone}>
              <span>Initialize</span>
              {creatingPyraZone ? (
                <img src={LoadingWhiteIconSvg} alt='loading' />
              ) : (
                <RightArrow />
              )}
            </button>
          </Section>
        ) : null}
      </Section>
    </NewUserGuidingPageContainer>
  );
};
