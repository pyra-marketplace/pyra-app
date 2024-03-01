import styled from "styled-components";

export const TabButtonsWrap = styled.div`
  display: flex;
  gap: 44px;
  padding: 3px;
  align-items: center;
  background: #f4f4f4;
  border-radius: 14px;

  .tab-button {
    /* font */
    font-family: Inter-Bold;
    font-size: 20px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    background: transparent;
    color: #686a6c;
    padding: 16px 0px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &[data-active="true"] {
      background: #ffffff;
      color: #232325;
      padding: 16px 26px;
    }

    &:first-child[data-active="false"] {
      margin-left: 26px;
    }
    &:last-child[data-active="false"] {
      margin-right: 28px;
    }
  }
`;
