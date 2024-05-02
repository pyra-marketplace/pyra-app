import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  /* height: 96px; */
  width: 100%;
  padding: 26px 40px;
  /* background-color: #42f9cc; */

  position: absolute;
  top: 0;
  z-index: 1000;

  .inner-header {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > * {
      height: 100%;
    }
  }

  .left {
    margin-left: 53px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1 1 auto;

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;

      .brand-name {
        /* font */
        font-family: Inter-ExtraBold;
        font-size: 24px;
        font-weight: 900;
        line-height: 40px;
        letter-spacing: 0em;
        text-align: left;
        color: #ffffff;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 28px;

    .chip {
      padding: 12px 20px 12px 30px;
      background: #ffffffcc;
      border-radius: 22px;
      display: flex;
      align-items: center;
      /* font */
      font-family: Inter-Medium;
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
    }
  }
`;
