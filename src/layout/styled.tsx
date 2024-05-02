import styled from "styled-components";

export const Container = styled.div<{
  flex?: boolean;
}>`
  min-height: 100vh;
  width: 100%;
  background-color: #f7fbfa;
  ${prop =>
    prop.flex &&
    `
    display: flex;
    flex-direction: column;
  `}
`;

export const BodyWrapper = styled.div<{
  containerFlex?: boolean;
  flex?: boolean;
}>`
  min-height: 100vh;
  ${prop =>
    prop.containerFlex &&
    `
    min-height: auto;
    flex: 1 1 auto;
  `}
  ${prop =>
    prop.flex &&
    `
    display: flex;
    flex-direction: column;
  `}
`;
