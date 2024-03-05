import styled from "styled-components";

import { Section } from "@/styled";

export const UploadWrapper = styled.main<{
  gap?: string;
}>`
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${prop => prop.gap || "0px"};

  * {
    margin: 0;
  }
`;

export const UploadSection = styled(Section)`
  padding: 60px 80px;
  gap: 60px;
  width: 764px;
  flex: 0 0 auto;
  background: #f1f4f4;

  .title {
    /* font */
    font-family: Inter-ExtraBold;
    font-size: 48px;
    font-weight: 800;
    line-height: 48px;
    letter-spacing: -0.02em;
    text-align: left;
    color: #202025;
  }
`;

export const DropzoneSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 18px;
  cursor: pointer;

  .main-area {
    width: 600px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview-img {
      width: 600px;
      height: 600px;
      border-radius: 18.75px;
    }
  }

  .sub-area {
    display: flex;
    align-items: center;
    gap: 18px;

    .preview-container {
      width: 188px;
      height: 188px;
      .preview-img {
        width: 188px;
        height: 188px;
        border-radius: 18.75px;
      }
    }
  }

  .preview-container {
    position: relative;
    border-radius: 18.75px;
    background: #e9ebeb;
    overflow: hidden;
    .delete-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 20px;
      background: #f7fbfa;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      > img {
        width: 10px;
        height: 10px;
      }
    }
    &[data-preview="true"]:hover {
      .delete-btn {
        display: flex;
      }
    }
  }
`;

export const DropzoneTips = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  .upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    height: 75px;
    border-radius: 75px;
    background: #f7fbfa;
    box-shadow: 0px 29.999998092651367px 44.999996185302734px -14.999999046325684px
      #0000001a;
  }

  .tips-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tips-title {
    /* font */
    font-family: Inter-Bold;
    font-size: 17px;
    font-weight: 700;
    line-height: 34px;
    letter-spacing: -0.01em;
    text-align: center;
    color: #202025;
  }

  .tips-desc {
    /* font */
    font-family: Inter-Medium;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #686a6c;
  }
`;

export const FormSection = styled(Section)`
  padding: 80px;
  padding-right: 116px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .publish-btn {
    height: 60px;
    width: 100%;
    padding: 18px 36px;
    gap: 12px;
    border-radius: 4px;
    background: #b1b5b1;
    transition: background 0.3s;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    /* font */
    font-family: Inter-ExtraBold;
    font-size: 12px;
    font-weight: 800;
    line-height: 24px;
    letter-spacing: 0.17em;
    text-align: left;
    color: #f7fbfa;

    &[data-active="true"] {
      background: #202025;
      cursor: pointer;
    }
  }
`;

export const TextInputWrap = styled.div<{
  type: "text" | "textarea";
}>`
  width: 100%;
  height: 96px;
  border-bottom: 1px solid #e1e2e2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  ${prop =>
    prop.type === "textarea" &&
    `
    height: 156px;
    align-items: flex-start;
    padding: 32px 0 28px;
  `}

  input, textarea {
    flex: 1 1 auto;
    background: none;

    &::placeholder {
      /* font */
      font-family: Inter-Bold;
      font-size: 20px;
      font-weight: 700;
      line-height: 32px;
      letter-spacing: -0.02em;
      text-align: left;
      color: #b1b5b1;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &:is(:focus, :hover) + .edit-icon path {
      stroke: #686a6c;
    }
  }
  input {
    /* font */
    font-family: Inter-Bold;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    text-align: left;
    color: #202025;
  }
  textarea {
    resize: none;
    height: 100%;
    /* font */
    font-family: Inter-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: -0.02em;
    text-align: left;
  }

  .edit-icon {
    path {
      stroke: #b1b5b1;
      transition: stroke 0.3s;
    }
  }
`;

export const SelectorWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-top: 25px;

  .selector-title {
    /* font */
    font-family: Inter-Bold;
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    text-align: left;
    color: #b1b5b1;
    transition: color 0.3s;
  }

  .selector-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .selector-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 30px;
    border-radius: 10px;
    background: #f7fbfa;
    cursor: pointer;
    box-shadow: 1px 2px 6px 0px #8e8e8e40;

    /* font */
    font-family: Inter-Bold;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #b1b5b1;
    transition: color 0.3s;

    &[data-selected="true"] {
      color: #202025;
    }
  }

  &[data-active="true"] {
    .selector-title {
      color: #202025;
    }
  }
`;

export const TagInputWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;

  .tag-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .tag-item {
    padding: 12px 34px;
    border-radius: 37px;
    gap: 14px;
    background: #202025;
    box-shadow: 1px 2px 6px 0px #8e8e8e40;
    display: flex;
    align-items: center;
    gap: 14px;
    /* font */
    font-family: Inter-Bold;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #ffffff;
  }
`;
