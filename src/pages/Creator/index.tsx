import React, { useEffect, useRef, useState } from "react";

import {
  Avatar,
  Banner,
  BlackButton,
  ContentSectionWrap,
  CreatorWrapper,
  FinderContainer,
  UserInfo,
} from "./styled";

import CopyIconSvg from "@/assets/icons/copy.svg";
import DownArrowIconSvg from "@/assets/icons/down-arrow.svg";
import EditIconSvg from "@/assets/icons/edit.svg";
import SortIconSvg from "@/assets/icons/sort.svg";
import TwitterIconSvg from "@/assets/icons/twitter.svg";
import DefaultAvatarPng from "@/assets/images/default-avatar.png";
import DefaultBannerPng from "@/assets/images/default-banner.png";
import { TabButtons } from "@/components/TabButtons";
import { FlexRow, GridWrap, Section } from "@/styled";

export const Creator: React.FC = () => {
  const tabs = ["Share", "Content"];
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
            <FlexRow gap='11px'>
              <span>0x65...00f1</span>
              <img src={CopyIconSvg} alt='Copy' style={{ cursor: "pointer" }} />
            </FlexRow>
          </FlexRow>
          <FlexRow className='financial-info' gap='48px'>
            <div className='data-item'>
              <span className='item-value'>$2587.29</span>
              <span className='item-title'>Total value</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>213</span>
              <span className='item-title'>Share holders</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>0.081 ETH</span>
              <span className='item-title'>Key price</span>
            </div>
            <div className='data-item'>
              <span className='item-value'>420/800</span>
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
        <TabButtons tabs={tabs} style={{ zIndex: "10" }} />
        <FinderContainer width='100%' style={{ marginTop: "-49px" }}>
          <FlexRow className='tool-bar'>
            <img style={{ cursor: "pointer" }} src={SortIconSvg} alt='Sort' />
            <FlexRow gap='14px' flex='0 0 auto' style={{ cursor: "pointer" }}>
              <span>All</span>
              <img src={DownArrowIconSvg} alt='Down arrow' />
            </FlexRow>
          </FlexRow>
          <Section className='inner-container'>
            <Section className='date-sorted-section'>
              <p className='date-text'>Today</p>
              <ContentSection />
            </Section>
            <Section className='date-sorted-section'>
              <p className='date-text'>This week</p>
              <ContentSection />
            </Section>
          </Section>
        </FinderContainer>
      </Section>
    </CreatorWrapper>
  );
};

const ContentSection: React.FC = () => {
  const itemCount = 10;
  const minColumnGap = 32;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardItemRef = useRef<HTMLDivElement>(null);
  const [columnGap, setColumnGap] = useState(minColumnGap);
  const [rowGap, setRowGap] = useState(minColumnGap * 1.7);

  const handleResize = () => {
    if (sectionRef.current && cardItemRef.current) {
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
    >
      {[...new Array(itemCount)].map((_, idx) => {
        return (
          <div
            className='file-card'
            key={idx}
            ref={idx === 0 ? cardItemRef : undefined}
          >
            <div className='preview' style={{ background: "#81ffb7" }}></div>
            <p className='file-name'>File Name</p>
          </div>
        );
      })}
    </ContentSectionWrap>
  );
};
