import styled from "styled-components";

export const TabButtonsWrap = styled.div<{
  small?: boolean;
  plain?: boolean;
}>`
  display: flex;
  gap: ${prop => (!prop.small ? "44px" : "0px")};
  padding: ${prop => (prop.small ? "2px" : "3px")};
  align-items: center;
  background: ${prop => (prop.small ? "#F5F5F5" : "#f4f4f4")};
  border-radius: 14px;

  ${prop =>
    prop.plain
      ? `
        background: transparent;
        gap: 40px;
        padding: 0;
      `
      : undefined}

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
    padding: ${prop => (prop.small ? "10px" : "16px 0px")};
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    ${prop =>
      prop.plain
        ? `
        font-family: Inter-SemiBold;
        font-size: 24px;
        font-weight: 600;
        line-height: 29.05px;
        letter-spacing: -1%;
        color: #545454;
        padding: 0;
        border-radius: 0;
      `
        : undefined}

    &[data-active="true"] {
      background: #ffffff;
      color: #232325;
      ${prop => (!prop.small ? "padding: 16px 26px;" : undefined)}
      ${prop =>
        prop.plain
          ? `
            padding: 0;
            background: none;
            color: #121212;
          `
          : undefined}
    }

    ${prop =>
      !prop.small && !prop.plain
        ? `
      &:first-child[data-active="false"] {
        margin-left: 26px;
      }
      &:last-child[data-active="false"] {
        margin-right: 28px;      
      }
      `
        : undefined}
  }
`;
