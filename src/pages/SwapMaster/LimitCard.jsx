import React, { useEffect, useState } from "react";
import ImageDropDownButton from "../../components/DropDown/ImageDropDownButton";
import DropdownButton from "../../components/DropDown/DropDownButton";
import { SwapDirectionIcon } from "./icons/SwapDirectionIcon";
// import concodium from "../../asssets/images/concordium-icon.svg";
// import ethereum from "../../asssets/images/ethereum-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AccountAddress, AccountTransactionType, CcdAmount } from "@concordium/web-sdk";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import { JS_NODE_URL } from "../../config";
import Loader from "../../components/Loader/Loader";
import {
  setLimitPrice,
  setLimitTokenFrom,
  setLimitTokenTo,
  setlimitSuccessModal,
} from "../../store/reducers/SwapMaster/swapSlice";
import { useChartData } from "./Graph/hooks";
// import { WebClient } from "concordium_web_sdk__WEBPACK_IMPORTED_MODULE_6__";

const currencyList = [
  {
    id: 1,
    title: "1 hour",
    addTime: 3600000,
  },
  {
    id: 2,
    title: "5 hours",
    addTime: 3600000 * 5,
  },
  {
    id: 3,
    title: "15 hours",
    addTime: 3600000 * 15,
  },
  {
    id: 4,
    title: "1 day",
    addTime: 3600000 * 24,
  },
  {
    id: 5,
    title: "3 days",
    addTime: 3600000 * 24 * 3,
  },
  {
    id: 6,
    title: "5 days",
    addTime: 3600000 * 24 * 5,
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
  // const [selectedTokenFrom, setSelectedTokenFrom] = useState(null);
  // const [SelectedTokenTo, setSelectedTokenTo] = useState(null);
  const [tokenFromValue, setTokenFromValue] = useState("");
  const [tokenToValue, setTokenToValue] = useState("");
  const [addExpiry, setAddExpiry] = useState(3600000);
  const [SwapDirection, setSwapDirection] = useState(false);
  const [isProcessing, setisProcessing] = useState(false);
  const [price, setPrice] = useState("");

  const dispatch = useDispatch();

  const openmodal = () => {
    dispatch(setlimitSuccessModal(true));
  };

  const setLimitTokenFrom2 = x => {
    dispatch(setLimitTokenFrom(x));
  };

  const setLimitTokenTo2 = x => {
    dispatch(setLimitTokenTo(x));
  };

  const tokenTo = useSelector(s => s.swap.limitdata.tokenTo);
  const tokenFrom = useSelector(s => s.swap.limitdata.tokenFrom);
  const period = {
    name: "day",
    label: "24H",
    description: "Past 24 Hours",
  };
  const { chartData, percentDifference } = useChartData({
    tokenFrom: tokenTo,
    tokenTo: tokenFrom,
    period,
  });
  // console.log(chartData, percentDifference, "chartData", "percentDifference");
  // console.log(chartData[chartData.length - 1]?.exchangeRate);
  // console.log(tokenFrom, tokenTo, "tokenFrom tokenTo tokenFrom token");

  // console.log(tokenFromValue, "selectedTokenFromValue");
  // console.log(tokenToValue, "SelectedTokenToValue");
  // console.log(price, "price");
  // const dispatch = useDispatch();

  // const handleChangeFromValue = event => {
  //   setTokenFromValue(event.target.value);
  //   setTokenToValue(event.target.value * chartData[chartData.length - 1]?.exchangeRate);
  //   setprice(tokenToValue / event.target.value);
  // };

  // const handleChangeToValue = event => {
  //   // console.log(event.target.value);
  //   setTokenToValue(event.target.value);
  // };

  // const handleChangePrice = event => {
  //   setprice(event.target.value);
  // };

  const handleConvert = () => {
    setConvert(!convert);
    setPrice("");
    setTokenFromValue("");
    setTokenToValue("");
  };

  // Function to calculate and update values based on tokenFromValue
  const updateValuesFromTokenFrom = value => {
    setTokenFromValue(value);
    const exchangeRate = chartData[chartData.length - 1]?.exchangeRate || 1;
    setTokenToValue(value * exchangeRate);
    setPrice(tokenToValue / value);
  };

  // Function to calculate and update values based on tokenToValue
  const updateValuesFromTokenTo = value => {
    setTokenToValue(value);
    const exchangeRate = chartData[chartData.length - 1]?.exchangeRate || 1;
    setTokenFromValue(value / exchangeRate);
    setPrice(value / tokenFromValue);
  };

  // Function to calculate and update values based on price
  const updateValuesFromPrice = value => {
    setPrice(value);
    setTokenToValue(value * tokenFromValue);
  };

  // Handle changes in tokenFromValue
  const handleChangeFromValue = event => {
    updateValuesFromTokenFrom(event.target.value);
  };

  // Handle changes in tokenToValue
  const handleChangeToValue = event => {
    updateValuesFromTokenTo(event.target.value);
  };

  // Handle changes in price
  const handleChangePrice = event => {
    updateValuesFromPrice(event.target.value);
  };

  // useEffect to update tokenToValue when tokenFromValue changes
  useEffect(() => {
    updateValuesFromTokenFrom(tokenFromValue);
  }, [tokenFromValue]);

  const handleSwapDirection = () => {
    //dispatch(changeSwapDirection());
    setLimitTokenFrom2(tokenTo);
    setLimitTokenTo2(tokenFrom);
    setSwapDirection(!SwapDirection);
  };

  const { tokenList } = useSelector(state => state.swapMaster);

  // console.log("Token List from useSelector:", tokenList);
  // console.log("setselectedTokenFrom", selectedTokenFrom?.symbol);
  // console.log("setselectedTokenTo", SelectedTokenTo?.symbol);

  const handlePlaceOrder = async () => {
    setisProcessing(true);

    try {
      const provider = await detectConcordiumProvider();
      const account = await provider.connect();
      const txHash = await provider.sendTransaction(account, AccountTransactionType.Transfer, {
        amount: new CcdAmount(BigInt(tokenFromValue + "000000")),
        toAddress: new AccountAddress(
          process.env.REACT_APP_ADMIN_ADDRESS ||
            "4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR",
        ),
      });
      let now = new Date(new Date().getTime() + addExpiry);

      const requestBody = {
        tokenfromName: tokenFrom?.symbol,
        tokentoName: tokenTo?.symbol,
        tokenfromvalue: tokenFromValue,
        tokentovalue: tokenToValue,
        tokenToindex: tokenTo?.address?.index || 0,
        tokenFromindex: tokenFrom?.address?.index || 0,
        tokenFromid: tokenFrom.id,
        tokenToid: tokenTo.id,
        address: account,
        expiry: now.getTime(),
      };

      console.log(requestBody, "payload");

      const apiUrl = (JS_NODE_URL || "http://localhost:8000") + "/api/v1/tokens/limit";

      await axios.post(apiUrl, requestBody);

      console.log(txHash);
      setisProcessing(false);
      dispatch(
        setLimitPrice({
          price: tokenToValue / tokenFromValue,
          inverseprice: tokenFromValue / tokenToValue,
          txnhash: txHash,
          tokenfromvalue: tokenFromValue,
        }),
      );
      openmodal();
    } catch (error) {
      console.error("Error making API request:", error);
      setisProcessing(false);
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

  useEffect(() => {
    if (tokenList && tokenList.length && !tokenFrom?.symbol && !tokenTo?.symbol) {
      setLimitTokenFrom2(tokenList[0]);
      setLimitTokenTo2(tokenList[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  return (
    <>
      <div className="flex flex-col sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] bg-app-black rounded-xl max-w-[815px]">
        <div className="flex flex-col justify-between 2xs:flex-row">
          <div className="text-lg font-normal ">From</div>
          {/* <div className="flex flex-row items-center text-gray-600">
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
          </div> */}
        </div>
        <div className="flex flex-row items-center justify-between h-16 py-3 pl-4 mt-3 rounded-lg xs:pl-8 bg-app-black-button">
          <div className="flex flex-row items-center justify-between w-3/4">
            {/* <input
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder={"Please enter 20-25000000"}
              value={tokenFromValue}
              onChange={handleChangeFromValue}
              type="number"
            /> */}
            <input
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder="Please enter 20-25000000"
              value={tokenFromValue}
              onChange={handleChangeFromValue}
              type="number"
            />
            {/* <div className="text-base text-gray-500 w-text-base">Max</div> */}
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
              initialContent={tokenList[0]}
              contentList={tokenList}
              backgroundColor="bg-app-black-button"
              setSelectedTokenFrom={setLimitTokenFrom2}
              setSelectedTokenTo={setLimitTokenTo2}
              SwapDirection={SwapDirection}
              dropdownType="from"
              disabled={tokenTo}
            />
          </div>
        </div>
        <div className="flex justify-center w-full mt-10">
          <div
            className="flex items-center justify-center rounded-full cursor-pointer full bg-app-black-button hover:bg-[#717A8B] p-3"
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
            {/* <input
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder="Please enter 0.0004-50"
              //value={tokenFromValue * chartData[chartData.length - 1]?.exchangeRate}
              value={tokenToValue}
              onChange={handleChangeToValue}
              type="number"
              readOnly
            /> */}
            <input
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder="Please enter 0.0004-50"
              value={tokenToValue}
              onChange={handleChangeToValue}
              type="number"
              readOnly
            />
            {/* <div
              className="w-full bg-app-black-button xs:placeholder:text-base placeholder:text-xs placeholder:text-gray-400"
              placeholder="Please enter 0.0004-50"
              value={tokenFromValue * chartData[chartData.length - 1]?.exchangeRate}
              onChange={handleChangeToValue}
              type="number"
            >
              {tokenFromValue * chartData[chartData.length - 1]?.exchangeRate}
            </div> */}
          </div>
          <div className="flex-none">
            {/* <ImageDropDownButton
              initialContent={convert ? tokenList[1] : tokenList[1]}
              contentList={!convert ? tokenList : tokenList}
              backgroundColor=" bg-app-black-button"
            /> */}

            <ImageDropDownButton
              initialContent2={tokenList[1]}
              contentList={tokenList}
              backgroundColor="bg-app-black-button"
              setSelectedTokenFrom={setLimitTokenFrom2}
              setSelectedTokenTo={setLimitTokenTo2}
              dropdownType="to"
              disabled={tokenFrom}
            />
          </div>
        </div>
        <div className="flex flex-col pb-10 border-b-2 border-app-block border-b-gray-700">
          <div className="flex flex-row justify-start gap-2 mt-5">
            <div className="text-lg w-2/3 font-normal">Price</div>
            <div className="w-1/3 text-lg font-normal md:flex hidden">Expires in</div>
          </div>
          <div className="flex flex-col justify-start gap-2 mt-3 md:flex-row">
            <div className="flex flex-row items-center justify-between w-full h-16 py-5 pl-8 rounded-lg sm:w-2/3 bg-app-black-button">
              <div className="w-3/4">
                {/* <input
                  className="w-full bg-app-black-button"
                  value={price}
                  //  value={tokenToValue}
                  onChange={handleChangePrice}
                /> */}
                <input
                  className="w-full bg-app-black-button"
                  value={price}
                  onChange={handleChangePrice}
                  type="number"
                />
                {/* <div className="w-full bg-app-black-button cursor-default">
                  {tokenToValue / tokenFromValue ? tokenToValue / tokenFromValue : ""}
                </div> */}
              </div>
              <div className="flex-none">
                {/* <ImageDropDownButton
                  initialContent={convert ? toTokenList[0] : fromTokenList[0]}
                  contentList={!convert ? toTokenList : fromTokenList}
                  backgroundColor=" bg-app-black-button"
                /> */}
                {/* <div className="flex flex-row gap-2 items-center mr-6">
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
                </div> */}
              </div>
            </div>
            <div className="w-1/3 text-lg font-normal md:hidden flex">Expires in</div>
            <div className="flex flex-row items-center  w-full md:w-1/3 h-16 py-5 pl-5 rounded-lg bg-app-black-button justify-end pr-2">
              <DropdownButton
                initialContent={currencyList[0].symbol}
                backgroundColor="bg-app-black-button"
                contentList={currencyList}
                callback={expiry => {
                  setAddExpiry(currencyList.filter(date => date.title === expiry)[0].addTime);
                }}
              />
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center w-full -mt-6">
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
        </div> */}
        {/* <div className="flex flex-row justify-between">
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
            <ImageDropDownButton
              // initialContent={tokenList[1]}
              contentList={tokenList}
              backgroundColor="bg-app-black-button"
              setSelectedTokenFrom={setSelectedTokenFrom}
              setSelectedTokenTo={setSelectedTokenTo}
              dropdownType="to" // Specify the dropdown type
            />
          </div>
        </div> */}
        <div className="flex flex-row justify-between mt-5 text-xs 1xs:text-base">
          <div>Price</div>
          <div>
            1 {tokenFrom?.symbol} = {tokenToValue / tokenFromValue || 0} {tokenTo?.symbol}
          </div>
        </div>
        <div className="flex flex-row justify-between mt-3 text-xs 1xs:text-base">
          <div>Inverse Price</div>
          <div>
            1 {tokenTo?.symbol} = {tokenFromValue / tokenToValue || 0} {tokenFrom?.symbol}
          </div>
        </div>
        {/* <div
          className="flex items-center justify-center h-16 mt-5 rounded-md cursor-pointer bg-app-blue hover:bg-[#50D0FB]"
          onClick={() => {
            if (tokenFromValue !== "" && tokenToValue !== "") {
              handlePlaceOrder();
            }
          }}
        >
          {isProcessing && <Loader size="md" />}
          <div className="text-lg">Place Older</div>
        </div> */}
        <div
          className={`flex items-center justify-center h-16 mt-5 rounded-md cursor-pointer bg-app-blue hover:bg-[#50D0FB] ${
            tokenFromValue === "" || tokenToValue === "" ? " cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (tokenFromValue !== "" && tokenToValue !== "") {
              handlePlaceOrder();
            }
          }}
        >
          {isProcessing && <Loader size="md" />}
          <div className="text-lg">Place Order</div>
        </div>
      </div>
    </>
  );
};

export default LimitCard;
