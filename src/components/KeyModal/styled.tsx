import styled from "styled-components";

import { Section } from "@/styled";

export const Wrapper = styled.div`
  width: 550px;
  padding: 28px 28px 40px;
  border-radius: 20px;
  background: #fff;

  .close-wrapper {
    position: absolute;
    right: 28px;
    img {
      cursor: pointer;
    }
  }
`;

export const OutWrapper = styled.div`
  .sell-button {
    display: flex;
    justify-content: center;
    border-radius: 12px;
    background: #ffeee5;
    padding: 17px 0;
    color: #c05621;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.24px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .buy-button {
    display: flex;
    justify-content: center;
    border-radius: 12px;
    background: #accef6;
    padding: 17px 0;
    color: #1b56f1;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.24px;
    cursor: pointer;
  }
`;

export const BuyWrapper = styled.div`
  .option-container {
    display: flex;
    justify-content: center;
    .option-wrapper {
      display: flex;
      /* width: 200px; */
      margin: 0 auto 43px;
      border-radius: 10px;
      border: solid 1px #f6f6f6;
      overflow: hidden;
      .option {
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
        color: #121212;
        font-family: Inter-Medium;
        font-size: 16px;
        font-style: normal;
        line-height: normal;
        letter-spacing: -0.16px;
      }
    }
  }

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .title {
    color: #545454;
    font-family: Inter-Medium;
    font-size: 14px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.14px;
  }

  .value {
    color: #121212;
    text-align: right;
    font-family: Inter-Medium;
    font-size: 20px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.3px;
  }

  .input-wrapper {
    border-radius: 12px;
    border: 1px solid #ebebeb;
    margin: 20px 0 10px;
    padding: 19px 25px;
    color: #545454;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.14px;
    .input {
      width: 95%;
      color: #000;
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.2px;
      margin: 8px 0;
      &::placeholder {
        color: #ebebeb;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.24px;
      }
    }
  }

  .buy-wrapper {
    border-radius: 12px;
    border: 1px solid #ebebeb;
    .buy-info {
      padding: 19px 22px;
      .price {
        color: #121212;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.2px;
        margin-bottom: 6px;
      }
      .eth {
        color: #545454;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.16px;
      }
    }
    .buy-button {
      display: flex;
      justify-content: center;
      border-radius: 0px 0px 12px 12px;
      background: #2d7fe3;
      padding: 17px 0;
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

  .sell-wrapper {
    .key-wrapper {
      position: relative;
      height: 110px;
      display: flex;
      gap: 14px;
      margin-bottom: 27px;
      .key-box {
        white-space: nowrap;
        padding: 25px;
        border-radius: 12px;
        border: 1px solid #ebebeb;
        cursor: pointer;
        .id {
          color: #b3b3b3;
          font-family: Inter-Medium;
          font-size: 20px;
          font-style: normal;
          line-height: normal;
          letter-spacing: -0.2px;
          margin-bottom: 12px;
        }
        .price {
          color: #b3b3b3;
          font-family: Inter-Medium;
          font-size: 16px;
          font-style: normal;
          line-height: normal;
          letter-spacing: -0.16px;
        }
      }
    }
    .sell-info {
      padding: 19px 22px;
      .price {
        color: #121212;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.2px;
        margin-bottom: 6px;
      }
      .eth {
        color: #545454;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.16px;
      }
    }
    .sell-button {
      display: flex;
      justify-content: center;
      border-radius: 12px;
      background: #fe5c02;
      padding: 17px 0;
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

  .divider {
    display: flex;
    align-items: center;
    margin: 22px 0;
    .line {
      flex-grow: 1;
      height: 1px;
      background: #ebebeb;
    }
    .text {
      padding: 0 10px;
      color: #545454;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.24px;
    }
  }

  .cancel-wrapper {
    display: flex;
    justify-content: center;
    .cancel {
      display: inline-flex;
      justify-content: center;
      color: #1380de;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.21px;
      margin-top: 12px;
      cursor: pointer;
    }
  }
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
