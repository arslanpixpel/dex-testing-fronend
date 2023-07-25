import Button from "../../atoms/button/Button";
import PageWrapper from "../../atoms/page-wrapper/PageWrapper";
import { useState } from "react";
import Text from "../../atoms/text/text";
import { ButtonsContainer, StyledContainer, StyledProcessWrapper } from "./TransferOverview.style";
import { routes } from "../../../constants/routes";
import { useTransactionFlowStore } from "../../../store/transaction-flow";
import EthereumLogo from "../../../../icons/EthereumLogo.svg";
import ConcordiumLogo from "../../../../icons/ConcordiumLogo.svg";

import { useNavigate } from "react-router-dom";

export const TransferOverviewLine = ({ isEth = false, title, details, completed = false }) => (
  <StyledProcessWrapper strikeThrough={completed}>
    <img
      src={isEth ? EthereumLogo : ConcordiumLogo}
      alt={isEth ? "Ethereum Icon" : "Concordium Icon"}
      height="30"
      width="30"
    />
    <div>
      <Text
        fontFamily="Poppins"
        fontSize="16"
        fontWeight="light"
        style={{ color: completed ? "#717A8B" : "#FFFFFF" }}
        fontLetterSpacing="0"
      >
        {title}
      </Text>
      <Text
        fontFamily="Poppins"
        fontSize="16"
        fontWeight="bold"
        fontLetterSpacing="0"
        style={{ color: completed ? "#717A8B" : "#0196C9" }}
      >
        {details}
      </Text>
    </div>
  </StyledProcessWrapper>
);

export const useTransferOverviewStatusState = () => {
  const [status, setStatus] = useState();
  const setError = message => setStatus({ isError: true, message });
  const setInfo = message => setStatus({ isError: false, message });

  return {
    status,
    setError,
    setInfo,
  };
};

export const TransferOverview = ({
  handleSubmit,
  status,
  title,
  timeToComplete,
  pendingWalletSignature,
  isDeposit = false,
  children,
}) => {
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const { setTransactionHash } = useTransactionFlowStore();
  const navigate = useNavigate();

  const submit = async () => {
    setPendingSubmission(true);
    const hash = await handleSubmit();
    setPendingSubmission(false);

    if (hash) {
      const nextRoute = isDeposit ? routes.deposit.tx(hash) : routes.withdraw.tx(hash);
      setTransactionHash(hash);
      navigate(nextRoute);
    }
  };

  const cancel = () => {
    if (pendingWalletSignature) {
      const confirmed = window.confirm(
        `There is a pending wallet signature in your ${
          isDeposit ? "Ethereum" : "Concordium"
        } wallet, which can be safely rejected when cancelling this flow.`,
      );

      if (!confirmed) {
        return;
      }
    }

    navigate(-1);
  };

  return (
    <PageWrapper>
      <div style={{ marginBottom: "20px" }}>
        <Text fontFamily="Poppins" fontSize="30" fontColor="White" fontLetterSpacing="0">
          {title}
        </Text>
      </div>
      <StyledContainer>
        <div>
          <Text
            fontFamily="Poppins"
            fontSize="20"
            fontWeight="bold"
            fontColor="White"
            fontLetterSpacing="0"
          >
            {timeToComplete}
          </Text>
          <div style={{ marginTop: 64 }} />
          <Text
            fontFamily="Poppins"
            fontSize="16"
            fontWeight="light"
            fontColor="White"
            fontLetterSpacing="0"
          >
            Transactions required:
          </Text>

          <div style={{ marginTop: 16 }} />
          {children}
        </div>
        <Text
          fontSize="16"
          fontFamily="Poppins"
          fontWeight="light"
          style={{ color: status?.isError ? "Red" : "#717A8B" }}
          align="center"
        >
          {status ? status.message : <>&nbsp;</>}
        </Text>
        <ButtonsContainer>
          <Button
            onClick={cancel}
            style={{ height: "inherit", padding: "20px", background: "#37404C", border: "none" }}
          >
            <div style={{ position: "relative" }}>
              <Text fontSize="18" fontColor="White" fontWeight="regular" fontFamily="Poppins">
                Cancel
              </Text>
            </div>
          </Button>
          <Button
            disabled={pendingSubmission}
            onClick={submit}
            style={{ height: "inherit", padding: "20px", background: "#0196C9", border: "none" }}
          >
            <div style={{ position: "relative" }}>
              <Text fontSize="18" fontColor="White" fontWeight="regular" fontFamily="Poppins">
                Continue
              </Text>
            </div>
          </Button>
        </ButtonsContainer>
      </StyledContainer>
    </PageWrapper>
  );
};
