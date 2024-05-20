import styled from "styled-components";

export const FileInfoModalWrap = styled.div`
  width: min(75vw, 1200px);
  height: min(90vh, 750px);
  border-radius: 20px;
  background-color: #f1f4f4;
  display: flex;
  align-items: stretch;

  * {
    box-sizing: border-box;
  }
  p {
    margin: 0;
  }

  .content-viewer {
    flex: 0 0 60%;
    background-color: #f7fbfa;
    border-radius: 20px 0px 0px 20px;
    padding: 60px;
    align-items: center;
    justify-content: space-between;

    .file-media {
      flex: 1 1 auto;
      width: 100%;
      max-height: 100%;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      img {
        width: 100%;
        max-height: 100%;
        border-radius: 18px;
      }

      .right-arrow-btn,
      .left-arrow-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #d9d9d9a6;
        transition: background-color 0.3s;
        &:hover {
          background-color: #000000a6;
        }
      }
      .right-arrow-btn {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%) translateX(50%);
        cursor: pointer;
      }
      .left-arrow-btn {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        cursor: pointer;
      }
    }

    .progress-btn {
      width: 18px;
      height: 18px;
      border-radius: 21px;
      cursor: pointer;
      background-color: #54545499;
      transition: background-color 0.3s;
      &[data-active="true"] {
        background-color: #545454;
      }
    }
  }

  .file-info {
    flex: 1 1 auto;
    background-color: #f1f4f4;
    border-radius: 0px 20px 20px 0px;

    .file-info-chip {
      padding: 2px 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      /* font */
      font-family: Inter-Bold;
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: -0.01em;
      text-align: left;
      color: #ffffff;
    }

    .file-info-top {
      align-items: center;
      justify-content: space-between;
      padding: 20px 26px 20px 58px;
    }

    .file-info-content {
      padding: 50px 60px;
    }

    .file-info-title {
      /* font */
      font-family: Inter-Bold;
      font-size: 36px;
      font-weight: 700;
      line-height: 35px;
      letter-spacing: -0.02em;
      text-align: left;
    }

    .file-info-desc {
      /* font */
      font-family: Inter-Medium;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: -0.02em;
      text-align: left;
      color: #202025;
    }

    .file-info-tags {
      /* font */
      font-family: Inter-Medium;
      font-size: 14px;
      font-weight: 500;
      line-height: 27px;
      letter-spacing: -0.01em;
      text-align: left;
      color: #308fff;
    }

    .file-info-date {
      /* font */
      font-family: Inter-Medium;
      font-size: 14px;
      font-weight: 500;
      line-height: 27px;
      letter-spacing: -0.01em;
      text-align: left;
      color: #686a6c;
    }
  }
`;
