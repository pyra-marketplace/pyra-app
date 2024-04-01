import styled from "styled-components";

import LockedSectionPng from "@/assets/images/locked-section.png";
import { FlexRow, Section } from "@/styled";

export const CreatorWrapper = styled.main<{
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

export const BannerContainer = styled.div`
  width: 100%;
  height: 342px;
  position: relative;

  .banner-section {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 342px;
    padding: 166px 32px 27px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.83) 100%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }

  .banner-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-base-info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 17px;
      margin-bottom: 10px;
      object-fit: cover;
    }
  }

  .user-extra-info {
    display: flex;
    align-items: center;
    gap: 40px;

    .user-extra-info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .title-text {
    font-family: Inter-SemiBold;
    font-size: 20px;
    font-weight: 600;
    line-height: 24.2px;
    text-align: left;
    color: #ffffff;
  }

  .sub-title-text {
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    text-align: left;
    color: #ffffff;
  }

  .desc-text {
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #dddddd;
  }
`;

export const ContentInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  .content-desc {
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.005em;
    text-align: left;
    color: #121212;
  }

  .item-desc {
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #545454;
    white-space: pre;
    .bold {
      /* font */
      font-family: Inter-SemiBold;
      font-weight: 600;
    }
  }
`;

export const BlackButton = styled.button`
  padding: 16px 52px;
  border-radius: 111px;
  background: #000000;
  display: flex;
  align-items: center;
  gap: 5px;
  /* font */
  font-family: Inter-Bold;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  color: #ffffff;
  img {
    max-height: 24px;
  }
  &:disabled {
    background: #b1b1b1;
    color: #ffffff;
    cursor: not-allowed;
  }
`;

export const FinderContainer = styled(Section)`
  width: 100%;

  .tool-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 32px;
    padding: 23px 80px;
    border-bottom: 1.11px solid #f2f2f2;
  }

  .inner-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 86px;
    padding: 32px 80px;
  }
`;

export const FinderMaskContainer = styled(Section)`
  width: calc(100% - 80px);
  height: 400px;
  margin: 60px 0;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: #7a7a7a;
  color: #ffffff;
`;

export const DateSortedSectionWrap = styled(Section)`
  width: 100%;
  gap: 32px;
  .date-text {
    /* font */
    font-family: Inter-Bold;
    font-size: 20px;
    font-weight: 700;
    line-height: 25px;
    letter-spacing: -0.02em;
    text-align: left;
    color: #000000;
  }
  .fold-bar {
    flex: 0 0 auto;
    gap: 3px;
    cursor: pointer;
    /* font */
    font-family: Poppins-SemiBold;
    font-size: 14px;
    font-weight: 600;
  }
  .files-count {
    /* font */
    font-family: Poppins;
    font-weight: 400;
    color: #b1b1b1;
  }
`;

export const ContentSectionWrap = styled.div<{
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
    height: ${prop.lineHeight}px;
    overflow: hidden;
  `}

  .file-card {
    /* width: 262px; */
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 19px;
    cursor: pointer;
    .preview {
      position: relative;
      width: 262px;
      height: 262px;
      /* width: 100%;
      height: 100%; */
      border-radius: 15.92px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 15.92px;
      }
    }
    .file-name {
      /* font */
      font-family: Inter-Bold;
      font-size: 19px;
      font-weight: 700;
      line-height: 25px;
      letter-spacing: -0.02em;
      text-align: left;
      color: #000000;
    }
  }
`;

export const FilesContentSectionWrap = styled.div<{
  rowGap?: string;
  columnGap?: string;
  foldItems?: boolean;
  lineHeight?: number;
}>`
  flex: 1 1 auto;
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

  .file-card {
    /* width: 262px; */
    width: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 1px 2px 18.700000762939453px 0px #0000001a;

    .preview {
      position: relative;
      width: 256px;
      height: 256px;
      /* width: 100%;
      height: 100%; */
      border-radius: 10px 10px 0 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px 10px 0 0;
      }
    }
    .file-info {
      padding: 18px 15px;
      display: flex;
      flex-direction: column;
      /* font */
      font-family: Inter-SemiBold;
      font-size: 14px;
      font-weight: 600;
      line-height: 16.94px;
      text-align: left;
      color: #414141;
      .grey {
        font-family: Inter-Medium;
        font-weight: 500;
        color: #777777;
      }
    }
  }
`;

export const LockedSectionWrap = styled(Section)`
  width: 100%;
  height: 800px;
  background: url(${LockedSectionPng}) no-repeat;
  background-size: cover;
  align-items: center;
  justify-content: space-between;

  .locked-tip {
    /* font */
    font-family: Inter-SemiBold;
    font-size: 30px;
    font-weight: 600;
    line-height: 36px;
    letter-spacing: 0em;
    text-align: left;
    color: #000000;
  }
  .locked-bottom-extra-tip {
    /* font */
    font-family: Poppins-Medium;
    font-size: 21px;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: 0em;
    text-align: left;
    color: #636363;
  }
  .locked-bottom-tip {
    /* font */
    font-family: Inter-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #636363;
  }
`;

export const EmptySectionWrap = styled(Section)`
  align-items: center;
  justify-content: center;
  color: #000000;
  gap: 30px;

  .empty-tip {
    /* font */
    font-family: Lato;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: center;
    color: #999999;
  }
`;

export const PopupButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 4px;
  &:hover {
    .popup-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      /* row-gap: 4px; */
      width: auto;
      transform: translateX(30%);
    }
  }

  .popup-list {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 100%;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 20px 30px;
    border-radius: 10px;
    padding: 5px;
    z-index: 1000;
    display: none;

    .list-item {
      width: 100%;
      text-align: center;
      padding: 5px 17px;
      margin: 5px;
      border-radius: 10px;
      cursor: pointer;
      white-space: nowrap;
    }

    .list-item[data-active="true"] {
      background: rgb(246, 246, 246);
    }

    .list-item[data-disabled="true"] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 10px;
      top: -10px;
    }
  }
`;

export const PlainTabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 10px;
  transition: all 0.3s;
  /* font */
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.36px;
  letter-spacing: -0.01em;
  text-align: left;
  color: #545454;

  &:hover {
    color: #121212;
  }

  &[data-active="true"] {
    background: #f6f6f6;
    color: #121212;
  }
`;

export const PlainButton = styled.button<{
  small?: boolean;
  black?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: ${prop => (prop.small ? "10px" : "14px")};
  border-radius: 10px;
  background: #f6f6f6;
  color: #545454;
  ${prop =>
    prop.black &&
    `
    background: #121212;
    color: #ffffff;
  `}
  /* font */
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.36px;
  letter-spacing: -0.01em;
  text-align: left;
`;

export const TopBarContainer = styled(FlexRow)`
  .bold-text {
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #121212;
  }
  .normal-text {
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #545454;
  }
  .live-prompt {
    margin-left: 5px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #3ec574;
      margin-right: 12px;
    }
  }
  .search {
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    .search-input,
    .search-input::placeholder {
      flex: 1 1 auto;
      background: transparent;
      /* font */
      font-family: Inter-Medium;
      font-size: 16px;
      font-weight: 500;
      line-height: 19.36px;
      text-align: left;
    }
    .search-input::placeholder {
      color: #545454;
    }
  }
  .selector {
    width: 240px;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
`;

export const MainContentContainer = styled(FlexRow)`
  width: 100%;
  gap: 33px;
  align-items: flex-start;

  .sidebar {
    width: 320px;
    .list-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      &:not(:first-child) {
        border-top: 1px solid #ececec;
      }
      &[data-active="true"] {
        .down-arrow {
          transform: rotate(180deg);
        }
      }
    }
    .list-title {
      padding: 22px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      /* font */
      font-family: Inter-SemiBold;
      font-size: 16px;
      font-weight: 600;
      line-height: 19.36px;
      text-align: left;
      color: #121212;
      .down-arrow {
        transition: all 0.2s;
      }
    }
  }
`;

export const GuidePageSection = styled(Section)`
  /* font */
  font-family: Poppins;
  color: #121212;
`;
