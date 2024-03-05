import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 96px;
  width: 100%;
  padding: 0 40px;
  background: #f7fbfa;

  position: sticky;
  top: 0;
  z-index: 1000;

  .inner-header {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #55555540;
    display: flex;
    align-items: center;

    > * {
      height: 100%;
    }
  }

  .left {
    border-right: 1px solid #55555540;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 0 0 auto;
    padding-left: 55px;
    width: 724px;

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
        color: #010101;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
    gap: 48px;

    .link {
      display: flex;
      align-items: center;
      /* font */
      font-family: Inter-ExtraBold;
      font-size: 12px;
      font-weight: 800;
      line-height: 24px;
      letter-spacing: 0.17em;
      text-align: left;
      text-transform: uppercase;
      color: #010101;
      cursor: pointer;
    }

    button.link {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 2px solid #555555;
      border-radius: 4px;
      padding: 12px 32px;
      background-color: transparent;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 32px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 32px;
      }
    }
  }
`;
