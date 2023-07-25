function isDeposit(transaction) {
  return (
    transaction &&
    typeof transaction.Deposit !== "undefined" &&
    typeof transaction.Deposit.tx_hash !== "undefined"
  );
}

export default isDeposit;
