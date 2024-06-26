import styled from "styled-components";

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

export const SellWrapper = styled.div`
  .title {
    color: #545454;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.14px;
  }
  .key-number {
    color: #121212;
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.24px;
    padding: 8px 0;
    .unit {
      color: #545454;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.16px;
    }
  }

  .key-price {
    color: #121212;
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.2px;
    .eth {
      color: #545454;
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.2px;
    }
  }

  .input-wrapper {
    display: flex;
    border-radius: 12px;
    border: 1px solid #ebebeb;
    margin: 20px 0 10px;
    height: 48px;
    .input {
      width: 100%;
      color: #000;
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.2px;
      margin: 8px;
    }

    .max {
      display: inline-flex;
      padding: 11.5px 12px;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: #f6f6f6;
      color: #121212;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.24px;
      margin: 3px;
      cursor: pointer;
    }
  }

  .sell-wrapper {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #ebebeb;
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
      border-radius: 0px 0px 12px 12px;
      background: #ffeee5;
      padding: 17px 0;
      color: #c05621;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.24px;
      cursor: pointer;
    }
  }

  .cancel-wrapper {
    display: flex;
    justify-content: center;
    .cancel {
      display: flex;
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
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #ebebeb;
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
      border-radius: 0px 0px 12px 12px;
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
