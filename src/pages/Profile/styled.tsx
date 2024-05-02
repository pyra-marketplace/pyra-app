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
  .right {
    height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    .buttons-wrapper {
      display: flex;
      align-items: center;
      .button {
        padding: 12px;
        margin-right: 14px;
        border-radius: 12px;
        background: #fe5c02;
        color: #fff;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.24px;
        cursor: pointer;
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

export const GuidePageSection = styled(Section)`
  /* font */
  font-family: Poppins;
  color: #121212;
`;

export const PortfolioContainer = styled.div`
  width: 100%;
  .info-wrapper {
    display: flex;
    gap: 20px;
    .info-container {
      width: 100%;
      padding: 25px;
      border-radius: 24px;
      border: 1px solid #e2e2e2;
      .title {
        color: #545454;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.14px;
      }
      .content {
        padding: 6px 0;
        color: #121212;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.2px;
      }
      .added {
        color: #545454;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.14px;
      }
    }
  }

  .list-container {
    margin-top: 22px;
  }
`;

export const TwitterIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 12px;
    height: 12px;
  }
`;

export const ShareCardSection = styled(Section)`
  width: 100%;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  padding: 35px 33px;
  gap: 32px;

  .title-text {
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #121212;
  }

  .tool-wrapper {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .list-section {
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .item {
      display: flex;
      align-items: center;
      gap: 22px;
      margin-bottom: 16px;

      .creator-info {
        display: inline-flex;
        flex: 3;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          /* background: #3ec574; */
          img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
          }
        }
        .user-name {
          /* font */
          margin-left: 17px;
          font-family: Inter-Medium;
          font-size: 16px;
          font-weight: 600;
          line-height: 19.36px;
          text-align: left;
          color: #121212;
        }
      }

      .amount {
        flex: 1;
        color: #121212;
        text-align: center;
        font-family: Inter-Medium;
        font-size: 16px;
        font-weight: 600;
        line-height: normal;
      }

      .price {
        flex: 1.5;
        text-align: right;
        color: #121212;
        text-align: center;
        font-family: Inter-Medium;
        font-size: 16px;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
`;
