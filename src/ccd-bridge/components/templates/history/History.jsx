import moment from "moment";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useEthMerkleProof, useWalletTransactions } from "../../../api-query/queries";
import Text from "../../../components/atoms/text/text";
import { BridgeDirection, routes } from "../../../constants/routes";
import { ccdTransactionUrl, UseEthTransactionUrl } from "../../../helpers/chain-explorer";
import isDeposit from "../../../helpers/checkTransaction";
import { toFractionalAmount } from "../../../helpers/number";
import parseTxHash from "../../../helpers/parseTxHash";
import useEthWallet from "../../../hooks/use-eth-wallet";
import { useGetTransactionToken } from "../../../hooks/use-transaction-token";
import { appContext } from "../../../root/app-context";
import { useApprovedWithdrawalsStore } from "../../../store/approved-withdraws";
import {
  useSubmittedDepositsStore,
  useSubmittedWithdrawalsStore,
} from "../../../store/submitted-transactions";
import {
  ContentWrapper,
  ExplorerLink,
  HistoryTable,
  HistoryWrapper,
  StyledTab,
  TableData,
  TableHeader,
  TableRow,
  TableTitle,
  TableWrapper,
  TabsWrapper,
  TransactionStatus,
} from "./History.style";
import { useNavigate, Link } from "react-router-dom";
import { useNetwork } from "wagmi";
import { useChainId } from "../../../store/definedChainId";

const linkClick = e => {
  e.stopPropagation();
};

const ProcessingStatus = {
  Submitted: "Submitted",
  Pending: "Pending",
  Approve: "Approve",
  Processed: "Processed",
};

const HistoryRow = ({
  originChain,
  destChain,
  formattedAmount,
  originLink,
  destLink,
  timestamp,
  status,
  onRowClick,
}) => {
  const { isMobile } = useContext(appContext);

  return (
    <TableRow onClick={onRowClick}>
      <TableData>
        <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
          {originChain}
        </Text>
      </TableData>
      <TableData>
        <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
          {destChain}
        </Text>
      </TableData>
      <TableData>
        <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
          {formattedAmount}
        </Text>
      </TableData>
      {!isMobile && (
        <>
          <TableData>
            <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
              {originLink ?? "Processing..."}
            </Text>
          </TableData>
          <TableData>
            <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
              {destLink ?? "Processing..."}
            </Text>
          </TableData>
        </>
      )}
      <TableData>
        <Text fontSize="16" fontWeight="light" fontColor="White" fontFamily="Poppins">
          {moment(timestamp * 1000).fromNow()}
        </Text>
      </TableData>
      <TableData>
        <TransactionStatus fontSize="16" fontWeight="light" fontFamily="Poppins" status={status}>
          {status}
        </TransactionStatus>
      </TableData>
    </TableRow>
  );
};

const isSubmittedTransaction = tx => tx.hash !== undefined;

const DepositRow = ({ tx, token, onRowClick }) => {
  const formattedAmount = toFractionalAmount(tx.amount, token.decimals);
  const chainId = useChainId.getState().chainId;
  const originChain = chainId === 5 ? "Goerly " : "Kava";
  const { status, ethHash, ccdHash } = isSubmittedTransaction(tx)
    ? {
        status: ProcessingStatus.Submitted,
        ccdHash: undefined,
        ethHash: tx.hash,
      }
    : {
        status: tx.status.includes("processed")
          ? ProcessingStatus.Processed
          : ProcessingStatus.Pending,
        ccdHash: tx.tx_hash,
        ethHash: tx.origin_tx_hash,
      };
  return (
    <HistoryRow
      originChain={originChain}
      destChain="Concordium"
      formattedAmount={`${formattedAmount} ${token.eth_name}`}
      originLink={
        ethHash ? (
          <ExplorerLink
            href={UseEthTransactionUrl(ethHash)}
            target="_blank"
            rel="noreferrer"
            onClick={linkClick}
          >
            {parseTxHash(ethHash)}
          </ExplorerLink>
        ) : undefined
      }
      destLink={
        ccdHash ? (
          <ExplorerLink
            href={ccdTransactionUrl(ccdHash)}
            target="_blank"
            rel="noreferrer"
            onClick={linkClick}
          >
            {parseTxHash(ccdHash)}
          </ExplorerLink>
        ) : undefined
      }
      timestamp={tx.timestamp}
      status={status}
      onRowClick={onRowClick}
    />
  );
};

const WithdrawRow = ({ tx, token, onRowClick }) => {
  const { transactions: approvedWithdrawals } = useApprovedWithdrawalsStore();
  const { origin_event_index: event_id, origin_tx_hash: tx_hash } = isSubmittedTransaction(tx)
    ? {}
    : tx;
  const { data: merkleProof } = useEthMerkleProof({ tx_hash, event_id }, false); // Disable to only get response cached from recurring query in background.

  const formattedAmount = toFractionalAmount(tx.amount, token.decimals);
  const chainId = useChainId.getState().chainId;
  const destChain = chainId === 5 ? "Goerly " : "Kava";
  let status = ProcessingStatus.Pending;
  if (isSubmittedTransaction(tx)) {
    status = ProcessingStatus.Submitted;
  } else if (tx.status.includes("processed")) {
    status = ProcessingStatus.Processed;
  } else if (merkleProof != null) {
    status = ProcessingStatus.Approve;
  }
  const { ethHash, ccdHash } = isSubmittedTransaction(tx)
    ? {
        ethHash: undefined,
        ccdHash: tx.hash,
      }
    : {
        ethHash: tx.tx_hash ?? approvedWithdrawals[tx.origin_tx_hash ?? ""],
        ccdHash: tx.origin_tx_hash,
      };

  return (
    <HistoryRow
      originChain="Concordium"
      destChain={destChain}
      formattedAmount={`${formattedAmount} ${token.ccd_name}`}
      originLink={
        ccdHash ? (
          <ExplorerLink
            href={ccdTransactionUrl(ccdHash)}
            target="_blank"
            rel="noreferrer"
            onClick={linkClick}
          >
            {parseTxHash(ccdHash)}
          </ExplorerLink>
        ) : undefined
      }
      destLink={
        ethHash ? (
          <ExplorerLink
            href={UseEthTransactionUrl(ethHash)}
            target="_blank"
            rel="noreferrer"
            onClick={linkClick}
          >
            {parseTxHash(ethHash)}
          </ExplorerLink>
        ) : undefined
      }
      timestamp={tx.timestamp}
      status={status}
      onRowClick={onRowClick}
    />
  );
};

const History = ({ depositSelected }) => {
  const { context } = useEthWallet();
  const historyQuery = useWalletTransactions();
  const { chain } = useNetwork();
  const { isMobile } = useContext(appContext);
  const navigate = useNavigate();
  const [headers, setHeaders] = useState([
    "From",
    "To",
    "Amount",
    "KAVA/ETH Trans.",
    "CCD Trans.",
    "Time",
    "Status",
  ]);
  const getTransactionToken = useGetTransactionToken();
  const { get: getSubmittedDeposits } = useSubmittedDepositsStore();
  const { get: getSubmittedWithdrawals } = useSubmittedWithdrawalsStore();
  const submittedDeposits = getSubmittedDeposits(context.account ?? "");
  const submittedWithdrawals = getSubmittedWithdrawals(context.account ?? "");
  const chainId = useChainId.getState().chainId;
  const destChain = chainId === 5 ? "Goerly " : "Kava";

  useEffect(() => {
    if (isMobile) {
      setHeaders(["From", "To", "Amount", "Time", "Status"]);
    } else {
      if (depositSelected) {
        setHeaders(["From", "To", "Amount", `${destChain} Trans.`, "CCD Trans.", "Time", "Status"]);
      } else {
        setHeaders(["From", "To", "Amount", "CCD Trans.", `${destChain}Trans.`, "Time", "Status"]);
      }
    }
  }, [depositSelected, isMobile]);

  const history = useMemo(() => {
    if (historyQuery.status !== "success") {
      return undefined;
    }
    return historyQuery.data;
  });

  useEffect(() => {
    historyQuery.refetch();
  }, [chain?.id]);

  useEffect(() => {
    // NextJS router is only available on the client, so we use `useEffect` to defer running this until the first client side render.
    if (!context.account) {
      navigate(depositSelected ? routes.deposit.path : routes.withdraw.path, { replace: true });
    }
  }, [depositSelected]);

  if (!history) {
    return (
      <ContentWrapper>
        <Text>Loading...</Text>
      </ContentWrapper>
    );
  }
  const filteredSubmittedTransactions = submittedWithdrawals.filter(
    ({ chainId }) => chainId === chain?.id,
  );
  const filteredSubmittedDeposits = submittedDeposits.filter(
    ({ chainId }) => chainId === chain?.id,
  );
  const submittedTransactions = (
    depositSelected ? filteredSubmittedDeposits : filteredSubmittedTransactions
  ).filter(
    st =>
      !history
        .map(ht => (isDeposit(ht) ? ht.Deposit.origin_tx_hash : ht.Withdraw.origin_tx_hash))
        .some(hash => hash === st.hash),
  );

  const sortedSubmittedTransactions = [...submittedTransactions].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <ContentWrapper>
      <TableTitle>
        <Text
          fontSize="18"
          fontColor="White"
          fontWeight="bold"
          style={{ textTransform: "uppercase" }}
        >
          Transaction History
        </Text>
      </TableTitle>
      <HistoryWrapper>
        <TabsWrapper>
          <Link to={routes.history(BridgeDirection.Deposit)}>
            <StyledTab active={!depositSelected} style={{ marginRight: "3px" }}>
              <Text fontWeight="bold" fontColor="White" fontFamily="Poppins" fontSize="18">
                Deposit
              </Text>
            </StyledTab>
          </Link>
          <Link to={routes.history(BridgeDirection.Withdraw)}>
            <StyledTab active={depositSelected}>
              <Text fontWeight="bold" fontColor="White" fontFamily="Poppins" fontSize="18">
                Withdraw
              </Text>
            </StyledTab>
          </Link>
        </TabsWrapper>
        {!history.isLoading && (
          <TableWrapper>
            <HistoryTable>
              <thead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader key={`${header} header`}>
                      <Text fontSize="14" fontWeight="bold" style={{ color: "#03BFFF" }}>
                        {header}
                      </Text>
                    </TableHeader>
                  ))}
                </TableRow>
              </thead>
              <tbody>
                {sortedSubmittedTransactions.map(st =>
                  depositSelected ? (
                    <DepositRow
                      key={st.hash}
                      tx={st}
                      token={st.token}
                      onRowClick={() => navigate(routes.deposit.tx(st.hash))}
                    />
                  ) : (
                    <WithdrawRow
                      key={st.hash}
                      tx={st}
                      token={st.token}
                      onRowClick={() => navigate(routes.withdraw.tx(st.hash))}
                    />
                  ),
                )}
                {history
                  .slice()
                  .sort((a, b) => {
                    const timeA = isDeposit(a) ? a.Deposit.timestamp : a.Withdraw.timestamp;
                    const timeB = isDeposit(b) ? b.Deposit.timestamp : b.Withdraw.timestamp;
                    return timeB - timeA; // Most recent transactions shown first
                  })
                  .map(tx => {
                    const tokenResponse = getTransactionToken(tx);

                    if (tokenResponse.status !== "success" || tokenResponse.token === undefined) {
                      return null;
                    }

                    if (isDeposit(tx) && depositSelected) {
                      return (
                        <DepositRow
                          key={tx.Deposit.origin_tx_hash}
                          tx={tx.Deposit}
                          token={tokenResponse.token}
                          onRowClick={() =>
                            navigate(routes.deposit.tx(tx.Deposit.origin_tx_hash ?? ""))
                          }
                        />
                      );
                    } else if (!isDeposit(tx) && !depositSelected) {
                      return (
                        <WithdrawRow
                          key={tx.Withdraw.origin_tx_hash}
                          tx={tx.Withdraw}
                          token={tokenResponse.token}
                          onRowClick={() =>
                            navigate(routes.withdraw.tx(tx.Withdraw.origin_tx_hash ?? ""))
                          }
                        />
                      );
                    }
                  })}
              </tbody>
            </HistoryTable>
          </TableWrapper>
        )}
      </HistoryWrapper>
      {/*<Link to={routes.deposit.path}>*/}
      {/*  <LinkWrapper>*/}
      {/*    <Text fontSize="12" fontColor="White">*/}
      {/*      Back*/}
      {/*    </Text>*/}
      {/*  </LinkWrapper>*/}
      {/*</Link>*/}
    </ContentWrapper>
  );
};

export default History;
