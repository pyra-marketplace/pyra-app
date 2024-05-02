import styled from "styled-components";

import { FlexRow } from "@/styled";

export const SelectorContainer = styled(FlexRow)`
  flex: 0 0 auto;
  width: 240px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  * {
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.01em;
    text-align: left;
    color: #121212;
  }

  &:hover {
    border: 1px solid #b7b7b7;
  }

  &[data-active="true"] {
    .selector-down-arrow {
      transform: rotate(180deg) translateY(-2px) translateY(50%);
    }
    .popup-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      /* row-gap: 4px; */
      /* width: auto; */
      /* transform: translateX(30%); */
    }
  }

  .selector-down-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-1px) translateY(-50%);
    transition: all 0.3s;
  }

  .popup-list {
    position: absolute;
    top: calc(100% + 10px);
    width: 100%;
    left: 0;
    /* transform: translateX(-50%); */
    background: #ffffff;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 32px;
    padding: 8px;
    z-index: 1000;
    display: none;

    .list-item {
      display: flex;
      width: 100%;
      text-align: left;
      padding: 1rem;
      border-radius: 12px;
      cursor: pointer;
      white-space: nowrap;
    }

    .list-item:hover {
      background: rgb(246, 246, 246);
    }

    .list-item[data-disabled="true"] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 10px;
      top: -10px;
    }
  }
`;
