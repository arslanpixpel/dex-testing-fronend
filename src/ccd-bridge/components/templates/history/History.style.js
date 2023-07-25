import Container from "../../../components/atoms/container/Container";
import PageWrapper from "../../../components/atoms/page-wrapper/PageWrapper";
import Text from "../../../components/atoms/text/text";
import theme from "../../../theme/theme";
import styled from "styled-components";

export const ContentWrapper = styled(PageWrapper)``;

export const HistoryWrapper = styled(Container)`
  overflow: hidden;
  background: #29313c;
  height: 500px;
  width: 1000px;
`;

export const TableTitle = styled.div`
  width: 263px;
  height: 64px;
  padding: 10px 27px;
  background: #29313c;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

export const TableWrapper = styled.div`
  width: 100%;
  height: calc(100% - 100px);
  overflow-y: auto;
  background-color: #29313c;

  overflow-y: auto;
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

export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  & > tbody > :last-child {
    border-bottom: none;
  }
  & > thead > tr > th {
    white-space: nowrap;
  }

  @media only screen and (max-width: 540px) {
    & > thead > tr > :first-child {
      padding-left: initial;
    }
    & > tbody > tr > :first-child {
      padding-left: initial;
    }
  }
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
`;

export const TableRow = styled.tr`
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #3232390f;
  background: #29313c;
`;

export const TableData = styled.td`
  padding: 10px;
  white-space: nowrap;
`;

export const LinkWrapper = styled.a`
  margin-top: 32px;
  user-select: none;
  text-decoration: underline;
`;

export const ExplorerLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  background-color: #29313c;
`;

export const StyledTab = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 25px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#29313C" : "#0196c9")};
  border-radius: 5px 5px 0px 0px;
`;

export const TransactionStatus = styled(Text)`
  background: ${({ status }) => {
    if (status === "Processed") return theme.colors.Green;
    if (status === "Approve") return theme.colors.DarkYellow;
    return theme.colors.DarkGrey;
  }};
  color: white;
  display: inherit;
  padding: 0 4px;
  border-radius: 3px;
`;
