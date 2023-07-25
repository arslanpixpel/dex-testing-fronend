import styled from "styled-components";
import theme from "../../../theme/theme";
import Container from "../../atoms/container/Container";
import Text from "../../atoms/text/text";
import Box from "@mui/material/Box";
import { List, FormControl } from "@mui/material";
import Select from "@mui/material/Select";

export const StyledContainer = styled(Container)`
  padding: 27px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #29313c;
  height: auto;
`;

export const FirstRow = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 50px;

  @media only screen and (max-width: 540px) {
    flex-direction: column;
  }
`;

export const SecondRow = styled.div`
  background: #37404c;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
  border-radius: 5px;
  justify-content: space-between;
  padding: 15px 22px;
`;

export const DropdownButton = styled.button`
  position: relative;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
`;

export const MaxGapRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    ${({ input }) => (input ? "width: 100%" : "cursor: pointer")};
  }
`;

export const CoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  position: relative;

  @media only screen and (max-width: 540px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const CoinSelect = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #37404c;
  height: auto;
  width: 100%;
  padding: 20px 22px;
  border-radius: 5px;
`;

export const NetworkBox = styled(Box)({
  minWidth: "200px",
  padding: "16px",
});

export const NetworkList = styled(List)({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const CoinPicker = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const Coin = styled.div`
  display: flex;
  align-items: center;
`;

export const OrderText = styled(Text)`
  margin-bottom: 10px;
  color: ${theme.colors.White};
  margin-left: 5px;
`;

export const StyledCoinText = styled(Text)`
  color: white;
  font-family: "Poppins", serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-left: 7px;
  text-transform: uppercase;

  &:hover {
    color: #0095c8;
  }
`;

export const SwapLink = styled.a`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 53px;
  width: 53px;
  background: #37404c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  @media only screen and (max-width: 540px) {
    top: 137.5px;
  }
`;

export const StyledButtonShine = styled.img`
  position: absolute;
  right: -12px;
  bottom: -13px;
`;

export const Dropdown = styled.div`
  position: relative;
  padding-left: 10px;
  cursor: pointer;
`;

export const DropdownList = styled.div`
  position: absolute;
  top: 130%;
  left: -16px;
  box-shadow: 0 6px 10px #00000014;
  border-radius: 5px;
  background-color: #37404c;
  z-index: 150;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s all;
  max-height: 156px;
  overflow-x: hidden;
  & > * {
    width: 100%;
    cursor: pointer;
    padding: 10px 16px;
    margin: 0;
    transition: 0.2s all;
  }

  ${({ open }) =>
    open &&
    `
  opacity: 1;
  pointer-events: all;
  `}
  scrollbar-width: thin; //Firefox
  scrollbar-color: ${theme.colors.TextBrown +
  " " + //space here to not break with prettier
  "#d9d4ce"};

  //Rest of browsers (I think)
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #474e58;
  }
  ::-webkit-scrollbar-thumb {
    background: #0196c9;
  }
`;

export const LinkWrapper = styled.a`
  display: block;
  margin-top: 32px;
  user-select: none;
  background: #29313c;
  padding: 10px 27px;

  &[hidden] {
    visibility: hidden;
    position: relative;
    left: -9999px;
  }

  @media only screen and (max-width: 1050px) {
    position: relative;
    width: fit-content;
  }
`;

export const StyledWalletDisplay = styled.div`
  padding: 4px 8px;
  border: 1px solid grey;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  color: white;

  &::before {
    content: "Copied!";
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  ${({ copied }) =>
    copied &&
    `&::before {
  opacity: 1;
}`}
`;

export const StyledFormControl = styled(FormControl)`
  background: #37404c;
  border-radius: 5px;
`;

export const StyledSelect = styled(Select)`
  & .MuiSelect-select {
    padding: 20px 22px;
    display: flex;
    gap: 7px;
    color: white;
    font-family: "Poppins", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-transform: uppercase;
  }
  & .MuiSelect-icon {
    fill: #717a8b;
  }

  & .MuiMenuItem-root {
    color: blue;
  }

  & .MuiOutlinedInput {
    border: none;
  }
`;
