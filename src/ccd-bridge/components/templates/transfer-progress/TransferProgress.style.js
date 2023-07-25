import Container from "../../atoms/container/Container";
import theme from "../../../theme/theme";
import styled from "styled-components";

export const StyledContainer = styled(Container)`
  gap: 30px;
`;

export const StyledProcessWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledCircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ index }) => (index === 1 ? "flex-start" : index === 2 ? "center" : "flex-end")};
  z-index: 1;
  & > :last-child {
    position: absolute;
    top: 125%;
  }
`;

export const StyledCircle = styled.div`
  border: ${({ completed }) => (completed ? "5px solid #2EBD85" : "5px solid #ffffff")};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  background-color: #29313c;
`;

export const StyledHorizontalLine = styled.hr`
  position: absolute;
  width: 100%;
  border: 1px dashed #717a8b;
  z-index: 0;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 63px;
`;

export const TransferAmountWrapper = styled.div`
  width: calc(100% + 80px);
  margin-left: -40px;
  height: 48px;
  background-color: #37404c;
  padding: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 68px;
`;

export const ModalTitle = styled.div`
  width: 100%;
  height: 80px;
  padding: 28px 40px 0;
  background-color: ${theme.colors.ModalBackground};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 40px 28px;
  overflow-y: auto;
  background-color: #29313c;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;

  & > * {
    margin-bottom: 4px !important;
  }

  & > :nth-child(2) {
    ${({ processed }) => processed && "color: #00aa70;"}
  }
`;
