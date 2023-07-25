import styled from "styled-components";
import theme from "../../../theme/theme";
import Container from "../../atoms/container/Container";

export const StyledContainer = styled(Container)`
  padding: 27px 40px 29px;
  background: #29313c;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 20px;
  & > :first-child {
    margin-right: 35px;
  }
`;

export const StyledProcessWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;

  ${p =>
    p.strikeThrough &&
    `
        &::after {
            content: "";
            display: block;
            position: absolute;
            bottom: 75%;
            width: 100%;
            height: 1px;
            background-color: ${theme.colors.White}
        }
    `}
`;
