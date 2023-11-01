import React, { useState } from "react";
import ImageDropDownButton from "../../components/DropDown/ImageDropDownButton";
import DropdownButton from "../../components/DropDown/DropDownButton";
import { SwapDirectionIcon } from "./icons/SwapDirectionIcon";
// import concodium from "../../asssets/images/concordium-icon.svg";
// import ethereum from "../../asssets/images/ethereum-icon.svg";
import { changeSwapDirection } from "./Swap/utils";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AccountAddress, AccountTransactionType, CcdAmount } from "@concordium/web-sdk";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
// import { WebClient } from "concordium_web_sdk__WEBPACK_IMPORTED_MODULE_6__";

const currencyList = [
  {
    id: 1,
    title: "1 hour",
  },
  {
    id: 2,
    title: "5 hours",
  },
  {
    id: 3,
    title: "15 hours",
  },
  {
    id: 4,
    title: "1 day",
  },
  {
    id: 5,
    title: "3 days",
  },
  {
    id: 6,
    title: "5 days",
  },
];
// const fromTokenList = [
//   {
//     id: 1,
//     title: "CCD",
//     url: concodium,
//   },
//   {
//     id: 2,
//     title: "KAVA",
//     url: ethereum,
//   },
//   // {
//   //   id: 3,
//   //   title: "BTC",
//   //   url: "../../assets/images/UserHome/bnb.png",
//   // },
// ];

// const toTokenList = [
//   {
//     id: 1,
//     title: "KAVA",
//     url: ethereum,
//   },
//   {
//     id: 2,
//     title: "CCD",
//     url: concodium,
//   },
//   // {
//   //   id: 3,
//   //   title: "BTC",
//   //   url: "../../assets/images/UserHome/bnb.png",
//   // },
// ];

const LimitCard = () => {
  const [convert, setConvert] = useState();
  const [selectedTokenFrom, setSelectedTokenFrom] = useState(null);
  const [SelectedTokenTo, setSelectedTokenTo] = useState(null);
  const [tokenFromValue, setTokenFromValue] = useState("");
  const [tokenToValue, setTokenToValue] = useState("");
  const dispatch = useDispatch();

  const handleChangeFromValue = event => {
    setTokenFromValue(event.target.value);
  };

  const handleChangeToValue = event => {
    setTokenToValue(event.target.value);
  };

  const handleConvert = () => {
    setConvert(!convert);
  };

  const handleSwapDirection = () => {
    dispatch(changeSwapDirection());
  };

  const { tokenList } = useSelector(state => state.swapMaster);

  // console.log("Token List from useSelector:", tokenList);
  // console.log("setselectedTokenFrom", selectedTokenFrom?.symbol);
  // console.log("setselectedTokenTo", SelectedTokenTo?.symbol);

  const handlePlaceOrder = async () => {
    try {
      const provider = await detectConcordiumProvider();
      const account = await provider.connect();
      const txHash = await provider.sendTransaction(account, AccountTransactionType.Transfer, {
        amount: new CcdAmount(BigInt(tokenFromValue + "000000")),
        toAddress: new AccountAddress(
          process.env.ADMIN_ADDRESS || "4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR",
        ),
      });

      const requestBody = {
        tokenfromName: selectedTokenFrom?.symbol,
        tokentoName: SelectedTokenTo?.symbol,
        tokenfromvalue: tokenFromValue,
        tokentovalue: tokenToValue,
        tokenToindex: SelectedTokenTo?.address?.index || 0,
        tokenFromindex: selectedTokenFrom?.address?.index || 0,
        tokenFromid: selectedTokenFrom.id,
        tokenToid: SelectedTokenTo.id,
        address: account,
      };

      console.log(requestBody, "payload");

      const apiUrl = (process.env.REACT_APP_DEX_API || "http://localhost:8000") + "/api/v1/tokens/limit";

      await axios.post(apiUrl, requestBody);

      console.log(txHash);
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  // async function sendTransaction(recipientAddress, amount, privateKey) {
  //   const wallet = Wallet(privateKey);
  //   console.log(wallet);
  //   const transaction = new Transaction();

  //   transaction.recipientAddress = recipientAddress;
  //   transaction.amount = amount;

  //   transaction.sign(wallet.privateKey);

  //   const webClient = new WebClient();
  //   await webClient.connect();

  //   const response = await webClient.sendTransaction(transaction);

  //   if (response.success) {
  //     console.log("Transaction sent successfully!");
  //   } else {
  //     console.log("Transaction failed: ", response.error);
  //   }

  //   await webClient.disconnect();
  // }

  // const recipientAddress = "3Dz5k2fm5a6PX7dgLER9htFvLhiDAjcEdMHMFfEuNf6CUnBkTW";
  // const amount = 100;

  // async function transfer() {
  //   return sendTransaction(recipientAddress, amount, privateKey);
  // }

  // transfer()
  //   .then(result => console.log(result))
  //   .catch(error => console.error(error));

  // console.log(transfer(), "sadasdS");

  // Call the asynchronous function

  // const handleSwapTokens = () => {
  //   const temp = selectedTokenFrom;
  //   setSelectedTokenFrom(SelectedTokenTo);
  //   setSelectedTokenTo(temp);
  // };

  return (
    <>
      <div className="flex flex-col sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] bg-app-black rounded-xl w-[815px]">
        <div className="flex flex-col justify-between 2xs:flex-row">
          <div className="text-lg font-normal ">From</div>
          <div className="flex flex-row items-center text-gray-600">
            <div className="text-xs text-gray-500">Spot wallet available</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="5"
              viewBox="0 0 9 5"
              fill="none"
            >
              <path
                d="M1 1L4.5 4L8 1"
                stroke="#717A8B"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-xs text-gray-500">0 USDT</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between h-16 py-3 pl-4 mt-3 rounded-lg xs:pl-8 bg-app-black-button">
          <div className="flex flex-row items-center justify-between w-125">
            <input
              className="w-full text-xs bg-app-black-button placeholder:text-gray-400 xs:placeholder:text-base"
              placeholder={"Please enter 20-25000000"}
              value={tokenFromValue}
              onChange={handleChangeFromValue}
            />
            <div className="text-base text-gray-500 w-text-base">Max</div>
          </div>
          <div className="flex-none">
            {/* <ImageDropDownButton
              initialContent={tokenList}
              contentList={tokenList}
              backgroundColor=" bg-app-black-button"
            /> */}
            {/* <ImageDropDownButton
              initialContent={!convert ? tokenList[0] : tokenList[0]}
              contentList={convert ? tokenList : tokenList}
              backgroundColor=" bg-app-black-button"
              setselectedTokenFrom={setselectedTokenFrom}
            /> */}
            <ImageDropDownButton
              // initialContent={tokenList[0]}
              contentList={tokenList}
              backgroundColor="bg-app-black-button"
              setSelectedTokenFrom={setSelectedTokenFrom}
              setSelectedTokenTo={setSelectedTokenTo}
              dropdownType="from"
            />
          </div>
        </div>
        <div className="flex flex-col pb-10 border-b-2 border-app-block border-b-gray-700">
          <div className="flex flex-row justify-start gap-2 mt-5">
            <div className="text-lg w-2/3 font-normal">Price</div>
            <div className="w-1/3 text-lg font-normal">Expires in</div>
          </div>
          <div className="flex flex-col justify-start gap-2 mt-3 sm:flex-row">
            <div className="flex flex-row items-center justify-between w-full h-16 py-5 pl-8 rounded-lg sm:w-2/3 bg-app-black-button">
              <div className="w-3/4">
                <input
                  className="w-full bg-app-black-button"
                  value={tokenToValue / tokenFromValue}
                />
              </div>
              <div className="flex-none">
                {/* <ImageDropDownButton
                  initialContent={convert ? toTokenList[0] : fromTokenList[0]}
                  contentList={!convert ? toTokenList : fromTokenList}
                  backgroundColor=" bg-app-black-button"
                /> */}
                <div className="flex flex-row gap-2 items-center mr-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1 1L5.5 5.5L10 1"
                      stroke="#717A8B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-gray-500">USDT</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center  w-1/3 h-16 py-5 pl-5 rounded-lg bg-app-black-button justify-center pr-2">
              <DropdownButton
                initialContent={currencyList[0].symbol}
                backgroundColor="bg-app-black-button"
                contentList={currencyList}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full -mt-6">
          <div
            className="flex items-center justify-center rounded-full cursor-pointer full bg-app-black-button hover:bg-[#717A8B] rotate-90"
            style={{ marginBottom: "10px", width: "53px", height: "53px" }}
            onClick={() => {
              handleSwapDirection();
              handleConvert();
            }}
          >
            <SwapDirectionIcon />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-lg font-normal ">To</div>
        </div>
        <div className="flex flex-row items-center justify-between h-16 py-3 pl-8 mt-3 rounded-lg bg-app-black-button">
          <div className="flex flex-row items-center justify-between w-3/4">
            <input
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder="Please enter 0.0004-50"
              value={tokenToValue}
              onChange={handleChangeToValue}
            />
          </div>
          <div className="flex-none">
            {/* <ImageDropDownButton
              initialContent={convert ? tokenList[1] : tokenList[1]}
              contentList={!convert ? tokenList : tokenList}
              backgroundColor=" bg-app-black-button"
            /> */}
            <ImageDropDownButton
              // initialContent={tokenList[1]}
              contentList={tokenList}
              backgroundColor="bg-app-black-button"
              setSelectedTokenFrom={setSelectedTokenFrom}
              setSelectedTokenTo={setSelectedTokenTo}
              dropdownType="to" // Specify the dropdown type
            />
          </div>
        </div>
        <div className="flex flex-row justify-between mt-5 text-xs 1xs:text-base">
          <div>Price</div>
          <div>
            1 {selectedTokenFrom?.symbol} = {tokenToValue / tokenFromValue}{" "}
            {SelectedTokenTo?.symbol}
          </div>
        </div>
        <div className="flex flex-row justify-between mt-3 text-xs 1xs:text-base">
          <div>Inverse Price</div>
          <div>
            1 {SelectedTokenTo?.symbol} = {tokenFromValue / tokenToValue}{" "}
            {selectedTokenFrom?.symbol}
          </div>
        </div>
        <div
          className="flex items-center justify-center h-16 mt-5 rounded-md cursor-pointer bg-app-blue hover:bg-[#50D0FB]"
          onClick={() => {
            handlePlaceOrder();
          }}
        >
          <div className="text-lg">Place Older</div>
        </div>
      </div>
    </>
  );
};

export default LimitCard;
