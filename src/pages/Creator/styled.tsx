import styled from "styled-components";

import { Section } from "@/styled";

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

export const Banner = styled.div`
  width: 100%;
  height: 355px;
  position: relative;

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .edit-btn {
    position: absolute;
    bottom: 22px;
    right: 40px;
    padding: 12px;
    background: #ffffffcc;
    border-radius: 111px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Avatar = styled.div`
  padding: 11px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .user-img {
    width: 177px;
    height: 177px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const UserInfo = styled(Section)`
  .user-name {
    /* font */
    font-family: Inter-Bold;
    font-size: 30px;
    font-weight: 700;
    line-height: 36px;
    letter-spacing: 0px;
    text-align: center;
    background: linear-gradient(
      211.97deg,
      #ec6a76 16.29%,
      #c24cbb 30.7%,
      #824aef 46.42%,
      #6755f6 60.17%,
      #418ef7 79.16%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .account-info {
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: left;
    color: #b3b3b3;

    .divider {
      width: 1px;
      height: 13.33px;
      background: #dfdfdf;
    }
  }

  .financial-info {
    .data-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 11px;
    }
    .item-title {
      /* font */
      font-family: Inter-Medium;
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      text-align: left;
      color: #b3b3b3;
    }
    .item-value {
      /* font */
      font-family: Inter-Bold;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;
      color: #202025;
    }
  }
`;

export const BlackButton = styled.button`
  padding: 16px 52px;
  border-radius: 111px;
  background: #000000;
  /* font */
  font-family: Inter-Bold;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  color: #ffffff;
`;

export const FinderContainer = styled(Section)`
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

  .date-sorted-section {
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
  }
`;

export const ContentSectionWrap = styled.div<{
  rowGap?: string;
  columnGap?: string;
}>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: ${prop => prop.columnGap || "32px"};
  row-gap: ${prop => prop.rowGap || "55px"};

  .file-card {
    /* width: 262px; */
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 19px;
    .preview {
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
