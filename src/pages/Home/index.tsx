import React, { useEffect, useRef, useState } from "react";

import { useStore } from "@meteor-web3/hooks";
import { CircularProgress } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";

import {
  HomeWrapper,
  BigRightArrow,
  ScrollableSection,
  ProgressBar,
  Title,
  Description,
  Text,
  LinkButton,
  WhiteButton,
  RoundArrowButton,
  TableWrap,
  TopTabButtons,
  HightLightCardText,
  PlainButton,
  SpotLightText,
  SpotLightCardText,
  SpotLightContentSectionWrap,
} from "./styled";

import PlaceholderSvg from "@/assets/icons/placeholder.svg";
import FeaturedNftPng from "@/assets/images/featured-nft.png";
import { TabButtons } from "@/components/TabButtons";
import {
  TrendingPyraZone,
  homeSlice,
  loadTrendingPyraZones,
} from "@/state/home/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section, FlexRow, RoundCard, AbsoluteSection } from "@/styled";
import { stringAbbreviation } from "@/utils";

export const Home: React.FC = () => {
  return (
    <HomeWrapper>
      <TopSection />
      <CreatorSection />
      <SpotLightSection />
    </HomeWrapper>
  );
};

const TopSection: React.FC = () => {
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

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
        left: to,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section
      background='linear-gradient(180deg, #423160 0%, #6D6084 40%, #FFFFFF 91.5%);'
      padding='94px 32px 0px'
      gap='32px'
    >
      <TopTabButtons>
        {[
          "All",
          "Art",
          "Gaming",
          "Memberships",
          "PFPs",
          "Photography",
          "Music",
        ].map((item, idx) => {
          return (
            <div className='tab-button' key={idx}>
              {item}
            </div>
          );
        })}
      </TopTabButtons>
      <Section width='100%' relative>
        <ScrollableSection
          className='hideScrollbar'
          width='100%'
          gap='16px'
          flexDirection='row'
          ref={scrollSectionRef}
        >
          <div
            className='left-arrow-btn'
            onClick={() => !hideLeftArrow && handleScroll(-800)}
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
            onClick={() => !hideRightArrow && handleScroll(800)}
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
          <HightLightCard />
          <HightLightCard />
          <HightLightCard />
          <HightLightCard />
          <HightLightCard />
          <HightLightCard />
        </ScrollableSection>
      </Section>
    </Section>
  );
};

const HightLightCard: React.FC = () => {
  return (
    <Section relative width='332px' height='332px'>
      <RoundCard
        width='332px'
        height='332px'
        borderRadius='12px'
        background='#6C70C7'
      ></RoundCard>
      <AbsoluteSection left='0px' bottom='0px' gap='7px' padding='15px'>
        <FlexRow width='100%'>
          <HightLightCardText bold>ZenAcademy</HightLightCardText>
        </FlexRow>
        <FlexRow width='100%'>
          <HightLightCardText>Floor: 0.09 ETH</HightLightCardText>
        </FlexRow>
      </AbsoluteSection>
    </Section>
  );
};

const HighLightSection: React.FC = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  return (
    <Section gap='80px' padding='80px 0px'>
      <FlexRow padding='0px 80px' justifyContent='space-between' width='100%'>
        <Title dark>
          Highlight
          <br />
          collections.
        </Title>
        <FlexRow gap='12px' flex='0 0 auto'>
          <RoundArrowButton
            onClick={() => {
              if (scrollSectionRef.current) {
                scrollSectionRef.current.scroll({
                  left: -800,
                  behavior: "smooth",
                });
              }
            }}
          >
            <svg
              width='19'
              height='16'
              viewBox='0 0 19 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8.7071 13.7929C9.0976 14.1834 9.0976 14.8166 8.7071 15.2071C8.3166 15.5976 7.6834 15.5976 7.2929 15.2071L1.5 9.4142C0.719 8.6332 0.719 7.3668 1.5 6.5858L7.2929 0.79289C7.6834 0.40237 8.3166 0.40237 8.7071 0.79289C9.0976 1.18342 9.0976 1.81658 8.7071 2.20711L3.9142 7H18C18.5523 7 19 7.4477 19 8C19 8.5523 18.5523 9 18 9H3.9142L8.7071 13.7929Z'
                fill='#202025'
              />
            </svg>
          </RoundArrowButton>
          <RoundArrowButton
            dark
            onClick={() => {
              if (scrollSectionRef.current) {
                scrollSectionRef.current.scroll({
                  left: 800,
                  behavior: "smooth",
                });
              }
            }}
          >
            <svg
              width='19'
              height='16'
              viewBox='0 0 19 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.2929 13.7929C9.9024 14.1834 9.9024 14.8166 10.2929 15.2071C10.6834 15.5976 11.3166 15.5976 11.7071 15.2071L17.5 9.4142C18.281 8.6332 18.281 7.3668 17.5 6.5858L11.7071 0.79289C11.3166 0.40237 10.6834 0.40237 10.2929 0.79289C9.9024 1.18342 9.9024 1.81658 10.2929 2.20711L15.0858 7H1C0.44772 7 0 7.4477 0 8C0 8.5523 0.44772 9 1 9H15.0858L10.2929 13.7929Z'
                fill='#F7FBFA'
              />
            </svg>
          </RoundArrowButton>
        </FlexRow>
      </FlexRow>
      <ScrollableSection
        // className='hideScrollbar'
        width='100%'
        padding='0px 80px'
        gap='40px'
        flexDirection='row'
        ref={scrollSectionRef}
        onScroll={event => {
          // console.log({ scrollLeft: event.currentTarget.scrollLeft });
          const progress =
            event.currentTarget.scrollLeft /
            (event.currentTarget.scrollWidth - event.currentTarget.clientWidth);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `translateX(${
              ((progressContainerRef.current?.clientWidth || 0) -
                progressBarRef.current.clientWidth) *
              progress
            }px)`;
          }
        }}
      >
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
      </ScrollableSection>
      <FlexRow width='100%' justifyContent='center'>
        <ProgressBar ref={progressRef}>
          <div className='bar-container' ref={progressContainerRef}>
            <motion.div
              className='bar'
              // drag='x'
              dragConstraints={progressContainerRef}
              dragMomentum={false}
              dragElastic={0}
              ref={progressBarRef}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onDrag={_ => {
                if (
                  progressRef.current &&
                  progressContainerRef.current &&
                  progressBarRef.current
                ) {
                  const barOffset =
                    Number(
                      progressBarRef.current.style.transform.replace(
                        /.*translateX\(([0-9|.]*)px\).*/,
                        "$1",
                      ),
                    ) || 0;
                  const progressPercent =
                    barOffset /
                    (progressContainerRef.current.clientWidth -
                      progressBarRef.current.clientWidth);
                  // console.log({ progressPercent });
                  if (scrollSectionRef.current) {
                    scrollSectionRef.current.scrollTo({
                      left:
                        (scrollSectionRef.current.scrollWidth -
                          scrollSectionRef.current.clientWidth) *
                        progressPercent,
                      behavior: "smooth",
                    });
                  }
                }
              }}
            />
          </div>
        </ProgressBar>
      </FlexRow>
    </Section>
  );
};

const CollectionCard: React.FC = () => {
  return (
    <Section gap='24px' width='400px'>
      <Section gap='8px'>
        <RoundCard width='400px' height='400px'></RoundCard>
        <FlexRow gap='8px'>
          <RoundCard width='128px' height='128px'></RoundCard>
          <RoundCard width='128px' height='128px'></RoundCard>
          <RoundCard width='128px' height='128px'></RoundCard>
        </FlexRow>
      </Section>
      <Section width='100%' gap='4px'>
        <FlexRow
          width='100%'
          alignItems='flex-end'
          justifyContent='space-between'
        >
          <FlexRow gap='15px'>
            <RoundCard
              width='32px'
              height='32px'
              borderRadius='120px'
            ></RoundCard>
            <Text>Ate-a-pi</Text>
          </FlexRow>
          <Text color='#686A6C'>$1385.77</Text>
        </FlexRow>
        <FlexRow width='100%' justifyContent='space-between'>
          <Text>312 files</Text>
          <Text>0.12 ETH/key</Text>
        </FlexRow>
      </Section>
    </Section>
  );
};

const CreatorSection: React.FC = () => {
  const TOTAL_ITEM_LIMIT = 5;
  const trendingPyraZones = useSelector(state => state.home.trendingPyraZones);
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const { connector } = useStore();

  const tabs: Array<"Trending" | "Top" | "Recent"> = [
    "Trending",
    "Top",
    "Recent",
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [hasMorePage, setHasMorePage] = useState(true);
  const [nowLoadingPage, setNowLoadingPage] = useState(1);

  useEffect(() => {
    dispatch(homeSlice.actions.clearTrendingPyraZones());
    setNowLoadingPage(1);
    setHasMorePage(true);
  }, [selectedTab]);

  useEffect(() => {
    handleLoadTrendingPyraZones(nowLoadingPage);
  }, [selectedTab, nowLoadingPage]);

  const handleLoadTrendingPyraZones = async (
    page: number,
    pageSize: number = 5,
  ) => {
    const trendingPyraZones = await dispatch(
      loadTrendingPyraZones({
        chainId: globalStates.chainId,
        connector,
        orderBy:
          selectedTab === "Top"
            ? "tierkey_sales"
            : selectedTab === "Recent"
              ? "block_number"
              : undefined,
        orderType: "desc",
        page,
        pageSize,
      }),
    ).unwrap();
    if (
      trendingPyraZones.length < pageSize ||
      page * pageSize >= TOTAL_ITEM_LIMIT
    ) {
      setHasMorePage(false);
    } else {
      setHasMorePage(true);
    }
    console.log({ page, pageSize, trendingPyraZones });
  };

  return (
    <Section
      padding='40px 31px'
      gap='80px'
      width='100%'
      // style={{ marginTop: "-87px" }}
    >
      <Section width='100%'>
        <FlexRow width='100%' justifyContent='space-between'>
          <TabButtons
            tabs={tabs}
            controlledSelectedTab={selectedTab}
            onChange={tab => setSelectedTab(tab as any)}
          />
          <FlexRow flex='0 0 auto' gap='15px'>
            <PlainButton style={{ alignItems: "flex-start" }}>
              <span>All chains</span>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clipPath='url(#clip0_3126_200)'>
                  <path
                    d='M13 7L8 12L3 7'
                    stroke='#121212'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_3126_200'>
                    <rect width='16' height='16' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </PlainButton>
            <PlainButton>View all</PlainButton>
          </FlexRow>
        </FlexRow>
        <TableWrap>
          <div className='table-container hideScrollbar'>
            <div className='table-header'>
              <div className='table-item'>Rank</div>
              <div className='table-item'>Collection</div>
              <div className='table-item'>Total Volumn</div>
              <div className='table-item'>Holders</div>
              <div className='table-item'>Files num</div>
              <div className='table-item'>Key price</div>
              <div className='table-item'>Key sales</div>
              {/* <div className='table-item'>Watchlists</div> */}
            </div>
            <InfiniteScroll
              dataLength={trendingPyraZones?.length || 0}
              next={() => setNowLoadingPage(prev => prev + 1)}
              hasMore={hasMorePage}
              loader={
                <div className='loading'>
                  <CircularProgress color='inherit' />
                </div>
              }
            >
              {trendingPyraZones &&
                trendingPyraZones.map((item, index) => {
                  return (
                    <CreatorTableItem
                      trendingPyraZone={item}
                      key={index}
                      idx={index + 1}
                    />
                  );
                })}
              {(!trendingPyraZones ||
                (trendingPyraZones.length === 0 && !hasMorePage)) && (
                <div className='loading'>
                  <CircularProgress color='inherit' />
                </div>
              )}
            </InfiniteScroll>
          </div>
        </TableWrap>
      </Section>
    </Section>
  );
};

const CreatorTableItem = ({
  trendingPyraZone,
  idx,
}: {
  trendingPyraZone: TrendingPyraZone;
  idx: number;
}) => {
  const navigate = useNavigate();
  const chainCurrency = useSelector(state => state.global.chainCurrency);
  const ethPrice = useSelector(state => state.global.ethPrice);

  return (
    <div className='table-row'>
      <div className='table-item'>{idx}</div>
      <div className='table-item'>
        <FlexRow
          gap='25px'
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/creator/" + trendingPyraZone.publisher)}
        >
          <div className='avatar'>
            {trendingPyraZone.user_info?.profile_image_url && (
              <img src={trendingPyraZone.user_info.profile_image_url} />
            )}
          </div>
          <span>
            {trendingPyraZone.user_info?.name ||
              stringAbbreviation(trendingPyraZone.publisher, 4, 4)}
          </span>
        </FlexRow>
      </div>
      <div className='table-item'>
        $
        {ethPrice && trendingPyraZone.total_volume
          ? (parseFloat(trendingPyraZone.total_volume) * ethPrice).toFixed(4)
          : "0.0"}
      </div>
      <div className='table-item'>{trendingPyraZone.share_holders}</div>
      <div className='table-item'>{trendingPyraZone.files_count}</div>
      <div className='table-item'>
        {trendingPyraZone.tierkey_price} {chainCurrency}
      </div>
      <div className='table-item'>{trendingPyraZone.tierkey_sales}</div>
      {/* <div className='table-item'>{trendingPyraZone.watch_lists}</div> */}
    </div>
  );
};

const SpotLightSection: React.FC = () => {
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

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
        left: to,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section width='100%' padding='10px 32px' gap='24px'>
      <SpotLightText>Memberships spotlight</SpotLightText>
      {/* <Section width='100%' relative>
        <ScrollableSection
          className='hideScrollbar'
          width='100%'
          gap='16px'
          flexDirection='row'
          darkBackground
          style={{ overflowY: "visible" }}
          ref={scrollSectionRef}
        >
          <div
            className='left-arrow-btn'
            onClick={() => !hideLeftArrow && handleScroll(-800)}
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
                stroke='black'
                strokeWidth='3'
                strokeLinecap='square'
              />
            </svg>
          </div>
          <div
            className='right-arrow-btn'
            onClick={() => !hideRightArrow && handleScroll(800)}
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
                stroke='black'
                strokeWidth='3'
                strokeLinecap='square'
              />
            </svg>
          </div>
          <SpotLightCard />
          <SpotLightCard />
          <SpotLightCard />
          <SpotLightCard />
          <SpotLightCard />
          <SpotLightCard />
        </ScrollableSection>
      </Section> */}
      <SpotLightContentSection data={[...new Array(10)]} foldItems />
    </Section>
  );
};

const SpotLightContentSection = ({
  data,
  foldItems,
}: {
  data: any[];
  foldItems?: boolean;
}) => {
  const itemCount = data.length;
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
    <SpotLightContentSectionWrap
      ref={sectionRef}
      onResize={handleResize}
      rowGap={`${rowGap}px`}
      columnGap={`${columnGap}px`}
      foldItems={foldItems}
      lineHeight={lineHeight}
    >
      {data.map((item, idx) => {
        return (
          <div
            className='content-card'
            key={idx}
            ref={idx === 0 ? cardItemRef : undefined}
            onClick={async () => {}}
          >
            {/* <div className='preview' style={{ background: "#000000" }}>
              <Media
                mediaUrl={file.content.resources[0]}
                mediaMimeType={"image/png"}
              />
            </div>
            <p className='file-name'>{file.content.title}</p> */}
            <SpotLightCard />
          </div>
        );
      })}
    </SpotLightContentSectionWrap>
  );
};

const SpotLightCard: React.FC = () => {
  return (
    <Section width='264px' height='289px'>
      <RoundCard
        width='264px'
        height='289px'
        borderRadius='13px'
        background='#ffffff'
        style={{ boxShadow: "1px 2px 18.700000762939453px 0px #0000001A" }}
      >
        <RoundCard
          width='100%'
          height='176px'
          borderRadius='13px 13px 0px 0px'
        ></RoundCard>
        <Section width='100%' padding='18px 16px' gap='18px'>
          <SpotLightCardText>ETHJETS</SpotLightCardText>
          <FlexRow width='100%'>
            <Section gap='4px'>
              <SpotLightCardText small>Floor</SpotLightCardText>
              <SpotLightCardText>0.17 ETH</SpotLightCardText>
            </Section>
            <Section gap='4px'>
              <SpotLightCardText small>7 day volume</SpotLightCardText>
              <SpotLightCardText>0 ETH</SpotLightCardText>
            </Section>
          </FlexRow>
        </Section>
      </RoundCard>
    </Section>
  );
};
