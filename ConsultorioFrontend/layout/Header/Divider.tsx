import React from "react";
import styled from "styled-components";
import { theme, v } from "../../styles";

interface PropsStyles {
	getCurrentTheme: Record<string, string>;
	colorBorder?: string;
	spacePadding?: string;
	spaceMargin?: string;
}

interface PropsComponent {
	spacePadding?: string;
	spaceMargin?: string;
	direction?: string;
	colorBorder?: string;
}

export const DividerStyle = styled.div`
	height: 1px;
  	width: 100%;
  	background: ${theme.bg3};
  	margin: ${v.smSpacing } 0 ;
	
`;

const Divider = () => {
	return (
		<DividerStyle
		></DividerStyle>
	);
};

export default Divider;
