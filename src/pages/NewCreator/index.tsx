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
import { TabButtons } from "@/components/TabButtons";
import {
  createPryaZone,
  creatorSlice,
  loadCreatorBaseInfos,
  loadCreatorContents,
  loadCreatorShareInfos,
  loadCreatorUserInfo,
  loadPyraZone,
  unlockCreatorContents,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Divider, FlexRow, GridWrap, Section } from "@/styled";
import { buildSortedItems, stringAbbreviation, stringToColor } from "@/utils";

export const NewCreator: React.FC = () => {
  const tabs: Array<"Share" | "Content"> = ["Share", "Content"];
  const [selectedTab, setSelectedTab] = useState(tabs[1]);
  const [tradeKeyLoading, setTradeKeyLoading] = useState(false);
  const [creatingPyraZone, setCreatingPyraZone] = useState(false);

  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const { connector, address: userAddress } = useStore();

  return (
    <CreatorWrapper>
      <BannerContainer>
        <img className='banner-img' src={DefaultBannerPng} />
        <div className='banner-section'>
          <div className='user-base-info'>
            <img className='user-avatar' src={DefaultAvatarPng} />
            <p className='title-text'>Lil Pudgys</p>
            <p className='desc-text'>ThelglooCompany</p>
          </div>
          <div className='user-extra-info'>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>67,359 ETH</p>
              <p className='desc-text'>Total volume</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>1.138 ETH</p>
              <p className='desc-text'>Floor price</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>1.086 WETH</p>
              <p className='desc-text'>Best offer</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>2%</p>
              <p className='desc-text'>Listed</p>
            </div>
            <div className='user-extra-info-item'>
              <p className='sub-title-text'>8,050 (37%)</p>
              <p className='desc-text'>Owners (Unique)</p>
            </div>
          </div>
        </div>
      </BannerContainer>
      <FlexRow
        width='100%'
        alignItems='flex-start'
        justifyContent='space-between'
        padding='26px 32px'
      >
        <ContentInfoContainer>
          <p className='content-desc'>
            Lil Pudgys is a collection of 22,222 NFTs originating from Pudgy ...
          </p>
          <p className='item-desc'>
            {[
              {
                title: "Items",
                data: "21.6K",
              },
              {
                title: "Created",
                data: "Dec 2021",
              },
              {
                title: "Creator earnings",
                data: "5%",
              },
              {
                title: "Chain",
                data: "Ethereum",
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
            21,636 results
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
          <FilesContentSection files={[...new Array(10)]} foldItems />
        </MainContentContainer>
      </Section>
    </CreatorWrapper>
  );
};

const FilesContentSection = ({
  files,
  foldItems,
}: {
  files: any[];
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
              // await FileInfoModal.open({ file });
            }}
          >
            <div className='preview' style={{ background: "#000000" }}></div>
            <div className='file-info'>
              <p>Lil Pudgy #10731</p>
              <p style={{ marginTop: "15px" }}>1.138 ETH</p>
              <p style={{ marginTop: "9px" }} className='grey'>
                Last sale: 1.1 ETH
              </p>
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
