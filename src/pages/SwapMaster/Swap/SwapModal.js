import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Loader from "../../../components/Loader/Loader";
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { handleSwap } from "./utils";

// Actions
import { setIsSwapModalOpen } from "../../../store/reducers/SwapMaster/swapSlice";
// import { io } from "socket.io-client";
import { useAppContext } from "../../../contexts/AppContext";
import axios from "axios";
// import { setAccount } from "../../../store/reducers/connectSlice";
import { getTokenRawAmount } from "../../../utils/format";

const SwapModal = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const isShowModal = useSelector(s => s.swap.modals.confirm.isOpen);
  const tokenTo = useSelector(s => s.swap.tokenTo);
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  // const [filterArray, setFilterArray] = useState();
  // const [Price, setPrice] = useState(0);
  // const provider = useSelector(s => s.connect.provider);
  // const account = useSelector(s => s.connect.account);
  const context = useAppContext();
  // console.log(provider, "Providers");
  const {
    values = {},
    fromPerToAmount,
    toPerFromAmount,
  } = useSelector(s => s.swap.modals.confirm.modalData);

  // function customStringify(obj) {
  //   const seen = new WeakSet();

  //   return JSON.stringify(obj, (key, value) => {
  //     if (typeof value === "object" && value !== null) {
  //       if (seen.has(value)) {
  //         return "[Circular Reference]";
  //       }

  //       seen.add(value);
  //     }

  //     return value;
  //   });
  // }

  // const newprovider = customStringify(provider);
  // console.log(provider, "prosadsadasdsa");

  const newprovider2 = { a: 1 };
  newprovider2.b = newprovider2;

  // console.log(newprovider2, "hasyufbsbdfsbuhysabuydb");

  if (!isShowModal) return null;

  const closeModal = () => {
    dispatch(setIsSwapModalOpen({ modal: "confirm", isOpen: false }));
    setIsProcessing(false);
  };

  const onConfirm = async () => {
    setIsProcessing(true);
    let txnHash;

    try {
      // const outcomes = await dispatch(handleSwap({ amountFrom: values.from, amountTo: values.to }));
      // console.log(outcomes);

      // if (outcomes) {
      //   const targetOutcome = Object.values(outcomes)[0];

      //   txnHash = targetOutcome?.hash;
      // }

      const requestBody = {
        // tokenfromName: tokenFrom?.symbol,
        // tokentoName: tokenTo?.symbol,
        tokenfromvalue: values.from,
        tokentovalue: values.to,
        tokentoindex: tokenTo?.address?.index || 0,
        tokenfromindex: tokenFrom?.address?.index || 0,
        tokenfromid: tokenFrom.id,
        tokentoid: tokenTo.id,
      };
      // console.log(requestBody, "payload");
      const apiUrl1 =
        (process.env.REACT_APP_DEX_API || "http://localhost:8000") +
        "/api/v1/tokens/compeletelimitorders";

      const response = await axios.post(apiUrl1, requestBody);

      // const payload = {
      //   amountFrom: values.from,
      //   amountTo: values.to,
      //   account: account,
      //   provider: newprovider,
      //   tokenFrom: tokenFrom,
      //   tokenTo: tokenTo,
      // };

      // const payload = {
      //   tokenamount: parseInt(values.to),
      //   tokenData: tokenTo,
      // };
      // console.log(payload, "API 2 Payload");
      // const apiUrl2 = (process.env.REACT_APP_DEX_API || "http://localhost:8000") + "/api/v1/tokens/tokenswap";
      // const swapresponse = await axios.get(apiUrl2, payloadJson, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const swapresponse = await axios.post(apiUrl2, payload);
      // const swapresponse = await axios.post(apiUrl2, payload, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   params: {
      //     provider,
      //   },
      // });
      // console.log(swapresponse, "Automatic transection ");

      // setFilterArray(response?.data?.filteredOrders);
      // setPrice(response.data.filteredOrders[0].price);
      // const ResponcePrice = 20;
      // const ToPerFromAmount = 20;
      const ToPerFromAmount = parseFloat(toPerFromAmount.replace(/\s+/g, ""));
      console.log(
        response?.data?.filteredOrders.filter(i => !i.paid && i.tokenToid === tokenTo.id),
        "toPerFromAmount",
      );
      response?.data?.filteredOrders
        .filter(i => !i.paid && i.tokenToid === tokenTo.id)
        .forEach(async a => {
          const ResponcePrice = a?.price;

          if (ResponcePrice < 0) {
            ResponcePrice === 0;
          }

          if (ToPerFromAmount <= ResponcePrice) {
            const apiUrl2 =
              (process.env.REACT_APP_DEX_API || "http://localhost:8000") +
              "/api/v1/tokens/tokenswap";
            const { data } = await axios.post(apiUrl2, {
              a: {
                token: {
                  address: tokenTo?.address,
                  id: tokenTo.tokenId,
                },
                min_token_amount: getTokenRawAmount(
                  ToPerFromAmount * a.tokenfromvalue,
                  tokenTo?.decimals || 6,
                ).toString(),
              },
              b: [
                {
                  token_id: tokenTo.tokenId,
                  amount: getTokenRawAmount(
                    ToPerFromAmount * a.tokenfromvalue,
                    tokenTo?.decimals || 6,
                  ).toString(),
                  from: {
                    Account: [
                      process.env.REACT_APP_ADMIN_WALLET ||
                        "3NQJpBY6L8FofGLxo37w2taX3R8apCRmK7eQnbZK3EBnvoew1U",
                    ],
                  },
                  to: {
                    Account: [a.address],
                  },
                  data: "",
                },
              ],
              c: values.from,
              d: tokenTo,
              amountFrom: values.from,
              _id: a._id,
            });
            console.log(data, "Automatic Transection Data");
          }
        });

      setIsProcessing(true);
      context.setOwner(false);

      const transfer = async () => {
        const outcomes = await dispatch(
          handleSwap({
            amountFrom: values.from,
            amountTo: values.to,
            Owner: true,
          }),
        );

        if (outcomes) {
          const targetOutcome = Object.values(outcomes)[0];

          txnHash = targetOutcome?.hash;
        }

        console.log(outcomes, "Automatic AUthentication");
      };

      const responce = await transfer();
      console.log(responce, "Responce");
      // } else {
      //   console.log("Prices Don't Matched From the Limit");
      // }
    } catch (e) {
      setIsProcessing(false);
      closeModal();
      console.error(e);

      return;
    }

    setIsProcessing(false);
    dispatch(
      setIsSwapModalOpen({
        modal: "success",
        isOpen: true,
        modalData: { values, fromPerToAmount, toPerFromAmount, txnHash },
      }),
    );
    context.setOwner(false);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={closeModal} />
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative flex flex-col w-full sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] mx-auto text-lg bg-app-black-modal rounded-xl xs:w-auto">
          <div className="flex mb-5">
            <div className="text-xl font-medium 2xs:text-2xl">Swap Confirmation</div>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2 rounded-md 2xs:py-5 2xs:px-7 bg-app-black mb-7">
            <div className="flex flex-row gap-3 1xs:justify-between 2xs:w-auto">
              <div className="flex 1xs:w-26 ">
                <div className="text-xs font-medium 2xs:text-base text-slate-400">Spending</div>
              </div>
              <div className="flex w-56">
                <div className="text-xs font-medium 2xs:text-base">
                  {values.from} {tokenFrom.symbol}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 1xs:justify-between">
              <div className="flex 1xs:w-26 ">
                <div className="text-xs font-medium 2xs:text-base text-slate-400">Receiving</div>
              </div>
              <div className="flex w-56">
                <div className="text-xs font-medium break-all 2xs:text-base 2xs:w-auto w:52">
                  {values.to} {tokenTo.symbol}
                </div>
              </div>
            </div>
          </div>
          <MainButton
            disabled={isProcessing}
            className="flex items-center justify-center rounded-md cursor-pointer h-14 bg-app-blue hover:bg-app-blue disabled:cursor-wait"
            onClick={onConfirm}
          >
            {isProcessing && <Loader size="md" />}
            <div className="text-lg font-medium">Confirm</div>
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
