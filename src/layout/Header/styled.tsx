import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 96px;
  width: 100%;
  padding: 0 40px;
  background-color: #f7fbfa;

  position: sticky;
  top: 0;
  z-index: 1000;

  .inner-header {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #e1e2e2;
    display: flex;
    align-items: center;

    > * {
      height: 100%;
    }
  }

  .left {
    border-right: 1px solid #e1e2e2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1 1 auto;
    padding-right: 32px;
    padding-left: 53px;

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

    .search {
      padding: 14px 8px;
      cursor: pointer;
    }
  }

  .right {
    display: flex;
    align-items: center;
    padding-left: 104px;
    gap: 60px;

    .link {
      /* font */
      font-family: Inter-ExtraBold;
      font-size: 12px;
      font-weight: 800;
      line-height: 24px;
      letter-spacing: 0.17em;
      text-align: left;
      text-transform: uppercase;
      color: #202025;
      cursor: pointer;
    }

    button.link {
      border: 2px solid #555555;
      border-radius: 4px;
      padding: 12px 32px;
      background-color: transparent;
    }
  }
`;
