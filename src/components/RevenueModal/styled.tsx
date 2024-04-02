import styled from "styled-components";

export const Wrapper = styled.div`
  width: 550px;
  padding: 20px 25px 40px;
  border-radius: 20px;
  background: #fff;

  .close-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
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
    background: #f95252;
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
  .title {
    color: #545454;
    font-family: Inter;
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

  .option {
    padding: 14.5px 0;
    border-radius: 12px;
    border: 1px solid #ebebeb;
    color: #121212;
    text-align: center;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.24px;
    margin: 11px 0 20px;
    cursor: pointer;
    &:hover {
      background-color: #f6f6f6;
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

  .stake-wrapper {
    border-radius: 12px;
    border: 1px solid #ebebeb;
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

export const UnstakeWrapper = styled.div`
  .title {
    color: #545454;
    font-family: Inter;
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
      border-radius: 0px 0px 12px 12px;
      background: #f95252;
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
