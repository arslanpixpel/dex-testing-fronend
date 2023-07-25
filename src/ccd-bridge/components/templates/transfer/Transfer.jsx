import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ArrowIcon from "../../../../icons/ArrowIcon.svg";
import ConcordiumIcon from "../../../../icons/ConcordiumLogo.svg";
import EthereumLogo from "../../../../icons/EthereumLogo.svg";
import KavaIcon from "../../../../icons/kava-io-kava-seeklogo.com.svg";
import ShuffleIcon from "../../../../icons/ShuffleIcon.svg";
import Text from "../../../../ccd-bridge/components/atoms/text/text";
import { useTokens } from "../../../api-query/queries";
import network from "../../../config/network";
import { CCD_MAINNET_GENESIS, CCD_TESTNET_GENESIS } from "../../../constants/network";
import { BridgeDirection, routes } from "../../../constants/routes";
import useCCDContract from "../../../contracts/use-ccd-contract";
import { noOp } from "../../../helpers/basic";
import { toFractionalAmount } from "../../../helpers/number";
import useCCDWallet from "../../../hooks/use-ccd-wallet";
import useEthWallet from "../../../hooks/use-eth-wallet";
import { useAsyncMemo } from "../../../hooks/utils";
import { useTransactionFlowStore } from "../../../store/transaction-flow";
import Button from "../../atoms/button/Button";
import Input from "../../atoms/input/input";
import PageWrapper from "../../atoms/page-wrapper/PageWrapper";
import {
  Coin,
  CoinContainer,
  CoinPicker,
  CoinSelect,
  Dropdown,
  DropdownButton,
  DropdownList,
  LinkWrapper,
  MaxGapRow,
  SecondRow,
  StyledCoinText,
  StyledContainer,
  SwapLink,
  OrderText,
  FirstRow,
  StyledFormControl,
  StyledSelect,
} from "./Transfer.style";
import { useNetwork } from "wagmi";
import { useChainId } from "../../../store/definedChainId";
import { MenuItem } from "@mui/material";

const NetworkSelector = ({ switchNetwork, chains, text, isDeposit }) => {
  const [network, setNetwork] = useState(2221);
  const [open, setOpen] = useState(false);
  const { chain } = useNetwork();
  const { setChainId } = useChainId();
  const selectedChainBase = chains.find(n => n.id === network);
  useEffect(() => {
    if (chain?.id) {
      setNetwork(chain?.id);
      setChainId(chain?.id);
    }
  }, [chain?.id]);

  const handleChange = event => {
    const { value } = event.target;
    setNetwork(value);
    switchNetwork && switchNetwork(value);
  };
  const handleConnectClick = () => {
    selectedChainBase?.connect && selectedChainBase.connect();
  };

  return (
    <>
      <OrderText>{text}</OrderText>
      <StyledFormControl sx={{ mt: -2 }}>
        <StyledSelect
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          style={{
            borderRadius: "inherit",
          }}
          value={network}
          sx={{
            "& fieldset": {
              border: "none",
            },
            position: "relative",
          }}
          onChange={handleChange}
          inputProps={{ "aria-label": "Without label" }}
          MenuProps={{
            disableScrollLock: true,
            MenuListProps: {
              style: {
                background: "#37404C",
              },
            },
            PaperProps: {
              style: {
                borderRadius: "inherit",
              },
            },
          }}
        >
          {chains.map(chain => {
            return (
              <MenuItem
                value={chain.id}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "16px",
                  lineHeight: "24px",
                  textTransform: "uppercase",
                  gap: "10px",
                  padding: "20px",
                  position: "relative",
                }}
              >
                <img src={chain.icon} alt={`${chain.name} icon`} height="23.13" width="23.13" />
                {chain.name}
              </MenuItem>
            );
          })}
        </StyledSelect>
      </StyledFormControl>
      {!open && !selectedChainBase?.account && (
        <Button
          style={{
            backgroundColor: "#0095C8",
            height: "30px",
            fontSize: "14px",
            fontFamily: "Poppins",
            position: "absolute",
            top: isDeposit ? "146px" : "300px",
            right: "55px",
            zIndex: 1,
          }}
          variant="connect"
          onClick={handleConnectClick}
        >
          Connect
        </Button>
      )}
    </>
  );
};

const ConcordiumBox = ({ chain, text }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chain.account) {
      setOpen(true);
    }
  }, [chain.account]);

  return (
    <CoinContainer>
      <OrderText>{text}</OrderText>
      <CoinSelect>
        <CoinPicker>
          <Coin>
            <img src={chain.icon} alt={`${chain.name} icon`} height="23.13" width="23.13" />
            <StyledCoinText>{chain.name}</StyledCoinText>
          </Coin>

          {!chain.account && !open && (
            <Button
              style={{
                backgroundColor: "#0095C8",
                height: "30px",
                fontSize: "14px",
                fontFamily: "Poppins",
              }}
              variant="connect"
              onClick={() => {
                chain.connect && chain.connect();
              }}
            >
              Connect
            </Button>
          )}
        </CoinPicker>
      </CoinSelect>
    </CoinContainer>
  );
};

const SelectToken = ({
  tokens,
  onSelect,
  onMax,
  selected,
  isDeposit,
  selectedTokenBalance,
  maxTransferValue,
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  const fallbackIconUrl = isDeposit ? EthereumLogo : ConcordiumIcon;
  const selectedIconUrl = selected
    ? tokens?.find(({ token }) => token.eth_address === selected?.eth_address)?.iconUrl ??
      fallbackIconUrl
    : undefined;

  const sortedTokens = tokens?.slice().sort(({ token: a }, { token: b }) => {
    const isLess = isDeposit ? a.eth_name < b.eth_name : a.ccd_name < b.ccd_name;
    return isLess ? -1 : 1;
  });

  return (
    <MaxGapRow>
      <DropdownButton onClick={toggle}>
        {selected && selectedIconUrl && (
          <img
            src={selectedIconUrl}
            alt={`${isDeposit ? selected.eth_name : selected.ccd_name} icon`}
            height="23.13"
            width="23.13"
          />
        )}
        <Text
          fontWeight="500"
          fontFamily="Poppins"
          fontSize="18"
          fontColor="White"
          style={{ paddingLeft: selectedIconUrl ? 7 : undefined }}
        >
          {selected ? (isDeposit ? selected.eth_name : selected.ccd_name) : "Select Token"}
        </Text>
        <Dropdown>
          <img src={ArrowIcon} alt="dropdown icon" height="12" width="12" />
        </Dropdown>
      </DropdownButton>
      <Button
        variant="max"
        onClick={() => onMax(maxTransferValue ?? selectedTokenBalance ?? "")}
        style={{ background: "inherit" }}
      >
        <Text fontSize="18" fontWeight="500" fontFamily="Poppins" style={{ color: "#0196C9" }}>
          Max
        </Text>
      </Button>
      <DropdownList open={open}>
        {sortedTokens?.map(tokenData => {
          const {
            token: { ccd_name, ccd_contract, eth_name, eth_address },
            iconUrl,
          } = tokenData;

          return (
            <Coin
              onClick={() => {
                onSelect(tokenData.token);
                setOpen(false);
              }}
              key={
                isDeposit
                  ? `${eth_name + eth_address}`
                  : `${ccd_name + ccd_contract?.index + ccd_contract?.subindex}`
              }
            >
              <img
                src={iconUrl ?? fallbackIconUrl}
                alt={`${isDeposit ? eth_name : ccd_name} icon`}
                height="23.13"
                width="23.13"
              />
              <StyledCoinText fontWeight="light">{isDeposit ? eth_name : ccd_name}</StyledCoinText>
            </Coin>
          );
        })}
      </DropdownList>
    </MaxGapRow>
  );
};

const Transfer = ({ isDeposit = false, maxTransferValue }) => {
  const tokensQuery = useTokens();
  const location = useLocation();
  const { reset = false, isReady, replace, pathname } = location;
  const { context, connect, balance, switchNetwork, chain, error } = useEthWallet();
  const { ccdContext, connectCCD: connectCcd, hasWallet: hasCcdWallet } = useCCDWallet();
  const navigate = useNavigate();
  const {
    token,
    amount = BigInt(0),
    setToken,
    setAmount,
    clear: clearTransactionFlow,
  } = useTransactionFlowStore();
  // Keeps track of whether "continue" has been pressed. Used to not show validation error message prematurely.
  const [submitted, setSubmitted] = useState(false);
  const { balanceOf: getCcdTokenBalance } = useCCDContract(ccdContext.account, ccdContext.isActive);
  const isLoggedIn = !!context?.account && !!ccdContext.account;
  const transferButtonDisabled = !isLoggedIn || !token;
  const nextRoute = useMemo(
    () => (isDeposit ? routes.deposit.overview : routes.withdraw.overview),
    [isDeposit],
  );
  const swapRoute = useMemo(
    () => (isDeposit ? routes.withdraw.path : routes.deposit.path),
    [isDeposit],
  );
  const toTokenIntegerAmount = useCallback(
    decimalAmount => {
      if (token === undefined) {
        throw new Error("Token expected to be available");
      }

      return ethers.utils.parseUnits(decimalAmount, token.decimals).toBigInt();
    },
    [token],
  );
  const toTokenDecimalAmount = useCallback(
    amount => {
      if (token === undefined) {
        throw new Error("Token expected to be available");
      }

      return toFractionalAmount(amount, token.decimals);
    },
    [token],
  );
  const [inputAmount, setInputAmount] = useState(
    token !== undefined && amount !== undefined ? toTokenDecimalAmount(amount) ?? "0" : "0",
  );

  // tokens available in the dropdown
  const tokens = useMemo(() => {
    if (tokensQuery.status !== "success") {
      return undefined;
    }
    return tokensQuery.data;
  });

  useEffect(() => {
    tokensQuery.refetch();
    setInputAmount("");
    setToken("");
  }, [chain?.id]);

  const tokenBalance = useAsyncMemo(
    async () => {
      if (!isLoggedIn || !token) {
        return undefined;
      }

      return isDeposit ? balance?.value._hex : getCcdTokenBalance(token);
    },
    noOp,
    [isLoggedIn, token, getCcdTokenBalance],
  );
  const decimalTokenBalance = useMemo(() => {
    if (tokenBalance === undefined || token === undefined) {
      return undefined;
    }

    return toTokenDecimalAmount(tokenBalance);
  }, [tokenBalance, token, toTokenDecimalAmount]);

  const minTransferValue = useMemo(() => {
    if (token?.decimals === undefined) {
      return undefined;
    }

    return 1 / 10 ** token.decimals;
  }, [token?.decimals]);

  const connectCcdHandleNetwork = async () => {
    if (!hasCcdWallet) {
      window.alert("Concordium wallet could not be found.");
      return;
    }

    try {
      await connectCcd();
    } catch {
      if (network.ccd.genesisHash === CCD_MAINNET_GENESIS) {
        window.alert(
          'Please connect to the "Concordium Mainnet" network in your Concordium wallet',
        );
      } else if (network.ccd.genesisHash === CCD_TESTNET_GENESIS) {
        window.alert(
          'Please connect to the "Concordium Testnet" network in your Concordium wallet',
        );
      } else {
        window.alert("Please connect to the correct network in your Concordium wallet");
      }
    }
  };

  const chainsETHandKAVA = [
    {
      id: 2221,
      name: "KAVA",
      account: context.account,
      icon: KavaIcon,
      connect: connect,
    },
    {
      id: 5,
      name: "Goerli",
      account: context.account,
      icon: EthereumLogo,
      connect: connect,
    },
  ];
  const chainConcordium = [
    {
      id: 3,
      name: "Concordium",
      icon: ConcordiumIcon,
      account: ccdContext.account,
      connect: connectCcdHandleNetwork,
    },
  ];

  const inputValidation = useMemo(() => {
    if (token === undefined || tokenBalance === undefined) {
      return true;
    }

    try {
      const nAmount = toTokenIntegerAmount(inputAmount) ?? BigInt(0);

      if (nAmount <= BigInt(0)) {
        return "Value has to be above 0";
      }

      return nAmount <= tokenBalance || "Insufficient funds on account";
    } catch {
      return "Invalid amount";
    }
  }, [inputAmount, tokenBalance, token, toTokenIntegerAmount]);

  const showValidationError = inputValidation !== true && submitted;
  const showEthBalanceWarning = useMemo(() => {
    if (inputValidation !== true) {
      return false;
    }

    try {
      return (
        maxTransferValue !== undefined &&
        ethers.utils.parseEther(inputAmount).toBigInt() > maxTransferValue.value
      );
    } catch {
      return false;
    }
  }, [inputAmount, inputValidation, maxTransferValue]);

  useEffect(() => {
    if (reset && isReady) {
      clearTransactionFlow();
      replace(pathname);
    }
  }, [reset, isReady]);

  const submitHandler = useCallback(() => {
    setSubmitted(true);

    if (inputValidation !== true || token === undefined) {
      // Abort.
      return;
    }

    const tokenAmount = toTokenIntegerAmount(inputAmount);
    if (tokenAmount === undefined) {
      throw new Error("Could not convert input to token amount");
    }

    setAmount(tokenAmount);
    navigate(nextRoute);
  }, [inputValidation, token, toTokenIntegerAmount, inputAmount, setAmount, navigate, nextRoute]);

  return (
    <PageWrapper>
      <Text
        style={{ marginBottom: "20px", lineHeight: "45px" }}
        fontFamily="Poppins'"
        fontSize="30"
        fontWeight="600"
        fontColor="White"
        fontLetterSpacing="0"
      >
        Transfer
      </Text>
      {isDeposit ? (
        <StyledContainer>
          <NetworkSelector
            switchNetwork={switchNetwork}
            chains={chainsETHandKAVA}
            selectedChain={chain}
            text={isDeposit ? "From" : "To"}
            isDeposit
          />
          <FirstRow style={{ marginTop: isDeposit ? "40px" : "0" }}>
            {chainConcordium.map((chain, index) => (
              <ConcordiumBox key={chain.id} chain={chain} text={isDeposit ? "To" : "From"} />
            ))}
          </FirstRow>
          <Link to={swapRoute}>
            <SwapLink>
              <img
                src={ShuffleIcon}
                alt="swap icon"
                width="24"
                height="24"
                style={{ top: ccdContext.account ? "35%" : "33%" }}
              />
            </SwapLink>
          </Link>
          <SecondRow>
            <SelectToken
              tokens={tokens}
              selected={token}
              isDeposit={isDeposit}
              onSelect={setToken}
              onMax={setInputAmount}
              selectedTokenBalance={decimalTokenBalance}
              maxTransferValue={
                maxTransferValue !== undefined
                  ? ethers.utils.formatEther(maxTransferValue.value)
                  : undefined
              }
            />
            <MaxGapRow input>
              <Input
                style={{ background: "inherit", color: "white" }}
                value={inputAmount}
                onChange={e => {
                  const value = e.target.value;
                  const regex = /^\d*\.?\d{0,8}$/; // Regex pattern to allow up to 8 decimal places
                  if (regex.test(value) || value === "") {
                    setInputAmount(value);
                  }
                }}
                type="number"
                formNoValidate
                min={minTransferValue}
                max={decimalTokenBalance}
                step={minTransferValue}
                valid={!showValidationError}
              />
              <Text
                style={{ alignSelf: "flex-end", position: "absolute", right: 0, bottom: -10 }}
                fontColor="White"
                fontSize="12"
              >
                {isLoggedIn && token && decimalTokenBalance
                  ? `Balance: ${decimalTokenBalance}`
                  : " "}
              </Text>
            </MaxGapRow>
            {showValidationError && (
              <Text fontSize="11" fontColor="Red" style={{ position: "absolute", bottom: "-20px" }}>
                {inputValidation}
              </Text>
            )}
            {!showValidationError && showEthBalanceWarning && maxTransferValue !== undefined && (
              <Text
                fontSize="11"
                fontColor="White"
                style={{ position: "absolute", bottom: "-20px" }}
              >
                Exceeds balance + estimated fees (
                {ethers.utils.formatEther(maxTransferValue.deductedFee)} ETH)
              </Text>
            )}
          </SecondRow>
          <Button
            variant="primary"
            style={{ background: "#0095C8", padding: "20px", height: "67px" }}
            disabled={transferButtonDisabled}
            onClick={submitHandler}
          >
            <div style={{ position: "relative" }}>
              <Text fontSize="16" fontColor="White" fontWeight="regular">
                {isDeposit ? "Deposit" : "Withdraw"}
              </Text>
            </div>
          </Button>
        </StyledContainer>
      ) : (
        <StyledContainer>
          <FirstRow style={{ marginBottom: isDeposit ? "0px" : "40px" }}>
            {chainConcordium.map((chain, index) => (
              <ConcordiumBox key={chain.id} chain={chain} text={isDeposit ? "To" : "From"} />
            ))}
          </FirstRow>
          <NetworkSelector
            switchNetwork={switchNetwork}
            chains={chainsETHandKAVA}
            text={isDeposit ? "From" : "To"}
            selectedChain={chain}
          />

          <Link to={swapRoute}>
            <SwapLink>
              <img src={ShuffleIcon} alt="swap icon" width="24" height="24" />
            </SwapLink>
          </Link>
          <SecondRow>
            <SelectToken
              tokens={tokens}
              selected={token}
              isDeposit={isDeposit}
              onSelect={setToken}
              onMax={setInputAmount}
              selectedTokenBalance={decimalTokenBalance}
              maxTransferValue={
                maxTransferValue !== undefined
                  ? ethers.utils.formatEther(maxTransferValue.value)
                  : undefined
              }
            />
            <MaxGapRow input>
              <Input
                style={{ background: "inherit", color: "white" }}
                value={inputAmount}
                onChange={e => {
                  const value = e.target.value;
                  const regex = /^\d*\.?\d{0,8}$/; // Regex pattern to allow up to 8 decimal places
                  if (regex.test(value) || value === "") {
                    setInputAmount(value);
                  }
                }}
                type="number"
                formNoValidate
                min={minTransferValue}
                max={decimalTokenBalance}
                step={minTransferValue}
                valid={!showValidationError}
              />
              <Text
                style={{ alignSelf: "flex-end", position: "absolute", right: 0, bottom: -10 }}
                fontColor="White"
                fontSize="12"
              >
                {isLoggedIn && token && decimalTokenBalance
                  ? `Balance: ${decimalTokenBalance}`
                  : " "}
              </Text>
            </MaxGapRow>
            {showValidationError && (
              <Text fontSize="11" fontColor="Red" style={{ position: "absolute", bottom: "-20px" }}>
                {inputValidation}
              </Text>
            )}
            {!showValidationError && showEthBalanceWarning && maxTransferValue !== undefined && (
              <Text
                fontSize="11"
                fontColor="White"
                style={{ position: "absolute", bottom: "-20px" }}
              >
                Exceeds balance + estimated fees (
                {ethers.utils.formatEther(maxTransferValue.deductedFee)} ETH)
              </Text>
            )}
          </SecondRow>
          <Button
            variant="primary"
            style={{ background: "#0095C8", padding: "20px", height: "67px" }}
            disabled={transferButtonDisabled}
            onClick={submitHandler}
          >
            <div style={{ position: "relative" }}>
              <Text fontSize="16" fontColor="White" fontWeight="regular">
                {isDeposit ? "Deposit" : "Withdraw"}
              </Text>
            </div>
          </Button>
        </StyledContainer>
      )}

      <Link to={routes.history(isDeposit ? BridgeDirection.Deposit : BridgeDirection.Withdraw)}>
        <LinkWrapper hidden={!context.account}>
          <Text
            fontSize="18"
            fontFamily="Poppins'"
            fontColor="White"
            fontWeight="600"
            style={{ textTransform: "uppercase" }}
          >
            Transaction History
          </Text>
        </LinkWrapper>
      </Link>
    </PageWrapper>
  );
};

export default Transfer;
