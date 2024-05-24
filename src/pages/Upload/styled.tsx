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
`;

export const UploadSection = styled(Section)`
  padding: 90px 106px;
  padding-right: 0px;
  gap: 60px;
  width: 764px;
  flex: 0 0 auto;
  /* background: #f1f4f4; */
`;

export const DropzoneSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 18px;
  cursor: pointer;

  .main-area {
    width: 587px;
    height: 627px;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview-img {
      width: 587px;
      height: 627px;
      object-fit: cover;
      border-radius: 10px;
    }
  }

  .sub-area {
    display: flex;
    align-items: center;
    gap: 18px;

    .preview-container {
      width: 183.5px;
      height: 183.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      .preview-img {
        width: 183.5px;
        height: 183.5px;
        object-fit: cover;
        border-radius: 18.33px;
      }
    }
  }

  .preview-container {
    position: relative;
    border-radius: 18.75px;
    background: #e9ebeb;
    overflow: hidden;
    .delete-btn {
      z-index: 1;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #f7fbfa;
      font-size: 22px;
      line-height: 1.2;
      font-family: Inter-SemiBold;
      font-weight: 500;
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

  .upload-plus-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 50%;
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
  padding: 90px 106px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    /* font */
    font-family: Inter-SemiBold;
    font-size: 32px;
    font-weight: 600;
    line-height: 38.73px;
    text-align: left;
    color: #e0e0e0;
    transition: color 0.3s;
    &[data-active="true"] {
      color: #121212;
    }
  }

  .publish-btn {
    height: 53px;
    width: 100%;
    padding: 18px 36px;
    gap: 12px;
    border-radius: 12px;
    background: #f6f6f6;
    transition: background 0.3s;
    /* text-transform: uppercase; */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.015em;
    text-align: left;
    color: #e0e0e0;
    img {
      max-height: 20px;
    }

    &[data-active="true"] {
      background: #fe5c02;
      color: #ffffff;
      cursor: pointer;
    }
  }
`;

export const SelectorWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

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
    padding: 14px 40px;
    border-radius: 12px;
    background: #f6f6f6;
    cursor: pointer;

    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.015em;
    text-align: center;
    color: #545454;
    transition: color 0.3s;

    &[data-selected="true"] {
      background: #2d7fe3;
      color: #ffffff;
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
  gap: 18px;

  .tag-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .tag-item {
    padding: 12px 34px;
    border-radius: 50px;
    gap: 14px;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    gap: 14px;
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #545454;
  }
`;

export const RadioButtonGroupWrap = styled(Section)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .radio-option {
    width: 100%;
    padding: 10px;
    padding-left: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* font */
    font-family: Inter-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.015em;
    text-align: left;
    color: #000000;
    .checkbox {
      width: 27px;
      height: 27px;
      border-radius: 6px;
      background: #e2e2e2;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      > * {
        display: none;
      }
    }
    &[data-selected="true"] {
      .checkbox {
        background: #fe5c02;
        > * {
          display: block;
        }
      }
    }
  }
`;
