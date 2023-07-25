import Text from "../../atoms/text/text";
import Hourglass from "../../../../icons/hourglass_crear.svg";
import {
  StyledButtonContainer,
  StyledCircle,
  StyledCircleWrapper,
  StyledHorizontalLine,
  StyledProcessWrapper,
  TransferAmountWrapper,
  Content,
  InfoContainer,
  StyledContainer,
} from "./TransferProgress.style";
import PageWrapper from "../../atoms/page-wrapper/PageWrapper";
import Button from "../../atoms/button/Button";
import { routes } from "../../../constants/routes";
import { useTransactionFlowStore } from "../../../store/transaction-flow";
import { useMemo, useState } from "react";
import isDeposit from "../../../helpers/checkTransaction";
import { useGetTransactionToken } from "../../../hooks/use-transaction-token";
import { useWalletTransactions } from "../../../api-query/queries";
import useEthWallet from "../../../hooks/use-eth-wallet";
import { toFractionalAmount } from "../../../helpers/number";
import { useParams, useNavigate } from "react-router-dom";
import CheckedIcon from "../../../../icons/ChackedIcon.svg";
import { useApprovalClicked } from "../../../store/approvalClicked";

const TransferStep = {
  Added: 0,
  Pending: 1,
  Processed: 2,
  Failed: -1,
};

const transferStepMap = {
  missing: TransferStep.Added,
  pending: TransferStep.Pending,
  processed: TransferStep.Processed,
  failed: TransferStep.Failed,
};

const useTransactionDetails = () => {
  const { tx } = useParams();

  if (!tx) throw new Error("Expected transaction hash to be part of url");

  const result = useWalletTransactions();
  const transaction = result.data?.find(t => {
    const hash = isDeposit(t) ? t.Deposit.origin_tx_hash : t.Withdraw.origin_tx_hash;
    return tx === hash;
  });

  const getToken = useGetTransactionToken();

  const value = { loading: result.isLoading, data: undefined };

  if (transaction === undefined) {
    return value;
  }

  const rawAmount = isDeposit(transaction)
    ? transaction.Deposit.amount
    : transaction.Withdraw.amount;
  const tokenQuery = getToken(transaction);

  if (tokenQuery.status !== "success" || tokenQuery.token === undefined) {
    return { loading: value.loading || tokenQuery.status === "loading", data: undefined };
  }

  const token = tokenQuery.token;
  const amount = BigInt(rawAmount);

  const data = {
    amount,
    token,
  };

  return { loading: false, data };
};

export const TransferProgress = props => {
  const { transferStatus, isWithdraw = false, disableContinue = false } = props;
  const { tx } = useParams();
  const isReady = tx !== undefined;
  const navigate = useNavigate();
  const [status, setStatus] = useState();
  const { data: transactionDetails, loading: transactionDetailsLoading } = useTransactionDetails();
  const {
    token: storedToken,
    amount: storedAmount,
    clear: clearFlowStore,
    transactionHash,
  } = useTransactionFlowStore();
  const amount = isReady && tx === transactionHash ? storedAmount : transactionDetails?.amount;
  const token = isReady && tx === transactionHash ? storedToken : transactionDetails?.token;
  const { context, connect: connectEth } = useEthWallet();
  const { clicked } = useApprovalClicked();

  const step = useMemo(() => transferStepMap[transferStatus ?? "missing"], [transferStatus]);
  const decimalAmount = useMemo(() => {
    if (token === undefined || amount === undefined) {
      return undefined;
    }

    return toFractionalAmount(amount, token.decimals);
  }, [amount, token]);

  const setError = message => setStatus({ isError: true, message });
  const setInfo = message =>
    setStatus(message !== undefined ? { isError: false, message } : undefined);

  const continueHandler = async () => {
    if (props.isWithdraw && props.canWithdraw) {
      setStatus(undefined);

      if (!context.active) {
        await connectEth();
      }

      await props.onRequestApproval(setError, setInfo);
    } else {
      navigate(isWithdraw ? routes.withdraw.path : routes.deposit.path);
      clearFlowStore();
    }
  };

  return (
    <PageWrapper>
      <div style={{ marginBottom: "20px" }}>
        <Text fontFamily="Poppins" fontSize="30" fontColor="White" fontLetterSpacing="0">
          Deposit in Progress
        </Text>
      </div>
      <StyledContainer>
        <Content>
          <div>
            <StyledProcessWrapper>
              <StyledHorizontalLine />
              <StyledCircleWrapper index={1}>
                {step >= 0 && (
                  <img
                    src={CheckedIcon}
                    alt=""
                    style={{ position: "absolute", left: "15px", top: "15px" }}
                  />
                )}

                <StyledCircle completed={step >= 0} />
                <Text
                  fontFamily="Poppins"
                  fontSize="16"
                  fontWeight="light"
                  fontColor="White"
                  fontLetterSpacing="0"
                >
                  Initialized
                </Text>
              </StyledCircleWrapper>

              <StyledCircleWrapper index={2}>
                {step > 0 && (
                  <img src={CheckedIcon} alt="" style={{ position: "absolute", top: "15px" }} />
                )}

                <StyledCircle completed={step > 0} />
                <Text
                  fontFamily="Poppins"
                  fontSize="16"
                  fontWeight="light"
                  fontColor="White"
                  fontLetterSpacing="0"
                >
                  Pending...
                </Text>
              </StyledCircleWrapper>

              <StyledCircleWrapper index={3}>
                {step > 1 && (
                  <img
                    src={CheckedIcon}
                    alt=""
                    style={{ position: "absolute", top: "15px", right: "11px" }}
                  />
                )}

                <StyledCircle completed={step > 1} />
                <Text
                  fontFamily="Poppins"
                  fontSize="16"
                  fontWeight="light"
                  fontColor="White"
                  fontLetterSpacing="0"
                >
                  Processed!
                </Text>
              </StyledCircleWrapper>
            </StyledProcessWrapper>
            <TransferAmountWrapper>
              {(!token || amount === undefined) && !transactionDetailsLoading && (
                <Text fontSize="16" fontColor="White" fontWeight="light" fontFamily="Poppins">
                  Could not get transaction details
                </Text>
              )}
              {(!token || amount === undefined) && transactionDetailsLoading && (
                <Text fontSize="16" fontColor="White" fontWeight="light" fontFamily="Poppins">
                  Fetching transaction details
                </Text>
              )}
              {token && decimalAmount !== undefined && (
                <>
                  <Text fontSize="16" fontColor="White" fontWeight="light" fontFamily="Poppins">
                    Transfer Amount:&nbsp;
                  </Text>
                  <Text
                    fontSize="16"
                    style={{ color: "#0196C9" }}
                    fontWeight="bold"
                    fontFamily="Poppins"
                  >
                    <>
                      {decimalAmount} {isWithdraw ? token?.ccd_name : token?.eth_name}
                    </>
                  </Text>
                </>
              )}
            </TransferAmountWrapper>
          </div>
          <InfoContainer processed={step > 1}>
            <img src={Hourglass} width={34} height={52} alt="Hourglass image" />
            <Text
              fontFamily="Poppins"
              fontSize="20"
              fontWeight="bold"
              fontColor="White"
              fontLetterSpacing="0"
              style={{ marginTop: "26px" }}
            >
              {!props.isWithdraw &&
                (step > 1 ? "Deposit processed!" : "Your deposit is in progress")}
              {props.isWithdraw && step > 1 && "Withdrawal processed!"}
              {props.isWithdraw &&
                step <= 1 &&
                (props.canWithdraw
                  ? "Your withdrawal is ready for approval."
                  : "Your withdrawal is in progress. Please come back later.")}
            </Text>
            <Text
              fontFamily="Poppins"
              fontSize="16"
              fontWeight="light"
              style={{ color: status?.isError ? "Red" : "#717A8B" }}
              fontLetterSpacing="0"
              align="center"
            >
              <>
                {status !== undefined && status.message}
                {status === undefined && (
                  <>
                    {step > 1 && "You can now see your finished transaction in History!"}
                    {step <= 1 &&
                      !props.isWithdraw &&
                      "After the transaction is processed you can also check it in your transaction history."}
                    {props.isWithdraw &&
                      step <= 1 &&
                      (props.canWithdraw
                        ? 'Click "Approve" below to submit your withdrawal approval.'
                        : "When returning to the bridge, you can return to this view by clicking on the withdrawal in the transaction history.")}
                  </>
                )}
              </>
            </Text>
          </InfoContainer>
        </Content>
      </StyledContainer>
      <StyledButtonContainer>
        {props.isWithdraw && props.canWithdraw ? (
          <Button
            variant="primary"
            disabled={disableContinue || clicked}
            onClick={continueHandler}
            style={{ backgroundColor: "#0196c9", height: "inherit" }}
          >
            <div style={{ position: "relative" }}>
              <Text
                fontFamily="Poppins"
                fontSize="16"
                fontColor="White"
                fontWeight="bold"
                style={{ padding: "20px 64px" }}
              >
                Approve
              </Text>
            </div>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={continueHandler}
            disabled={disableContinue}
            style={{ backgroundColor: "#0196c9", height: "inherit" }}
          >
            <div style={{ position: "relative" }}>
              <Text
                fontFamily="Poppins"
                fontSize="16"
                fontColor="White"
                fontWeight="bold"
                style={{ padding: "20px 64px" }}
              >
                Continue
              </Text>
            </div>
          </Button>
        )}
      </StyledButtonContainer>
    </PageWrapper>
  );
};
