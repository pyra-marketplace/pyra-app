import React, { useEffect, useRef, useState } from "react";

import { Media, message } from "@meteor-web3/components";
import { MirrorFile } from "@meteor-web3/connector";
import { useStore } from "@meteor-web3/hooks";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Banner,
  BlackButton,
  ContentSectionWrap,
  CreatorWrapper,
  DateSortedSectionWrap,
  FinderContainer,
  UserInfo,
} from "./styled";

import CopyIconSvg from "@/assets/icons/copy.svg";
import DoubleDownArrowIconSvg from "@/assets/icons/double-down-arrow.svg";
import DownArrowIconSvg from "@/assets/icons/down-arrow.svg";
import EditIconSvg from "@/assets/icons/edit.svg";
import SortIconSvg from "@/assets/icons/sort.svg";
import TwitterIconSvg from "@/assets/icons/twitter.svg";
import DefaultAvatarPng from "@/assets/images/default-avatar.png";
import DefaultBannerPng from "@/assets/images/default-banner.png";
import { TabButtons } from "@/components/TabButtons";
import {
  checkOrCreatePryaZone,
  loadCreatorBaseInfos,
  loadCreatorContents,
  loadCreatorShareInfos,
} from "@/state/createor/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { FlexRow, GridWrap, Section } from "@/styled";
import { buildSortedItems, stringAbbreviation } from "@/utils";

export const Creator: React.FC = () => {
  const tabs: Array<"Share" | "Content"> = ["Share", "Content"];
  const [selectedTab, setSelectedTab] = useState(tabs[1]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const creatorStates = useSelector(state => state.creator);
  const { connector, address } = useStore();

  useEffect(() => {
    if (!address || globalStates.autoConnecting) return;
    init();
  }, [address, globalStates.autoConnecting]);

  useEffect(() => {
    if (!address || globalStates.autoConnecting) return;
    if (selectedTab === "Content") {
      if (!creatorStates.pyraZone) return;
      dispatch(
        loadCreatorContents({
          chainId: globalStates.chainId,
          assetId: creatorStates.pyraZone.asset_id,
          connector,
        }),
      )
        .unwrap()
        .then(console.log);
    } else {
      dispatch(
        loadCreatorShareInfos({
          chainId: globalStates.chainId,
          address: address!,
          connector,
        }),
      )
        .unwrap()
        .then(console.log);
    }
  }, [
    selectedTab,
    creatorStates.pyraZone,
    address,
    globalStates.autoConnecting,
  ]);

  const init = async () => {
    if ((await connector.getCurrentWallet()) === undefined) {
      navigate("/");
      return;
    }
    const pyraZone = await dispatch(
      checkOrCreatePryaZone({
        chainId: globalStates.chainId,
        address: address!,
        connector,
      }),
    ).unwrap();
    const baseInfos = await dispatch(
      loadCreatorBaseInfos({
        chainId: globalStates.chainId,
        address: address!,
        assetId: pyraZone.asset_id,
        connector,
      }),
    ).unwrap();
    console.log({ pyraZone, baseInfos });
  };

  return (
    <CreatorWrapper gap='97px'>
      <Section width='100%' alignItems='center'>
        <Banner>
          <img className='banner-img' src={DefaultBannerPng} />
          <div className='edit-btn'>
            <img src={EditIconSvg} alt='Edit' />
          </div>
        </Banner>
        <Avatar style={{ marginTop: "-99.5px", marginBottom: "11px" }}>
          <img className='user-img' src={DefaultAvatarPng} />
        </Avatar>
        <UserInfo width='100%' alignItems='center' gap='24px'>
          <div className='user-name'>Cathy</div>
          <FlexRow className='account-info' gap='11px'>
            <FlexRow gap='11px'>
              <img src={TwitterIconSvg} alt='Twitter' />
              <span>@0xcathy</span>
            </FlexRow>
            <hr className='divider' />
            <FlexRow
              gap='11px'
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigator.clipboard.writeText(address || "");
                message.success("Address copied");
              }}
            >
              <span>{address && stringAbbreviation(address, 4, 4)}</span>
              <img src={CopyIconSvg} alt='Copy' />
            </FlexRow>
          </FlexRow>
          <FlexRow className='financial-info' gap='48px'>
            <div className='data-item'>
              <span className='item-value'>
                ${ethers.utils.formatEther(creatorStates.shareBuyPrice || 0)}
              </span>
              <span className='item-title'>Total value</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>
                {creatorStates.shareHolders?.length || 0}
              </span>
              <span className='item-title'>Share holders</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>
                {ethers.utils.formatEther(creatorStates.tierKeyBuyPrice || 0)}{" "}
                ETH
              </span>
              <span className='item-title'>Key price</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>
                {creatorStates.pyraZone?.tierkey_sales}
              </span>
              <span className='item-title'>Key sales</span>
            </div>
          </FlexRow>
        </UserInfo>
        <FlexRow gap='21px' style={{ marginTop: "40px" }}>
          <BlackButton>Trade share</BlackButton>
          <BlackButton>Trade key</BlackButton>
        </FlexRow>
      </Section>
      <Section width='100%' alignItems='center'>
        <TabButtons
          tabs={tabs}
          controlledSelectedTab={selectedTab}
          onChange={(tab: any) => setSelectedTab(tab)}
          style={{ zIndex: "10" }}
        />
        {selectedTab === "Content" && <FinderContentSection />}
      </Section>
    </CreatorWrapper>
  );
};

const FinderContentSection = () => {
  const fileRecord = useSelector(state => state.creator.contentFiles);
  const sortedFiles = buildSortedItems(
    Object.values(fileRecord || {}),
    file => new Date(file.content.updatedAt),
  );

  return (
    <FinderContainer width='100%' style={{ marginTop: "-49px" }}>
      <FlexRow className='tool-bar'>
        <img style={{ cursor: "pointer" }} src={SortIconSvg} alt='Sort' />
        <FlexRow gap='14px' flex='0 0 auto' style={{ cursor: "pointer" }}>
          <span>All</span>
          <img src={DownArrowIconSvg} alt='Down arrow' />
        </FlexRow>
      </FlexRow>
      <Section className='inner-container'>
        {sortedFiles.map(({ title, items }, idx) => {
          if (items.length > 0) {
            return (
              <DateSortedSection files={items} dateText={title} key={idx} />
            );
          }
        })}
      </Section>
    </FinderContainer>
  );
};

const DateSortedSection = ({
  files,
  dateText,
}: {
  files: MirrorFile[];
  dateText: string;
}) => {
  const [folded, setFolded] = useState(true);

  return (
    <DateSortedSectionWrap>
      <FlexRow width='100%' justifyContent='space-between'>
        <p className='date-text'>{dateText}</p>
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
        const columnGap =
          (sectionWidth - cardItemWidth * columnCount - 1) / (columnCount - 1);
        const rowGap = columnGap * 1.7;
        setColumnGap(columnGap);
        setRowGap(rowGap > 100 ? 100 : rowGap);
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
          >
            <div className='preview' style={{ background: "#81ffb7" }}>
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
