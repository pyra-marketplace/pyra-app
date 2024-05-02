import React, { useEffect, useRef, useState } from "react";

import { useStore } from "@meteor-web3/hooks";
import { CircularProgress, Skeleton } from "@mui/material";
import { PyraMarketRes, PyraZoneRes } from "@pyra-marketplace/pyra-sdk";
import EChartsReact from "echarts-for-react";
import { ethers } from "ethers";
import { motion, useScroll, useTransform } from "framer-motion";
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
  HighLightCardText,
  PlainButton,
  SpotLightText,
  SpotLightCardText,
  SpotLightContentSectionWrap,
} from "./styled";

import EthCoinIconSvg from "@/assets/icons/eth-coin.svg";
import PlaceholderSvg from "@/assets/icons/placeholder.svg";
import DefaultCardRectanglePng from "@/assets/images/default-card-rectangle.png";
import DefaultCardSquarePng from "@/assets/images/default-card-square.png";
import FeaturedNftPng from "@/assets/images/featured-nft.png";
import {
  InfiniteScroll,
  InfiniteScrollCallbackRef,
} from "@/components/InfiniteScroll";
import { TabButtons } from "@/components/TabButtons";
import {
  homeSlice,
  loadHomeData,
  loadTableData,
  // loadTrendingPyraZones,
} from "@/state/home/slice";
import { useDispatch, useSelector } from "@/state/hook";
import { Section, FlexRow, RoundCard, AbsoluteSection } from "@/styled";
import { betterToFixed, getDefaultAvatar, stringAbbreviation } from "@/utils";
import { ECOption, appEcharts } from "@/utils/echart.config";

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
      scrollSectionRef.current.scrollBy({
        left: to,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section
      background='linear-gradient(180deg, #603731 0%, #846560 43.5%, #FFFFFF 91.5%);'
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
          height='340px'
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
      style={{
        cursor: "pointer",
        borderRadius: "12px",
        boxShadow: "1px 2px 18.7px 0px #0000001A",
      }}
      onClick={() => dataItem && navigate("/creator/" + dataItem?.publisher)}
    >
      <RoundCard
        width='332px'
        height='332px'
        borderRadius='14px'
        background='transparent'
      >
        {dataItem ? (
          <img
            src={
              dataItem.publisher_profile?.cover_image_url ||
              DefaultCardSquarePng
            }
          />
        ) : (
          <Skeleton
            variant='rounded'
            width='100%'
            height='100%'
            sx={{ borderRadius: "14px" }}
          />
        )}
      </RoundCard>
      {dataItem && (
        <AbsoluteSection
          width='100%'
          height='100%'
          top='0px'
          left='0px'
          background='linear-gradient(180deg, rgba(0, 0, 0, 0) 32.08%, rgba(0, 0, 0, 0.94) 100%)'
          style={{ borderRadius: "14px" }}
        />
      )}
      <AbsoluteSection
        width='100%'
        left='0px'
        bottom='0px'
        style={{ zIndex: 1, borderRadius: "12px", overflow: "hidden" }}
      >
        <FlexRow width='100%' gap='15px' padding='0 15px' style={{ zIndex: 2 }}>
          {dataItem ? (
            <RoundCard
              width='75px'
              height='75px'
              borderRadius='14px'
              background='none'
            >
              <img
                src={
                  dataItem.publisher_profile?.user_info?.profile_image_url ||
                  getDefaultAvatar(dataItem.publisher)
                }
              />
            </RoundCard>
          ) : (
            <Skeleton
              variant='rounded'
              width='75px'
              height='75px'
              sx={{ borderRadius: "14px" }}
            />
          )}
          {dataItem ? (
            <HighLightCardText
              bold
              style={{
                fontSize: "16px",
              }}
            >
              {dataItem.publisher_profile?.user_info?.name ||
                stringAbbreviation(dataItem.publisher)}
            </HighLightCardText>
          ) : (
            <Skeleton width='100px' />
          )}
        </FlexRow>
        <FlexRow
          width='100%'
          justifyContent='space-between'
          padding='17px 15px 15px'
          background='#FFFFFF'
          style={{ marginTop: "-7px" }}
        >
          {dataItem ? (
            <>
              <HighLightCardText color='#545454'>
                {dataItem.total_asset_files || 0} items
              </HighLightCardText>
              <FlexRow gap='4px' flex='0 0 auto'>
                <img src={EthCoinIconSvg} />
                <HighLightCardText color='#121212' bold>
                  {betterToFixed(dataItem.total_value, 4, "0.0")}
                </HighLightCardText>
              </FlexRow>
            </>
          ) : (
            <Skeleton variant='text' width='100%' height='20px' />
          )}
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
                scrollSectionRef.current.scrollBy({
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
                scrollSectionRef.current.scrollBy({
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
  // const tableData = useSelector(state => state.home.tableData);
  const dispatch = useDispatch();
  const globalStates = useSelector(state => state.global);
  const { connector } = useStore();

  const tabs: Array<"Trending" | "Top" | "Recent"> = [
    "Trending",
    "Top",
    "Recent",
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const infiniteScrollCallbackRef =
    useRef<InfiniteScrollCallbackRef<PyraMarketRes>>();

  useEffect(() => {
    dispatch(homeSlice.actions.clearTableData());
    if (infiniteScrollCallbackRef.current) {
      infiniteScrollCallbackRef.current.reset();
    }
  }, [selectedTab]);

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
            plain
            tabs={tabs}
            controlledSelectedTab={selectedTab}
            onChange={tab => setSelectedTab(tab as any)}
          />
          {/* <FlexRow flex='0 0 auto' gap='15px'>
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
          </FlexRow> */}
        </FlexRow>
        <TableWrap>
          <div className='table-container hideScrollbar'>
            <div className='table-header'>
              <div className='table-item'>#</div>
              <div className='table-item'>Market</div>
              <div className='table-item'>Share volume</div>
              <div className='table-item'>Share value</div>
              <div className='table-item'>Share amount</div>
              <div className='table-item'>Share holders</div>
              <div className='table-item'> </div>
              {/* <div className='table-item'>Watchlists</div> */}
            </div>
            <InfiniteScroll<PyraMarketRes>
              style={{ minHeight: 96 * 10 }}
              callbackRef={infiniteScrollCallbackRef}
              totalItemLimit={TOTAL_ITEM_LIMIT}
              loadMore={(page, pageSize) =>
                dispatch(
                  loadTableData({
                    chainId: globalStates.chainId,
                    type: selectedTab,
                    page,
                    pageSize,
                  }),
                ).unwrap()
              }
              placeHolder={[...new Array(10)].map((_, idx) => (
                <CreatorTableItem key={idx} idx={idx + 1} />
              ))}
              renderItem={({ dataItem, idx }) => (
                <CreatorTableItem
                  tableDataItem={dataItem}
                  key={idx}
                  idx={idx + 1}
                />
              )}
            />
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
  tableDataItem?: PyraMarketRes;
  idx: number;
}) => {
  const navigate = useNavigate();
  const chainCurrency = useSelector(state => state.global.chainCurrency);
  const ethPrice = useSelector(state => state.global.ethPrice);
  const sharePrice =
    tableDataItem?.publisher_daily_records?.map(item =>
      parseFloat(ethers.utils.formatEther(item.share_price || "0")),
    ) || [];

  const chartOption: ECOption = {
    grid: {
      left: 0,
      top: 0,
      right: 14,
      bottom: 5,
    },
    xAxis: [
      {
        show: false,
        type: "category",
        data:
          tableDataItem?.publisher_daily_records?.map(item => item.date) || [],
      },
    ],
    yAxis: [
      {
        show: false,
        type: "value",
      },
    ],
    series: [
      {
        name: "Average price",
        type: "line",
        data: sharePrice,
        lineStyle: {
          color:
            sharePrice[0] <= sharePrice[sharePrice.length - 1]
              ? "#40B66B"
              : "#FF5F52",
          width: 1.5,
        },
        showSymbol: false,
      },
    ],
  };

  return (
    <div className='table-row'>
      <div className='table-item'>{idx}</div>
      <div className='table-item'>
        <FlexRow
          gap='25px'
          style={{ cursor: "pointer" }}
          onClick={() =>
            tableDataItem && navigate("/creator/" + tableDataItem.publisher)
          }
        >
          {tableDataItem ? (
            <div className='avatar'>
              <img
                src={
                  tableDataItem.publisher_profile?.user_info
                    ?.profile_image_url ||
                  getDefaultAvatar(tableDataItem.publisher)
                }
              />
            </div>
          ) : (
            <Skeleton className='avatar' variant='rounded' />
          )}
          {tableDataItem ? (
            <span>
              {tableDataItem.publisher_profile?.user_info?.name ||
                stringAbbreviation(tableDataItem.publisher, 4, 4)}
            </span>
          ) : (
            <Skeleton width='100px' />
          )}
        </FlexRow>
      </div>
      <div className='table-item'>
        {tableDataItem ? (
          <>
            {betterToFixed(tableDataItem.total_volume, 8)} {chainCurrency}
          </>
        ) : (
          <Skeleton width='100px' />
        )}
      </div>
      <div className='table-item'>
        {tableDataItem ? (
          <>
            {betterToFixed(tableDataItem.total_value, 8)} {chainCurrency}
          </>
        ) : (
          <Skeleton width='100px' />
        )}
      </div>
      <div className='table-item'>
        {tableDataItem ? (
          <>{tableDataItem.total_supply}</>
        ) : (
          <Skeleton width='50px' />
        )}
      </div>
      <div className='table-item'>
        {tableDataItem ? (
          <>{tableDataItem.share_sales}</>
        ) : (
          <Skeleton width='50px' />
        )}
      </div>
      <div className='table-item'>
        {tableDataItem ? (
          <EChartsReact
            style={{ width: 124, height: 40 }}
            echarts={appEcharts}
            option={chartOption}
          />
        ) : (
          <Skeleton variant='rounded' width={124} height={40} />
        )}
      </div>
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
  const recentPyraZones = useSelector(state => state.home.recentPyraZones);

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
      scrollSectionRef.current.scrollBy({
        left: to,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {!(popularPyraZones && popularPyraZones.length === 0) && (
        <Section width='100%' padding='10px 32px' gap='24px'>
          <SpotLightText>Most popular zones</SpotLightText>
          <SpotLightContentSection
            data={popularPyraZones || [...new Array(10)]}
            foldItems
          />
        </Section>
      )}
      {/* {!(trendingPyraZones && trendingPyraZones.length === 0) && (
        <Section width='100%' padding='10px 32px' gap='24px'>
          <SpotLightText>Trending zones</SpotLightText>
          <SpotLightContentSection
            data={trendingPyraZones || [...new Array(10)]}
            foldItems
          />
        </Section>
      )} */}
      {!(recentPyraZones && recentPyraZones.length === 0) && (
        <Section width='100%' padding='10px 32px' gap='24px'>
          <SpotLightText>New created zones</SpotLightText>
          <SpotLightContentSection
            data={recentPyraZones || [...new Array(10)]}
            foldItems
          />
        </Section>
      )}
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
      onClick={() => dataItem && navigate("/creator/" + dataItem.publisher)}
    >
      <RoundCard
        width='264px'
        height='289px'
        borderRadius='13px'
        background='#ffffff'
        style={{ boxShadow: "1px 2px 18.700000762939453px 0px #0000001A" }}
      >
        {dataItem ? (
          <RoundCard
            width='100%'
            height='176px'
            borderRadius='13px 13px 0px 0px'
            background='transparent'
          >
            <img
              src={
                dataItem?.publisher_profile?.cover_image_url ||
                DefaultCardRectanglePng
              }
            />
          </RoundCard>
        ) : (
          <Skeleton
            variant='rounded'
            width='100%'
            height='176px'
            sx={{ borderRadius: "13px 13px 0px 0px" }}
          />
        )}
        <Section width='100%' padding='18px 16px' gap='18px'>
          {dataItem ? (
            <SpotLightCardText>
              {dataItem.publisher_profile?.user_info?.name ||
                stringAbbreviation(dataItem.publisher)}
            </SpotLightCardText>
          ) : (
            <Skeleton width='100%' />
          )}
          <FlexRow width='100%'>
            <Section gap='4px'>
              <SpotLightCardText small>Key price</SpotLightCardText>
              {dataItem ? (
                <SpotLightCardText>
                  {betterToFixed(dataItem.tierkey_prices[0], 4)} {chainCurrency}
                </SpotLightCardText>
              ) : (
                <Skeleton width='calc(100% - 20px)' />
              )}
            </Section>
            <Section gap='4px'>
              <SpotLightCardText small>Contents</SpotLightCardText>
              {dataItem ? (
                <SpotLightCardText>
                  {dataItem.files_count || 0} files
                </SpotLightCardText>
              ) : (
                <Skeleton width='calc(100% - 20px)' />
              )}
            </Section>
          </FlexRow>
        </Section>
      </RoundCard>
    </Section>
  );
};
