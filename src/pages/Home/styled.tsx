import React from "react";

import { motion } from "framer-motion";
import styled from "styled-components";

import BigRightArrowSvg from "@/assets/icons/big-right-arrow.svg";
import { Section } from "@/styled";

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

export const TopTabButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .tab-button {
    border-radius: 10px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #ffffff;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover,
    &[data-active="true"] {
      background: #ffffff26;
    }
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

export const ScrollableSection = styled(Section)<{
  darkBackground?: boolean;
}>`
  overflow-x: auto;
  overflow-y: hidden;

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

  .right-arrow-btn,
  .left-arrow-btn {
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    opacity: 0;
    &:hover {
      opacity: 1;
      background: ${prop =>
        prop.darkBackground
          ? "rgba(18, 18, 18, 0.08)"
          : "rgba(18, 18, 18, 0.4)"};
    }
    &[data-hidden="true"] {
      cursor: default;
      opacity: 0 !important;
      background: none !important;
    }
  }
  .right-arrow-btn {
    padding: 0 4px 0 4px;
    position: absolute;
    right: -4px;
    top: 50%;
    transform: translateY(-50%) translateX(100%);
  }
  .left-arrow-btn {
    padding: 0 4px 0 4px;
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%) translateX(-100%) rotate(180deg);
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
    /* cursor: grab; */
  }
`;

export const PlainButton = styled.button`
  border-radius: 12px;
  padding: 12px 24px;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  transition: background 0.2s ease-in-out;
  /* font */
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.36px;
  letter-spacing: -0.01em;
  text-align: left;
  color: #121212;

  &:hover {
    background: #e1e2e2;
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

    .loading {
      width: 100%;
      flex: 1 1 auto;
      padding: 24px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
    }
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 30px;

    .table-item {
      display: flex;
      align-items: center;
      justify-content: center;
      /* font */
      font-family: Inter-Bold;
      font-size: 20px;
      font-weight: 700;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: #121212;
      overflow: hidden;
      text-overflow: ellipsis;

      .btn {
        border-radius: 8px;
        background-color: #4383f7;
        color: #121212;
        padding: 6px 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar {
        width: 66px;
        height: 66px;
        border-radius: 10px;
        &:not(:has(img)) {
          background: #121212;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          object-fit: cover;
        }
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
      justify-content: center;
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
      flex: 0 1 5%;
    }
    .table-item:nth-child(2) {
      flex: 0 1 20%;
    }
    .table-item:nth-child(3) {
      flex: 0 1 15%;
    }
    .table-item {
      flex: 0 1 15%;
    }
    .table-item:nth-child(2) {
      justify-content: left !important;
    }
    /* .table-item:nth-child(4),
    .table-item:nth-child(5),
    .table-item:nth-child(6),
    .table-item:nth-child(7),
    .table-item:nth-child(8) {
      justify-content: right !important;
    } */
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

export const HightLightCardText = styled.span<{
  bold?: boolean;
}>`
  /* font */
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px;
  letter-spacing: -0.015em;
  text-align: left;
  color: #ffffff;
  ${prop =>
    prop.bold &&
    `
    font-family: Inter-Bold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
  `}
`;

export const SpotLightText = styled.p`
  /* font */
  font-family: Inter-SemiBold;
  font-size: 24px;
  font-weight: 600;
  line-height: 29.05px;
  letter-spacing: -0.01em;
  text-align: left;
  color: #121212;
`;

export const SpotLightCardText = styled.p<{
  small?: boolean;
}>`
  /* font */
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.36px;
  letter-spacing: -0.015em;
  text-align: left;
  color: #121212;
  ${prop =>
    prop.small &&
    `
    font-family: Inter-Medium;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    color: #545454;
  `}
`;

export const SpotLightContentSectionWrap = styled.div<{
  rowGap?: string;
  columnGap?: string;
  foldItems?: boolean;
  lineHeight?: number;
}>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: ${prop => prop.columnGap || "32px"};
  row-gap: ${prop => prop.rowGap || "55px"};
  ${prop =>
    prop.foldItems &&
    `
    height: ${(prop.lineHeight || 0) + 30}px;
    overflow: hidden;
  `}

  .content-card {
    /* width: 262px; */
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 19px;
    cursor: pointer;
    > * {
      position: relative;
    }
  }
`;
