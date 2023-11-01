import { useDispatch, useSelector } from "react-redux";
import { handleConnect } from "../../../utils/connect";

const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const provider = useSelector(s => s.connect.provider);
  const account = useSelector(s => s.connect.account);

  const onClickHandler = () => {
    dispatch(handleConnect());
  };

  const isConnected = !!provider && !!account;

  const shortAccount = `${account.slice(0, 2)}...${account.slice(-4)}`;

  if (isConnected)
    return (
      <div className="hidden md:block" data-type="clickable" title={account}>
        account: <span>{shortAccount}</span>
      </div>
    );

  return (
    <button
      className="flex items-center justify-center rounded-md cursor-pointer hover:bg-app-blue px-8 py-3 hidden md:block"
      onClick={onClickHandler}
      data-type="clickable"
      type="button"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
