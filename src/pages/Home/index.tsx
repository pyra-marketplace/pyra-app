import React, { useEffect, useRef, useState } from "react";

import { useStore } from "@meteor-web3/hooks";
import { CircularProgress } from "@mui/material";
import { motion, useScroll } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";

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
import { Section, FlexRow, RoundCard } from "@/styled";
import { stringAbbreviation } from "@/utils";

export const Home: React.FC = () => {
  return (
    <HomeWrapper gap='87px'>
      <Section
        flexDirection='row'
        gap='22px'
        alignItems='center'
        justifyContent='space-between'
        padding='0px 80px'
      >
        <Section flexDirection='row' gap='24px' flex='1 0 auto'>
          <Title big dark>
            Earn from
            <br />
            your data.
          </Title>
        </Section>
        <FlexRow>
          <BigRightArrow />
        </FlexRow>
        <Section flexDirection='column' gap='76px' padding='85px 40px 53px'>
          <Description>
            We are laying the groundwork for web3 — the next generation of the
            internet full of limitless possibilities.
          </Description>
          <FlexRow gap='20px'>
            <LinkButton>Create vault</LinkButton>
            <img src={PlaceholderSvg} alt='placeholder' />
          </FlexRow>
        </Section>
      </Section>
      <Section
        background='#010101'
        padding='110px 80px'
        flexDirection='row'
        gap='32px'
        alignItems='center'
      >
        <Section gap='112px' flex='1 0 auto'>
          <Title>
            Earn from
            <br />
            your data.
          </Title>
          <WhiteButton>MAKE OFFER</WhiteButton>
        </Section>
        <img
          style={{
            width: "850px",
            marginTop: "100px",
            marginBottom: "80px",
          }}
          src={FeaturedNftPng}
          alt='featured-nft'
        />
      </Section>
      {/* <HighLightSection /> */}
      <CreatorSection />
    </HomeWrapper>
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
    pageSize: number = 10,
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
    if (trendingPyraZones.length < pageSize) {
      setHasMorePage(false);
    } else {
      setHasMorePage(true);
    }
    console.log({ page, pageSize, trendingPyraZones });
  };

  return (
    <Section
      background='#010101'
      padding='80px'
      gap='80px'
      width='100%'
      style={{ marginTop: "-87px" }}
    >
      <Title>Excellent creator.</Title>
      <Section width='100%'>
        <TabButtons
          tabs={tabs}
          controlledSelectedTab={selectedTab}
          onChange={tab => setSelectedTab(tab as any)}
        />
        <TableWrap>
          <div className='table-container hideScrollbar'>
            <div className='table-header'>
              <div className='table-item'>Creator name</div>
              <div className='table-item'>Total Value</div>
              <div className='table-item'>Key price</div>
              <div className='table-item'>Files num</div>
              <div className='table-item'>Key sales</div>
              <div className='table-item'>Holders</div>
              <div className='table-item'>Watchlists</div>
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
                    <CreatorTableItem trendingPyraZone={item} key={index} />
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
}: {
  trendingPyraZone: TrendingPyraZone;
}) => {
  const chainCurrency = useSelector(state => state.global.chainCurrency);
  return (
    <div className='table-row'>
      <div className='table-item'>
        <FlexRow gap='25px'>
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
      <div className='table-item'>${trendingPyraZone.share_price}</div>
      <div className='table-item'>
        {trendingPyraZone.key_price} {chainCurrency}
      </div>
      <div className='table-item'>{trendingPyraZone.files_count}</div>
      <div className='table-item'>{trendingPyraZone.key_sales}</div>
      <div className='table-item'>{trendingPyraZone.share_holders}</div>
      <div className='table-item'>{trendingPyraZone.watch_lists}</div>
    </div>
  );
};
