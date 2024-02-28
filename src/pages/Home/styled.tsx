import React from "react";

import { motion } from "framer-motion";
import styled from "styled-components";

import BigRightArrowSvg from "@/assets/icons/big-right-arrow.svg";

export const HomeWrapper = styled.main<{
  gap?: string;
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${prop => prop.gap || "0px"};

  * {
    margin: 0;
  }
`;

export const Section = styled.section<{
  flexDirection?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  background?: string;
  padding?: string;
  margin?: string;
  flex?: string;
  overflow?: string;
  width?: string;
  height?: string;
}>`
  display: flex;
  flex-direction: ${prop => prop.flexDirection || "column"};
  gap: ${prop => prop.gap || "0px"};
  align-items: ${prop => prop.alignItems || "flex-start"};
  justify-content: ${prop => prop.justifyContent || "flex-start"};
  background: ${prop => prop.background || "none"};
  padding: ${prop => prop.padding || "0px"};
  margin: ${prop => prop.margin || "0px"};
  flex: ${prop => prop.flex || "1 1 auto"};
  overflow: ${prop => prop.overflow || "visible"};
  width: ${prop => prop.width || "auto"};
  height: ${prop => prop.height || "auto"};
`;

export const FlexRow = styled.div<{
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  background?: string;
  padding?: string;
  margin?: string;
  flex?: string;
  width?: string;
}>`
  display: flex;
  flex-direction: row;
  gap: ${prop => prop.gap || "0px"};
  align-items: ${prop => prop.alignItems || "center"};
  justify-content: ${prop => prop.justifyContent || "flex-start"};
  background: ${prop => prop.background || "none"};
  padding: ${prop => prop.padding || "0px"};
  margin: ${prop => prop.margin || "0px"};
  flex: ${prop => prop.flex || "1 1 auto"};
  width: ${prop => prop.width || "auto"};
`;

export const RoundCard = styled.div<{
  width?: string;
  height?: string;
  borderRadius?: string;
}>`
  width: ${prop => prop.width || "auto"};
  height: ${prop => prop.height || "auto"};
  border-radius: ${prop => prop.borderRadius || "16px"};
  background: #96ffe5;
  img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
  }
`;

export const Title = styled.h1<{
  dark?: boolean;
  big?: boolean;
}>`
  font-family: Inter-ExtraBold;
  font-size: 104px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0em;
  text-align: left;
  color: ${prop => (prop.dark ? "#202025" : "#F7FBFA")};
  ${prop =>
    !prop.big &&
    `
    font-size: 80px;
    letter-spacing: -0.02em;
  `}
`;

export const Description = styled.p`
  /* font */
  font-family: Inter-Medium;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #686a6c;
`;

export const Text = styled.span<{
  color?: string;
}>`
  /* font */
  font-family: Inter-Bold;
  font-size: 18px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: -0.01em;
  text-align: left;
  color: ${prop => prop.color || "#202025"};
`;

export const LinkButton = styled.a`
  /* font */
  font-family: Inter-ExtraBold;
  font-size: 12px;
  font-weight: 800;
  line-height: 24px;
  letter-spacing: 0.17em;
  text-align: left;
  color: #202025;
  text-transform: uppercase;
  cursor: pointer;
`;

export const WhiteButton = styled.button`
  /* font */
  font-family: Inter-ExtraBold;
  font-size: 12px;
  font-weight: 800;
  line-height: 24px;
  letter-spacing: 0.17em;
  text-align: left;
  text-transform: uppercase;
  color: #202025;
  padding: 18px 64px;
  background: #f7fbfa;
  border-radius: 8px;
  cursor: pointer;
`;

export const RoundArrowButton = styled.button<{
  dark?: boolean;
}>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
  background: #e1e2e2;
  border: 2px solid #e1e2e2;
  cursor: pointer;
  ${prop =>
    prop.dark &&
    `
    background: #202025;
    border: none;
  `}
`;

export const ScrollableSection = styled(Section)`
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
    height: 8px;
    padding: 2px 4px;
    background: #e1e2e2;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    /* margin: 2px 4px; */
    height: 4px;
    background-color: #202025;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    height: 8px;
    background: #e1e2e2;
    border-radius: 4px;
  }
`;

export const ProgressBar = styled(motion.div)`
  width: 256px;
  height: 8px;
  background: #e1e2e2;
  padding: 2px 4px;
  border-radius: 4px;

  .bar-container {
    width: 100%;
    height: 4px;
    border-radius: 4px;
  }
  .bar {
    width: 95px;
    height: 4px;
    border-radius: 4px;
    background: #202025;
    cursor: grab;
  }
`;

export const GridWrap = styled.div<{
  rowGap?: string;
  columnGap?: string;
  columnCount?: number;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${prop => prop.columnCount || 1},
    minmax(min-content, 1fr)
  );
  grid-row-gap: ${prop => prop.rowGap || "0px"};
  grid-column-gap: ${prop => prop.columnGap || "0px"};
`;

export const TabButtonsWrap = styled.div`
  display: flex;
  gap: 44px;
  padding: 3px;
  align-items: center;
  background: #f4f4f4;
  border-radius: 14px;

  .tab-button {
    /* font */
    font-family: Inter-Bold;
    font-size: 20px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    background: transparent;
    color: #686a6c;
    padding: 16px 0px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &[data-active="true"] {
      background: #ffffff;
      color: #232325;
      padding: 16px 26px;
    }

    &:first-child[data-active="false"] {
      margin-left: 26px;
    }
    &:last-child[data-active="false"] {
      margin-right: 28px;
    }
  }
`;

export const TableWrap = styled.div`
  flex: 1 1 auto;
  width: 100%;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table-container {
    overflow: auto;
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 30px;

    .table-item {
      display: flex;
      align-items: center;
      /* font */
      font-family: Inter-Bold;
      font-size: 20px;
      font-weight: 700;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;

      .btn {
        border-radius: 8px;
        background-color: #4383f7;
        color: #ffffff;
        padding: 6px 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar {
        width: 66px;
        height: 66px;
        border-radius: 10px;
        background: #5990f6;
      }
    }

    .buttons {
      display: flex;
      padding: 0 24px;
      align-items: center;
      justify-content: center;
      column-gap: 32px;
    }

    /* &:hover {
      transition: all 0.2s ease-in-out;
      background-color: #f2f3f5;
    } */
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #d4d4d4;
    position: sticky;
    top: 0;

    .table-item {
      display: flex;
      align-items: center;
      /* font */
      font-family: Inter-Medium;
      font-size: 16px;
      font-weight: 500;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: #686a6c;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .table-row,
  .table-header {
    /* .table-item:nth-child(1) {
      flex: 0 1 40%;
    }
    .table-item:nth-child(2) {
      flex: 0 1 15%;
    }
    .table-item:nth-child(3) {
      flex: 0 1 20%;
    }
    .table-item:nth-child(4) {
      flex: 0 1 15%;
    }
    .table-item:nth-child(5) {
      justify-content: flex-end !important;
      flex: 0 1 10%;
      min-width: 120px;
    } */
    .table-item:nth-child(1) {
      flex: 0 1 20%;
    }
    .table-item:nth-child(2),
    .table-item:nth-child(3) {
      flex: 0 1 15% !important;
    }
    .table-item:nth-child(4) {
      flex: 0 1 10% !important;
    }
    .table-item:not(:nth-child(1)) {
      flex: 0 1 13.3%;
    }
    .table-item:nth-child(4),
    .table-item:nth-child(5),
    .table-item:nth-child(6),
    .table-item:nth-child(7) {
      justify-content: right !important;
    }
  }

  .table-header {
    .table-item:nth-child(1) {
      margin-left: 5px;
    }
    .table-item:not(:nth-child(1)) {
      justify-content: center;
    }
  }
  .table-row {
    .table-item:nth-child(1) {
      /* padding-left: 20px; */
    }
    .table-item:not(:nth-child(1)) {
      justify-content: center;
    }
  }
`;

const BigRightArrowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 21px 32px;
  background: #6dd3c2;
  border-radius: 48px;
  margin-top: 18px;
`;

export const BigRightArrow: React.FC = () => (
  <BigRightArrowWrap>
    <img src={BigRightArrowSvg} alt='Big right arrow' />
  </BigRightArrowWrap>
);
