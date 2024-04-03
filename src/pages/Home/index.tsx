import React, { useEffect, useRef, useState } from "react";

import { useStore } from "@meteor-web3/hooks";
import { CircularProgress } from "@mui/material";
import { PyraMarketRes, PyraZoneRes } from "@pyra-marketplace/pyra-sdk";
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
import DefaultCardRectanglePng from "@/assets/images/default-card-rectangle.png";
import DefaultCardSquarePng from "@/assets/images/default-card-square.png";
import FeaturedNftPng from "@/assets/images/featured-nft.png";
import { TabButtons } from "@/components/TabButtons";
import {
  homeSlice,
  loadHomeData,
  loadTableData,
  // loadTrendingPyraZones,
} from "@/state/home/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section, FlexRow, RoundCard, AbsoluteSection } from "@/styled";
import { getDefaultAvatar, stringAbbreviation } from "@/utils";

export const Home: React.FC = () => {
  const globalStates = useSelector(state => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      loadHomeData({
        chainId: globalStates.chainId,
      }),
    );
  }, []);

  return (
    <HomeWrapper>
      <TopSection />
      <CreatorSection />
      <SpotLightSection />
    </HomeWrapper>
  );
};

const TopSection: React.FC = () => {
  const trendingPyraMarkets = useSelector(
    state => state.home.trendingPyraMarkets,
  );
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
      {/* <TopTabButtons>
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
      </TopTabButtons> */}
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
          {trendingPyraMarkets?.map((item, idx) => {
            return <HighLightCard key={idx} dataItem={item} />;
          })}
          {!trendingPyraMarkets &&
            [...new Array(10)].map((_, idx) => <HighLightCard key={idx} />)}
        </ScrollableSection>
      </Section>
    </Section>
  );
};

const HighLightCard = ({ dataItem }: { dataItem?: PyraMarketRes }) => {
  const navigate = useNavigate();
  const chainCurrency = useSelector(state => state.global.chainCurrency);

  return (
    <Section
      relative
      width='332px'
      height='332px'
      flex='0 0 auto'
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/creator/" + dataItem?.publisher)}
    >
      <RoundCard
        width='332px'
        height='332px'
        borderRadius='12px'
        background='#6C70C7'
      >
        <img
          src={
            dataItem?.publisher_profile?.cover_image_url || DefaultCardSquarePng
          }
        />
      </RoundCard>
      <AbsoluteSection left='0px' bottom='0px' gap='7px' padding='15px'>
        <FlexRow width='100%'>
          <HightLightCardText bold>
            {dataItem?.publisher_profile?.user_info?.name ||
              stringAbbreviation(dataItem?.publisher) ||
              "loading..."}
          </HightLightCardText>
        </FlexRow>
        {dataItem && (
          <>
            <FlexRow width='100%'>
              <HightLightCardText>
                Total value:{" "}
                {parseFloat(dataItem.total_value)
                  ? parseFloat(dataItem.total_value).toFixed(8)
                  : "0.0"}{" "}
                {chainCurrency}
              </HightLightCardText>
            </FlexRow>
          </>
        )}
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
  const TOTAL_ITEM_LIMIT = 10;
  const tableData = useSelector(state => state.home.tableData);
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
    dispatch(homeSlice.actions.clearTableData());
    setNowLoadingPage(1);
    setHasMorePage(true);
  }, [selectedTab]);

  useEffect(() => {
    handleLoadTableData(nowLoadingPage);
  }, [selectedTab, nowLoadingPage]);

  const handleLoadTableData = async (page: number, pageSize: number = 10) => {
    const tableData = await dispatch(
      loadTableData({
        chainId: globalStates.chainId,
        connector,
        type: selectedTab,
      }),
    ).unwrap();
    if (tableData.length < pageSize || page * pageSize >= TOTAL_ITEM_LIMIT) {
      setHasMorePage(false);
    } else {
      setHasMorePage(true);
    }
    console.log({ page, pageSize, tableData });
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
              <div className='table-item'>#</div>
              <div className='table-item'>Zone</div>
              <div className='table-item'>Share volume</div>
              <div className='table-item'>Share value</div>
              <div className='table-item'>Share supply</div>
              <div className='table-item'>Share sales</div>
              {/* <div className='table-item'>Watchlists</div> */}
            </div>
            <InfiniteScroll
              dataLength={tableData?.length || 0}
              next={() => setNowLoadingPage(prev => prev + 1)}
              hasMore={hasMorePage}
              loader={
                <div className='loading'>
                  <CircularProgress color='inherit' />
                </div>
              }
            >
              {tableData &&
                tableData.map((item, index) => {
                  return (
                    <CreatorTableItem
                      tableDataItem={item}
                      key={index}
                      idx={index + 1}
                    />
                  );
                })}
              {(!tableData || (tableData.length === 0 && !hasMorePage)) && (
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
  tableDataItem,
  idx,
}: {
  tableDataItem: PyraMarketRes;
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
          onClick={() => navigate("/creator/" + tableDataItem.publisher)}
        >
          <div className='avatar'>
            <img
              src={
                tableDataItem.publisher_profile?.user_info?.profile_image_url ||
                getDefaultAvatar(tableDataItem.publisher)
              }
            />
          </div>
          <span>
            {tableDataItem.publisher_profile?.user_info?.name ||
              stringAbbreviation(tableDataItem.publisher, 4, 4)}
          </span>
        </FlexRow>
      </div>
      <div className='table-item'>
        {parseFloat(tableDataItem.total_volume)
          ? parseFloat(tableDataItem.total_volume).toFixed(8)
          : "0.0"}{" "}
        {chainCurrency}
      </div>
      <div className='table-item'>
        {parseFloat(tableDataItem.total_value)
          ? parseFloat(tableDataItem.total_value).toFixed(8)
          : "0.0"}{" "}
        {chainCurrency}
      </div>
      <div className='table-item'>{tableDataItem.total_supply}</div>
      <div className='table-item'>{tableDataItem.share_sales}</div>
      {/* <div className='table-item'>
        {tableDataItem.tierkey_price
          ? parseFloat(tableDataItem.tierkey_price).toFixed(8)
          : "0.0"}{" "}
        {chainCurrency}
      </div>
      <div className='table-item'>{tableDataItem.tierkey_sales}</div> */}
      {/* <div className='table-item'>{tableDataItem.watch_lists}</div> */}
    </div>
  );
};

const SpotLightSection: React.FC = () => {
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  const popularPyraZones = useSelector(state => state.home.popularPyraZones);
  const trendingPyraZones = useSelector(state => state.home.trendingPyraZones);

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
    <>
      <Section width='100%' padding='10px 32px' gap='24px'>
        <SpotLightText>Most popular zones</SpotLightText>
        <SpotLightContentSection
          data={popularPyraZones || [...new Array(10)]}
          foldItems
        />
      </Section>
      <Section width='100%' padding='10px 32px' gap='24px'>
        <SpotLightText>Trending zones</SpotLightText>
        <SpotLightContentSection
          data={trendingPyraZones || [...new Array(10)]}
          foldItems
        />
      </Section>
    </>
  );
};

const SpotLightContentSection = ({
  data,
  foldItems,
}: {
  data: PyraZoneRes[] | undefined[];
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
            <SpotLightCard dataItem={item} />
          </div>
        );
      })}
    </SpotLightContentSectionWrap>
  );
};

const SpotLightCard = ({ dataItem }: { dataItem?: PyraZoneRes }) => {
  const navigate = useNavigate();
  const chainCurrency = useSelector(state => state.global.chainCurrency);

  return (
    <Section
      width='264px'
      height='289px'
      onClick={() => navigate("/creator/" + dataItem?.publisher)}
    >
      <RoundCard
        width='264px'
        height='289px'
        borderRadius='13px'
        background='#ffffff'
        style={{ boxShadow: "1px 2px 18.700000762939453px 0px #0000001A" }}
      >
        <RoundCard width='100%' height='176px' borderRadius='13px 13px 0px 0px'>
          <img
            src={
              dataItem?.publisher_profile?.cover_image_url ||
              DefaultCardRectanglePng
            }
          />
        </RoundCard>
        <Section width='100%' padding='18px 16px' gap='18px'>
          <SpotLightCardText>
            {dataItem?.publisher_profile?.user_info?.name ||
              stringAbbreviation(dataItem?.publisher) ||
              "loading..."}
          </SpotLightCardText>
          <FlexRow width='100%'>
            <Section gap='4px'>
              <SpotLightCardText small>Key price</SpotLightCardText>
              <SpotLightCardText>
                {dataItem && parseFloat(dataItem.tierkey_prices[0])
                  ? parseFloat(dataItem.tierkey_prices[0]).toFixed(4)
                  : "0.0"}{" "}
                {chainCurrency}
              </SpotLightCardText>
            </Section>
            <Section gap='4px'>
              <SpotLightCardText small>Contents</SpotLightCardText>
              <SpotLightCardText>
                {dataItem?.files_count || 0} files
              </SpotLightCardText>
            </Section>
          </FlexRow>
        </Section>
      </RoundCard>
    </Section>
  );
};
