import React, { ReactNode, useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import _InfiniteScroll from "react-infinite-scroll-component";

export type InfiniteScrollCallbackRef<T> = {
  reset: () => void;
  loadMore: (page: number, pageSize: number) => Promise<T[] | undefined>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
};

export interface InfiniteScrollProps<T> {
  defaultData?: T[];
  pageSize?: number;
  totalItemLimit?: number;
  loadMore?: (page: number, pageSize: number) => Promise<T[]> | T[];
  placeHolder?: ReactNode;
  forceLoading?: boolean;
  style?: React.CSSProperties;
  className?: string;
  renderItem: (props: { dataItem: T; idx: number }) => JSX.Element;
  callbackRef?: React.MutableRefObject<
    InfiniteScrollCallbackRef<T> | undefined
  >;
}

export function InfiniteScroll<T>({
  defaultData,
  pageSize = 10,
  totalItemLimit,
  loadMore,
  placeHolder,
  forceLoading,
  style,
  className,
  renderItem: Children,
  callbackRef,
}: InfiniteScrollProps<T>) {
  const TOTAL_ITEM_LIMIT = totalItemLimit || Number.MAX_VALUE;
  const [tableData, setTableData] = useState(defaultData || []);
  const [hasMorePage, setHasMorePage] = useState(true);
  const [nowLoadingPage, setNowLoadingPage] = useState(1);

  const handleLoadMoreData = async (page: number, pageSize: number) => {
    if (!loadMore || !hasMorePage || (page - 1) * pageSize >= TOTAL_ITEM_LIMIT)
      return;
    const moreData = await loadMore(page, pageSize);
    setTableData(prevItems => [...prevItems, ...moreData]);
    if (moreData.length < pageSize || page * pageSize >= TOTAL_ITEM_LIMIT) {
      setHasMorePage(false);
    } else {
      setHasMorePage(true);
    }
    console.log({ page, pageSize, moreData });
    return moreData;
  };

  useEffect(() => {
    handleLoadMoreData(nowLoadingPage, pageSize);
  }, [nowLoadingPage, hasMorePage]);

  const handleReset = () => {
    setTableData([]);
    setNowLoadingPage(1);
    setHasMorePage(true);
  };

  useEffect(() => {
    if (callbackRef) {
      callbackRef.current = {
        reset: handleReset,
        loadMore: handleLoadMoreData,
        setData: setTableData,
      };
    }
  }, [callbackRef, handleReset, handleLoadMoreData, setTableData]);

  return (
    <_InfiniteScroll
      style={style}
      className={className}
      dataLength={!forceLoading ? tableData.length : -1}
      next={() => !forceLoading && setNowLoadingPage(prev => prev + 1)}
      hasMore={hasMorePage}
      loader={
        forceLoading
          ? null
          : placeHolder || (
              <div className='loading'>
                <CircularProgress color='inherit' />
              </div>
            )
      }
    >
      {forceLoading
        ? placeHolder || (
            <div className='loading'>
              <CircularProgress color='inherit' />
            </div>
          )
        : tableData &&
          tableData.map((item, index) => {
            return <Children dataItem={item} key={index} idx={index} />;
          })}
    </_InfiniteScroll>
  );
}
