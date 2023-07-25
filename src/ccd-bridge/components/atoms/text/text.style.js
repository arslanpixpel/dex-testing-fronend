import styled from "styled-components";
import theme from "../../../theme/theme";

export const StyledText = styled.div`
    font-family: ${({ fontFamily }) => theme.font.family[fontFamily]};
    font-size: ${({ fontSize }) => fontSize + "px"};
    font-weight: ${({ fontWeight }) => theme.font.weight[fontWeight]};
    color: ${({ fontColor }) => theme.colors[fontColor]};
    letter-spacing: ${({ fontLetterSpacing }) => fontLetterSpacing + "px"};
    text-align: ${({ align }) => align};
`;
