import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

// Utils
import { handleConnect } from "../utils/connect";

export const useWalletConnect = () => {
  const dispatch = useDispatch();
  const isConnectCalled = useRef(false);

  useEffect(() => {
    if (!isConnectCalled.current) {
      dispatch(handleConnect());
      isConnectCalled.current = true;
    }
  }, [dispatch]);
};
