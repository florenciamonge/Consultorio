import { Card, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

export const v = {
  // Dimensiones
  sidebarWidth: "200px",
  sidebarWidthInitial: "",
  smSpacing: "0.5rem",
  mdSpacing: "1rem",
  lgSpacing: "1.5rem",
  xlSpacing: "2rem",
  xxlSpacing: "3rem",
  borderRadius: "0.375rem",
  // Tipografía
  fontFamily: "'Gotham', sans-serif",
  fontSizeSm: "1rem",
  fontSizeMd: "1.3rem",
  fontSizeLg: "1.6rem",
  fontWeightNormal: "400",
  fontWeightBold: "700",
  lineHeight: "1.5",
  // Colores
  primaryColor: "#007bff",
  secondaryColor: "#6c757d",
  successColor: "#28a745",
  dangerColor: "#dc3545",
  warningColor: "#ffc107",
  infoColor: "#17a2b8",
  lightColor: "#f8f9fa",
  darkColor: "#343a40",
  whiteColor: "#ffffff",
  blackColor: "#000000",
  // Sombras
  shadowSm: "0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)",
  shadowMd: "0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)",
  shadowLg: "0 0.800rem 0.9375rem rgba(0, 0, 0, 0.1)",
  shadowXl: "0 1.25rem 1.5625rem rgba(0, 0, 0, 0.1)",
};

export const PageContainer = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: ${v.mdSpacing} ${v.lgSpacing};
  transition: all 0.3s;

  .content-header-title {
    height: 100%;
    display: flex;
    align-items: end;
    justify-content: start;
    text-align: end;
    margin: 0;
    font-size: ${v.fontSizeMd};
  }
`;

export const SubTitleSection = styled.h2`
  font-size: 18px;
  font-weight: 600;
  padding: 0;
  margin: 0;
  word-break: break-word;
  line-break: normal;
  hyphens: auto;
  overflow-wrap: break-word;
`;

export const Label = styled.label`
  font-size: 0.8rem;
  width: max-content;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0;
  padding-right: ${v.smSpacing};
  margin: 0;
`;

export const ScrollYModalStyles = styled(Col)`
  max-height: 250px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  height: "auto";
  margin: 0 auto;
  padding: 0;
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const theme = {
  bg: "rgb(255,255,255)",
  bgAlpha: "rgba(250,250,250,.3)",
  bg2: "rgb(245,245,245)",
  bg3: "rgb(230,230,230)",
  text: "rgb(45,45,45)",
  primary: "rgb(52, 131, 235)",
  success: "#198754",
  danger: "#dc3545",
};

export const btnReset = css`
  font-family: inherit;
  outline: none;
  border: none;
  background: none;
  letter-spacing: inherit;
  color: inherit;
  font-size: inherit;
  text-align: inherit;
  padding: 0;
`;

export const LogoImage = styled(Card.Img)`
  width: 5rem;
  margin: 2rem 2rem;
  filter: invert(1); /* Cambiar el color del logo a invertido */
`;

export const LogoImageResponsive = styled.div`
  display: "flex";
  justify-content: center;
  width: 5rem;
  margin: 2rem 2rem;
  filter: invert(0);
`;

export const CardTitle = styled(Card.Title)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-end;
  font-size: 1.6rem;
  text-align: center;
  padding: 1rem;
  margin-bottom: 0;
`;

// Pasar una url de imagen como propiedad al styled component
export const ImagePageContainer = styled.div<{ image: string }>`
  display: block;
  width: 100%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.3)
    );
  }
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
`;
