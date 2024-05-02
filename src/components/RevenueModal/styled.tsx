import styled from "styled-components";

export const Wrapper = styled.div`
  width: 550px;
  padding: 28px 28px 40px;
  border-radius: 20px;
  background: #fff;

  .close-wrapper {
    float: right;
    img {
      cursor: pointer;
    }
  }
`;

export const OutWrapper = styled.div`
  .stake-button {
    display: flex;
    justify-content: center;
    border-radius: 12px;
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

  .unstake-button {
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
    margin-bottom: 20px;
    cursor: pointer;
  }
`;

export const StakeWrapper = styled.div`
  .option {
    color: #121212;
    font-family: Inter-Medium;
    font-size: 24px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.36px;
  }
  .tip {
    color: #545454;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.14px;
    margin: 10px 0 29px;
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
  .share-number {
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

  .share-price {
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
    align-items: center;
    border-radius: 12px;
    border: 1px solid #ebebeb;
    margin: 20px 0 10px;
    padding: 2px 2px 2px 13px;
    color: #545454;
    font-family: Inter-Medium;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.14px;
    .input {
      width: 100%;
      padding: 11.5px 12px 11.5px 0;
      color: #000;
      font-family: Inter-Medium;
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.2px;
      &::placeholder {
        color: #ebebeb;
        font-family: Inter-Medium;
        font-size: 16px;
        font-style: normal;
        line-height: normal;
        letter-spacing: -0.24px;
      }
    }

    .max {
      display: inline-flex;
      padding: 11.5px 12px;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: #f6f6f6;
      color: #121212;
      font-family: Inter-Medium;
      font-size: 16px;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.24px;
      margin: 0 3px 0 0;
      cursor: pointer;
    }
  }

  .stake-wrapper {
    border-radius: 12px;
    border: 1px solid #ebebeb;
    margin-top: 29px;
    .stake-info {
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
    .stake-button {
      display: flex;
      justify-content: center;
      border-radius: 12px;
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

  .unstake-wrapper {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #ebebeb;
    .unstake-info {
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
    .unstake-button {
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
