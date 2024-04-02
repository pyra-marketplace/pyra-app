import styled, { createGlobalStyle } from "styled-components";

import InterBold from "@/assets/fonts/Inter/Inter-Bold.ttf";
import InterExtraBold from "@/assets/fonts/Inter/Inter-ExtraBold.ttf";
import InterExtraLight from "@/assets/fonts/Inter/Inter-ExtraLight.ttf";
import InterLight from "@/assets/fonts/Inter/Inter-Light.ttf";
import InterMedium from "@/assets/fonts/Inter/Inter-Medium.ttf";
import InterRegular from "@/assets/fonts/Inter/Inter-Regular.ttf";
import InterSemiBold from "@/assets/fonts/Inter/Inter-SemiBold.ttf";
import InterThin from "@/assets/fonts/Inter/Inter-Thin.ttf";
import LatoBold from "@/assets/fonts/Lato/Lato-Bold.ttf";
import LatoExtraBold from "@/assets/fonts/Lato/Lato-ExtraBold.ttf";
import LatoMedium from "@/assets/fonts/Lato/Lato-Medium.ttf";
import LatoRegular from "@/assets/fonts/Lato/Lato-Regular.ttf";
import LatoSemiBold from "@/assets/fonts/Lato/Lato-SemiBold.ttf";
import PoppinsBold from "@/assets/fonts/Poppins/Poppins-Bold.ttf";
import PoppinsExtraBold from "@/assets/fonts/Poppins/Poppins-ExtraBold.woff2";
import PoppinsMedium from "@/assets/fonts/Poppins/Poppins-Medium.ttf";
import PoppinsSemiBold from "@/assets/fonts/Poppins/Poppins-SemiBold.woff2";
import Poppins from "@/assets/fonts/Poppins/Poppins.ttf";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body,
  a {
    text-decoration: none;
    outline: 0;
  }

  .hideScrollbar::-webkit-scrollbar {
    display: none;
  }

  input,
  textarea {
    border: none;
    outline: none;
  }

  button {
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
  }
  
  @font-face {
    font-family: Lato-Regular;
    font-style: normal;
    src: url(${LatoRegular});
  }
  @font-face {
    font-family: Lato-Medium;
    font-style: normal;
    src: url(${LatoMedium});
  }
  @font-face {
    font-family: Lato-SemiBold;
    font-style: normal;
    src: url(${LatoSemiBold});
  }
  @font-face {
    font-family: Lato-Bold;
    font-style: normal;
    src: url(${LatoBold});
  }
  @font-face {
    font-family: Lato-ExtraBold;
    font-style: normal;
    src: url(${LatoExtraBold});
  }

  @font-face {
    font-family: Poppins;
    font-style: normal;
    src: url(${Poppins});
  }
  @font-face {
    font-family: Poppins-Medium;
    font-style: normal;
    src: url(${PoppinsMedium});
  }
  @font-face {
    font-family: Poppins-SemiBold;
    font-style: normal;
    src: url(${PoppinsSemiBold});
  }
  @font-face {
    font-family: Poppins-Bold;
    font-style: normal;
    src: url(${PoppinsBold});
  }
  @font-face {
    font-family: Poppins-ExtraBold;
    font-style: normal;
    src: url(${PoppinsExtraBold});
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    src: url(${InterRegular});
  }
  @font-face {
    font-family: Inter-Medium;
    font-style: normal;
    src: url(${InterMedium});
  }
  @font-face {
    font-family: Inter-SemiBold;
    font-style: normal;
    src: url(${InterSemiBold});
  }
  @font-face {
    font-family: Inter-Bold;
    font-style: normal;
    src: url(${InterBold});
  }
  @font-face {
    font-family: Inter-ExtraBold;
    font-style: normal;
    src: url(${InterExtraBold});
  }
  @font-face {
    font-family: Inter-ExtraLight;
    font-style: normal;
    src: url(${InterExtraLight});
  }
  @font-face {
    font-family: Inter-Light;
    font-style: normal;
    src: url(${InterLight});
  }
  @font-face {
    font-family: Inter-Thin;
    font-style: normal;
    src: url(${InterThin});
  }
`;

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
  margin: 0;
`;

export const Section = styled.section<{
  flexDirection?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  background?: string;
  padding?: string;
  margin?: string;
  flex?: string;
  overflow?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  relative?: boolean;
}>`
  display: flex;
  flex-direction: ${prop => prop.flexDirection || "column"};
  gap: ${prop => prop.gap || "0px"};
  align-items: ${prop => prop.alignItems || "flex-start"};
  justify-content: ${prop => prop.justifyContent || "flex-start"};
  background: ${prop => prop.background || "none"};
  padding: ${prop => prop.padding || "0px"};
  margin: ${prop => prop.margin || "0px"};
  flex: ${prop => prop.flex || "1 1 auto"};
  overflow: ${prop => prop.overflow || "visible"};
  width: ${prop => prop.width || "auto"};
  height: ${prop => prop.height || "auto"};
  min-height: ${prop => prop.minHeight || "auto"};
  position: ${prop => (prop.relative ? "relative" : "static")};
`;

export const AbsoluteSection = styled(Section)<{
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}>`
  position: absolute;
  top: ${prop => prop.top || "auto"};
  right: ${prop => prop.right || "auto"};
  bottom: ${prop => prop.bottom || "auto"};
  left: ${prop => prop.left || "auto"};
`;

export const FlexRow = styled.div<{
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  background?: string;
  padding?: string;
  margin?: string;
  flex?: string;
  width?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: ${prop => prop.gap || "0px"};
  align-items: ${prop => prop.alignItems || "center"};
  justify-content: ${prop => prop.justifyContent || "flex-start"};
  background: ${prop => prop.background || "none"};
  padding: ${prop => prop.padding || "0px"};
  margin: ${prop => prop.margin || "0px"};
  flex: ${prop => prop.flex || "1 1 auto"};
  width: ${prop => prop.width || "auto"};
  flex-wrap: ${prop => (prop.wrap ? "wrap" : "nowrap")};
`;

export const RoundCard = styled.div<{
  width?: string;
  height?: string;
  borderRadius?: string;
  background?: string;
}>`
  width: ${prop => prop.width || "auto"};
  height: ${prop => prop.height || "auto"};
  border-radius: ${prop => prop.borderRadius || "16px"};
  background: ${prop => prop.background || "#96ffe5"};
  img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
  }
`;

export const GridWrap = styled.div<{
  rowGap?: string;
  columnGap?: string;
  columnCount?: number;
  width?: string;
}>`
  width: ${prop => prop.width || "auto"};
  display: grid;
  grid-template-columns: repeat(
    ${prop => prop.columnCount || "auto-fill"},
    minmax(min-content, 1fr)
  );
  grid-row-gap: ${prop => prop.rowGap || "0px"};
  grid-column-gap: ${prop => prop.columnGap || "0px"};
`;

export const Divider = styled.hr<{
  width?: string;
  height?: string;
  border?: string;
  margin?: string;
}>`
  width: ${prop => prop.width || "100%"};
  height: ${prop => prop.height || "100%"};
  border: ${prop => prop.border || "1px solid #FFFFFF26"};
  margin: ${prop => prop.margin || "0px"};
`;
