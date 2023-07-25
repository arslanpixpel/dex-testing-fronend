import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 490px;
  height: auto;
  overflow-y: auto;
  box-shadow: 0px 6px 10px #00000014;
  border-radius: 6px;

  @media only screen and (max-width: 1050px) {
    width: 100%;
    height: 500px;
  }

  @media only screen and (max-width: 540px) {
    height: 628px;
  }
`;
