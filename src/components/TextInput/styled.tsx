import styled from "styled-components";

export const TextInputWrap = styled.div<{
  type: "text" | "textarea";
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .input-title {
    /* font */
    font-family: Inter-SemiBold;
    font-size: 16px;
    font-weight: 600;
    line-height: 19.36px;
    letter-spacing: -0.015em;
    text-align: left;
    color: #e0e0e0;
    transition: color 0.3s;
    &[data-active="true"] {
      color: #121212;
    }
  }

  .input-wrap {
    width: 100%;
    height: 65px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    ${prop =>
      prop.type === "textarea" &&
      `
        height: 130px;
        align-items: flex-start;
    `}
  }

  input,
  textarea {
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
    font-family: Inter-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 24.2px;
    letter-spacing: -0.015em;
    text-align: left;
    color: #121212;
  }
  textarea {
    resize: none;
    height: 100%;
    /* font */
    font-family: Inter-Medium;
    font-size: 20px;
    font-weight: 500;
    line-height: 24.2px;
    letter-spacing: -0.015em;
    text-align: left;
    color: #121212;
  }

  .edit-icon {
    path {
      stroke: #b1b5b1;
      transition: stroke 0.3s;
    }
  }
`;
