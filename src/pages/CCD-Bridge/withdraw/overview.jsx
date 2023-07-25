import TransferOverview, {
  TransferOverviewLine,
  useTransferOverviewStatusState,
} from "../../../ccd-bridge/components/templates/transfer-overview";
import { useEffect, useMemo, useState } from "react";
import useCCDWallet from "../../../ccd-bridge/hooks/use-ccd-wallet";
import useCCDContract from "../../../ccd-bridge/contracts/use-ccd-contract";
import { routes } from "../../../ccd-bridge/constants/routes";
import useEthWallet from "../../../ccd-bridge/hooks/use-eth-wallet";
import { useNextMerkleRoot } from "../../../ccd-bridge/api-query/queries";
import moment from "moment";
import { useTransactionFlowStore } from "../../../ccd-bridge/store/transaction-flow";
import { ensureDefined, noOp } from "../../../ccd-bridge/helpers/basic";
import { useAsyncMemo } from "../../../ccd-bridge/hooks/utils";
import { getPrice } from "../../../ccd-bridge/helpers/price-usd";
import {
  getEnergyToMicroCcdRate,
  waitForTransactionFinalization,
} from "../../../ccd-bridge/helpers/ccd-node";
import transactionCosts from "../../../ccd-bridge/config/transaction-cost";
import useRootManagerContract from "../../../ccd-bridge/contracts/use-root-manager";
import { renderEnergyFeeEstimate, renderGasFeeEstimate } from "../../../ccd-bridge/helpers/fee";
import Text from "../../../ccd-bridge/components/atoms/text/text";
import { useSubmittedWithdrawalsStore } from "../../../ccd-bridge/store/submitted-transactions";
import { useNavigate } from "react-router-dom";

const LINE_DETAILS_FALLBACK = "...";

const withdrawEnergyDefault = BigInt(transactionCosts.ccd.bridgeManagerWithdrawEnergy);

const ApprovalAllowanceLine = ({ hasAllowance, token, ccdPrice, microCcdPerEnergy }) => {
  const { ccdContext } = useCCDWallet();
  const { estimateApprove } = useCCDContract(ccdContext.account, !!ccdContext.account);
  const [error, setError] = useState();
  const microCcdFee = useAsyncMemo(
    async () => {
      if (microCcdPerEnergy === undefined) {
        return undefined;
      }

      const energy = await estimateApprove(token);
      if (energy === undefined) {
        return undefined;
      }

      return microCcdPerEnergy * energy.exact;
    },
    () => setError("Could not get fee estimate"),
    [token, microCcdPerEnergy],
  );

  const details = useMemo(
    () =>
      microCcdFee !== undefined
        ? renderEnergyFeeEstimate(microCcdFee, ccdPrice)
        : error || LINE_DETAILS_FALLBACK,
    [microCcdFee, ccdPrice, error],
  );

  return (
    <TransferOverviewLine
      title={`Add operator for ${token.ccd_name}`}
      details={details}
      completed={hasAllowance}
    />
  );
};

const WithdrawLine = ({ token, amount, ethAccount, ccdPrice, microCcdPerEnergy, hasAllowance }) => {
  const { ccdContext } = useCCDWallet();
  const { estimateWithdraw } = useCCDContract(ccdContext.account, !!ccdContext.account);
  const [error, setError] = useState();
  const microCcdFee = useAsyncMemo(
    async () => {
      if (microCcdPerEnergy === undefined) {
        return undefined;
      }

      let energy;
      try {
        const estimate = await estimateWithdraw(amount, token, ethAccount);
        energy = estimate?.exact ?? withdrawEnergyDefault;
      } catch {
        energy = withdrawEnergyDefault;
      }

      return microCcdPerEnergy * energy;
    },
    () => setError("Could not get fee estimate"),
    [token, microCcdPerEnergy, hasAllowance],
  );

  const details = useMemo(
    () =>
      microCcdFee !== undefined
        ? renderEnergyFeeEstimate(microCcdFee, ccdPrice)
        : error || LINE_DETAILS_FALLBACK,
    [microCcdFee, ccdPrice, error],
  );

  return <TransferOverviewLine title={`Withdraw ${token.ccd_name}`} details={details} />;
};

const ApproveWithdrawLine = ({ token }) => {
  const [error, setError] = useState();
  const ethPrice = useAsyncMemo(async () => getPrice("ETH"), noOp, []) ?? 0;
  const { getDefaultWithdrawEstimate } = useRootManagerContract();
  const fee = useAsyncMemo(
    async () => {
      const g = await getDefaultWithdrawEstimate(token);
      const gas = ensureDefined(g, "Could not estimate gas");
      return parseFloat(gas);
    },
    () => setError("Could not estimate gas"),
    [token],
  );

  const details = useMemo(
    () =>
      fee !== undefined
        ? `${renderGasFeeEstimate(fee, ethPrice)}*`
        : error || LINE_DETAILS_FALLBACK,
    [fee, ethPrice, error],
  );

  return (
    <TransferOverviewLine isEth title={`Approve withdraw ${token.eth_name}`} details={details} />
  );
};

const WithdrawOverview = () => {
  const { ccdContext } = useCCDWallet();
  const { context } = useEthWallet();
  const navigate = useNavigate();
  const { data: nextMerkleRoot, isLoading } = useNextMerkleRoot();
  const { amount, token } = useTransactionFlowStore();
  const { status, setInfo, setError } = useTransferOverviewStatusState();
  const [needsAllowance, setNeedsAllowance] = useState();
  const ccdPrice = useAsyncMemo(async () => getPrice("CCD"), noOp, []) ?? 0;
  const microCcdPerEnergy = useAsyncMemo(getEnergyToMicroCcdRate, noOp, []);
  const { add: addSubmitted } = useSubmittedWithdrawalsStore();
  const [pendingSignature, setPendingSignature] = useState(false);

  const {
    withdraw: ccdWithdraw,
    approve: ccdApprove,
    hasApprove,
    estimateApprove,
    estimateWithdraw,
  } = useCCDContract(ccdContext.account, !!ccdContext.account);

  const timeToComplete = useMemo(() => {
    if (!isLoading && !nextMerkleRoot) {
      return "Could not get an estimated processing time";
    }
    if (nextMerkleRoot !== undefined) {
      const nextMerkleRootRelativeTime = moment(nextMerkleRoot * 1000).fromNow();
      return `Withdrawal expected to be ready for approval ${nextMerkleRootRelativeTime}`;
    }

    return "Getting estimated withdrawal processing time";
  }, [nextMerkleRoot, isLoading]);

  useEffect(() => {
    if (token !== undefined) {
      hasApprove({
        index: token.ccd_contract?.index,
        subindex: token.ccd_contract?.subindex,
      }).then(allowance => setNeedsAllowance(!allowance));
    }
  }, [token]);

  useEffect(() => {
    if (!amount || !token || !context.account) {
      navigate(routes.withdraw.path, { replace: true });
    }
  }, []);

  //
  // Check necessary values are present from transfer page. These will not be available if this is the first page loaded in the browser.
  if (!amount || !token || !context.account) {
    return null;
  }

  const requestWithdrawApproval = async () => {
    try {
      const approvalFee = await estimateApprove(token);

      setPendingSignature(true);
      setInfo("Awaiting allowance approval in Concordium wallet");
      const hash = await ccdApprove(token, approvalFee?.conservative);
      setPendingSignature(false);

      setInfo("Waiting for transaction to finalize");
      const hasApproval = await waitForTransactionFinalization(hash);

      setNeedsAllowance(false);
      return hasApproval;
    } catch {
      // Either the allowance approval was rejected, or a timeout happened while polling for allowance approval finalization
      setPendingSignature(false);
      setError("Allowance appproval rejected");

      return false;
    }
  };

  /**
   * Handles submission of the withdraw transaction.
   */
  const onSubmit = async () => {
    if (!context?.account) {
      throw new Error("Expected eth account to be available");
    }

    if (needsAllowance && !(await requestWithdrawApproval())) {
      return undefined;
    }

    let hash;
    try {
      const withdrawFee = await estimateWithdraw(amount, token, context.account);
      setPendingSignature(true);
      setInfo("Awaiting signature in Concordium wallet for withdrawal");
      hash = await ccdWithdraw(amount, token, context.account, withdrawFee?.conservative);
    } catch (e) {
      console.log(e);
      setError("Transaction was rejected");
    } finally {
      setPendingSignature(false);
    }

    if (hash === undefined) {
      return;
    }
    try {
      setInfo("Waiting for transaction to finalize");
      await waitForTransactionFinalization(hash); // Wait for transaction finalization, as we do in the deposit flow.
      addSubmitted(context.account, hash, amount, token);

      return hash;
    } catch {
      setError("Could not get transaction status for withdrawal");
    }
  };
  return (
    <TransferOverview
      title="Withdrawal overview"
      handleSubmit={onSubmit}
      timeToComplete={timeToComplete}
      status={status}
      pendingWalletSignature={pendingSignature}
    >
      <ApprovalAllowanceLine
        hasAllowance={needsAllowance === false}
        token={token}
        ccdPrice={ccdPrice}
        microCcdPerEnergy={microCcdPerEnergy}
      />
      <br />
      <WithdrawLine
        hasAllowance={needsAllowance === false}
        token={token}
        ccdPrice={ccdPrice}
        microCcdPerEnergy={microCcdPerEnergy}
        ethAccount={context.account}
        amount={amount}
      />
      <br />
      <ApproveWithdrawLine token={token} />
      <Text
        fontFamily="Poppins"
        fontSize="14"
        fontWeight="regular"
        fontLetterSpacing="0"
        style={{ color: "#717A8B", marginTop: "25px" }}
      >
        *Price is based on history of transactions of similar types and can vary depending on
        network activity at the time of the transaction
      </Text>
      <div style={{ marginTop: 12 }} />
    </TransferOverview>
  );
};

export default WithdrawOverview;
