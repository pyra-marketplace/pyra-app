import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollList = ({
  defaultTableData,
  loadMore,
  Children,
}: {
  defaultTableData?: any[];
  loadMore: ({ page }: { page: number }) => any;
  Children: ({
    tableDataItem,
    idx,
  }: {
    tableDataItem: any;
    idx: number;
  }) => JSX.Element;
}) => {
  const [tableData, setTableData] = useState(defaultTableData);
  const [nowLoadingPage, setNowLoadingPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTableData(defaultTableData);
    setLoading(!defaultTableData);
  }, [defaultTableData]);

  const next = async () => {
    const newItems: any[] = await loadMore({ page: nowLoadingPage + 1 });
    if (newItems.length === 0) {
      setLoading(false);
    }
    setTableData([...(tableData as any[]), ...newItems]);
    setNowLoadingPage(prev => prev + 1);
  };

  return (
    <InfiniteScroll
      style={{ maxHeight: 96 * 10, paddingRight: "10px" }}
      dataLength={tableData?.length || 0}
      next={next}
      hasMore={true}
      loader={<></>}
    >
      {!loading &&
        tableData &&
        tableData.map((item, index) => {
          return <Children tableDataItem={item} key={index} idx={index + 1} />;
        })}
      {loading && (
        <div
          style={{
            width: "100%",
            flex: "1 1 auto",
            padding: "6px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000000",
          }}
        >
          <CircularProgress
            color='inherit'
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      )}
    </InfiniteScroll>
  );
};

export default InfiniteScrollList;
