import theme from "../../../theme/theme";
import styled from "styled-components";

export const StyledInput = styled.input`
  border: none;
  outline: none;
  font-family: Roboto;
  font-size: 25px;
  font-weight: regular;
  color: ${props => (props.valid ? theme.colors.Black : theme.colors.Red)};
  letter-spacing: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
